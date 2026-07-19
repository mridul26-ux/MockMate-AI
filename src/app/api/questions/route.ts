import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role, experience, skills, resumeText, jobDescription, interviewType } = await req.json();

    const resumeInstruction = jobDescription 
      ? "CRITICAL INSTRUCTION: Compare the candidate's resume to the job description. Generate highly personalized questions based on the gaps, overlaps, and specific technical requirements between their experience and the job description." 
      : "Ask at least one highly personalized question based on their past experience or projects.";

    const isTechnical = interviewType === "technical";
    
    const structureInstruction = isTechnical 
      ? "Generate exactly 5 questions. The first 3 questions must be general technical or behavioral questions based on their resume. The last 2 questions MUST be coding challenges where the candidate needs to write code."
      : "Generate exactly 3 questions. They should be behavioral or general HR questions.";

    // The prompt guides the AI to generate a structured set of questions
    const prompt = `You are an expert technical and HR interviewer. Generate interview questions for a ${experience} ${role}.
    The interview type is ${interviewType}.
    ${structureInstruction}
    ${skills ? `Make sure to include questions relevant to these skills: ${skills}.` : ""}
    ${jobDescription ? `The candidate is interviewing for a role with this job description:\n${jobDescription}\n` : ""}
    ${resumeText ? `The candidate provided their resume below. \n\nRESUME:\n${resumeText}\n\n${resumeInstruction}` : ""}
    
    Provide the questions in order of difficulty.
    For each question, provide a short "expectedAnswerKeyPoints" array detailing what a good answer should include.
    Indicate if a question requires the candidate to write code.`;

    let questions;
    try {
      const result = await generateObject({
        model: google("gemini-2.0-flash"),
        system: "You are an expert HR and Technical Interviewer.",
        prompt: prompt,
        schema: z.object({
          questions: z.array(
            z.object({
              text: z.string().describe("The interview question text."),
              difficulty: z.enum(["easy", "medium", "hard"]),
              requiresCode: z.boolean().describe("True if this question is a coding challenge."),
              expectedAnswerKeyPoints: z.array(z.string()).describe("Key concepts the candidate should mention."),
            })
          ),
        }),
      });
      questions = result.object.questions;
    } catch (aiError) {
      console.warn("AI generation failed, likely due to rate limits. Using fallback questions.", aiError);
      // Fallback questions to prevent the app from crashing on strict free-tier rate limits
      questions = isTechnical ? [
        {
          text: `Can you walk me through your experience as a ${role}, specifically highlighting any projects where you used ${skills || 'relevant technologies'}?`,
          difficulty: "easy",
          requiresCode: false,
          expectedAnswerKeyPoints: ["Clear communication", "Relevance to the role", "Specific project examples"]
        },
        {
          text: "Describe a time when you faced a significant technical challenge or a tight deadline. How did you handle it?",
          difficulty: "medium",
          requiresCode: false,
          expectedAnswerKeyPoints: ["Problem-solving skills", "Time management", "Resilience"]
        },
        {
          text: "How do you ensure the code you write is maintainable, scalable, and fully tested?",
          difficulty: "medium",
          requiresCode: false,
          expectedAnswerKeyPoints: ["Testing practices", "Clean code principles", "Design patterns"]
        },
        {
          text: "Write a function to reverse a string or array without using built-in reverse methods.",
          difficulty: "medium",
          requiresCode: true,
          expectedAnswerKeyPoints: ["Correct algorithm implementation", "Edge case handling", "Time/Space complexity awareness"]
        },
        {
          text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          difficulty: "hard",
          requiresCode: true,
          expectedAnswerKeyPoints: ["Use a HashMap/Dictionary for O(n) time", "Return correct indices", "Handle edge cases"]
        }
      ] : [
        {
          text: `Can you walk me through your experience as a ${role}?`,
          difficulty: "easy",
          requiresCode: false,
          expectedAnswerKeyPoints: ["Clear communication", "Relevance to the role", "Specific project examples"]
        },
        {
          text: "Describe a time when you faced a significant challenge or a tight deadline. How did you handle it?",
          difficulty: "medium",
          requiresCode: false,
          expectedAnswerKeyPoints: ["Problem-solving skills", "Time management", "Resilience"]
        },
        {
          text: "Where do you see yourself in 5 years, and how does this role align with your goals?",
          difficulty: "medium",
          requiresCode: false,
          expectedAnswerKeyPoints: ["Ambition", "Alignment with company", "Growth mindset"]
        }
      ];
    }

    await connectToDatabase();

    const newInterview = new Interview({
      userId,
      role,
      experience,
      skills,
      jobDescription,
      resumeText,
      interviewType,
      questions: questions,
    });

    await newInterview.save();

    return NextResponse.json({ success: true, interviewId: newInterview._id }, { status: 200 });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
