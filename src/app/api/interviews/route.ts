import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    
    const interview = new Interview({
      userId,
      ...body
    });

    await interview.save();

    return NextResponse.json({ success: true, interview }, { status: 201 });
  } catch (error) {
    console.error("Error saving interview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save interview" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, interviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
