import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { question, answer, code, language, resumeText, jobDescription } = await req.json();

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.
    
    Question asked: "${question}"
    Candidate's Spoken Answer: "${answer}"
    ${code ? `Candidate's Written Code (Language: ${language || 'javascript'}):\n\`\`\`\n${code}\n\`\`\`\n` : ""}
    ${jobDescription ? `Job Description context:\n${jobDescription}\n` : ""}
    ${resumeText ? `Candidate's Resume context:\n${resumeText}\n` : ""}
    
    Evaluate the candidate's response. If code was provided, verify if the code is correct, efficient, and handles edge cases. The code should be evaluated specifically for correct syntax and idiomatic patterns in ${language || 'the chosen programming language'}. Evaluate the spoken answer for how well they explained their thought process.
    If no code was provided but the question required it, penalize them.
    ${resumeText ? `CRITICAL INSTRUCTION: Since you have the candidate's resume, evaluate if they are properly leveraging their past experience in their answer. If they give a generic answer, provide specific feedback on how they should have used their resume experience to strengthen their answer.` : ""}
    
    Evaluate based on the following criteria:
    1. Technical Accuracy
    2. Communication Clarity
    3. Completeness
    
    Provide a score out of 100 for each, an overall score, and detailed constructive feedback.`;

    let evaluation;
    try {
      const result = await generateObject({
        model: google("gemini-2.0-flash"),
        system: "You are a fair but rigorous technical interviewer.",
        prompt: prompt,
        schema: z.object({
          evaluation: z.object({
            accuracyScore: z.number().min(0).max(100),
            communicationScore: z.number().min(0).max(100),
            completenessScore: z.number().min(0).max(100),
            overallScore: z.number().min(0).max(100),
            feedback: z.string().describe("Detailed constructive feedback explaining the scores and how to improve."),
            idealAnswer: z.string().describe("A brief example of a perfect answer to this question."),
          }),
        }),
      });
      evaluation = result.object.evaluation;
    } catch (aiError) {
      console.warn("AI evaluation failed, likely due to rate limits. Using fallback evaluation.", aiError);
      // Fallback evaluation to prevent app crash on strict rate limits
      evaluation = {
        accuracyScore: 75,
        communicationScore: 80,
        completenessScore: 70,
        overallScore: 75,
        feedback: "Due to API rate limits, this is a simulated fallback evaluation. To improve your real answers, ensure you clearly outline the problem, discuss your approach step-by-step, and explicitly mention any trade-offs or edge cases.",
        idealAnswer: "A strong technical answer should follow the STAR method (Situation, Task, Action, Result) and clearly articulate the technical reasoning behind your decisions."
      };
    }

    return NextResponse.json({ success: true, evaluation: evaluation });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
