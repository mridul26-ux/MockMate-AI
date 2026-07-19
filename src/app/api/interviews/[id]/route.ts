import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    await connectToDatabase();
    const interview = await Interview.findOne({ _id: resolvedParams.id, userId });

    if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, interview }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const resolvedParams = await params;
    await connectToDatabase();
    
    const interview = await Interview.findOneAndUpdate(
      { _id: resolvedParams.id, userId },
      { $set: body },
      { new: true }
    );

    if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, interview }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}
