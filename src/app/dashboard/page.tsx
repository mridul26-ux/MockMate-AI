import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let interviews: any[] = [];
  try {
    await connectToDatabase();
    interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Database error in Dashboard:", error);
  }
  const serializedInterviews = JSON.parse(JSON.stringify(interviews));

  // Calculate real stats
  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / totalInterviews)
    : 0;
  
  // Estimate 20 mins per interview
  const timeSpent = (totalInterviews * 20 / 60).toFixed(1);

  return (
    <DashboardClient 
      firstName={user?.firstName || 'User'}
      totalInterviews={totalInterviews} 
      avgScore={avgScore} 
      timeSpent={timeSpent} 
      interviews={serializedInterviews} 
    />
  );
}
