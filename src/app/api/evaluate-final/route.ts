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

    const { interviewId } = await req.json();
    if (!interviewId) return NextResponse.json({ error: "Interview ID required" }, { status: 400 });

    await connectToDatabase();
    
    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) return NextResponse.json({ error: "Interview not found" }, { status: 404 });

    const evaluations = interview.evaluations || [];
    if (evaluations.length === 0) {
      return NextResponse.json({ error: "No evaluations found to process" }, { status: 400 });
    }

    // Calculate overall score (average of all answer overallScores)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalScore = evaluations.reduce((acc: number, curr: any) => acc + (curr.overallScore || 0), 0);
    const overallScore = Math.round(totalScore / evaluations.length);

    // Extract all feedbacks to synthesize strengths and weaknesses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allFeedbacks = evaluations.map((e: any, index: number) => `Q${index + 1} Feedback: ${e.feedback}`).join("\n");

    const prompt = `You are an expert technical recruiter analyzing an interview's detailed feedback.
    
    Here is the feedback for all the candidate's answers:
    ${allFeedbacks}
    
    Based on this feedback, identify the top 3 strengths and top 3 weaknesses of the candidate. Keep them concise and actionable.`;

    let finalEval;
    try {
      const result = await generateObject({
        model: google("gemini-2.0-flash"),
        system: "You are an expert HR and Technical Interviewer.",
        prompt: prompt,
        schema: z.object({
          finalEval: z.object({
            strengths: z.array(z.string()).describe("Top 3 concise strengths."),
            weaknesses: z.array(z.string()).describe("Top 3 concise weaknesses or areas for improvement."),
          }),
        }),
      });
      finalEval = result.object.finalEval;
    } catch (aiError) {
      console.warn("AI final evaluation failed, using fallback.", aiError);
      finalEval = {
        strengths: ["Clear communication", "Good foundational knowledge"],
        weaknesses: ["Could dive deeper into technical details", "Need more practice on edge cases"]
      };
    }

    // Update database
    interview.overallScore = overallScore;
    interview.strengths = finalEval.strengths;
    interview.weaknesses = finalEval.weaknesses;
    await interview.save();

    return NextResponse.json({ 
      success: true, 
      overallScore, 
      strengths: finalEval.strengths, 
      weaknesses: finalEval.weaknesses 
    });

  } catch (error) {
    console.error("Error generating final evaluation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate final evaluation" },
      { status: 500 }
    );
  }
}
