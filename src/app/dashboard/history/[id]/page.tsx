import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";
import HistoryClient from "./HistoryClient";

export default async function InterviewReportPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  await connectToDatabase();
  const report = await Interview.findOne({ _id: unwrappedParams.id, userId });

  if (!report) {
    return <div className="text-center py-12 text-white">Interview not found.</div>;
  }

  const serializedReport = JSON.parse(JSON.stringify(report));

  // Calculate specific scores if not available directly
  const accuracyScore = Math.round(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report.evaluations.reduce((acc: number, curr: any) => acc + (curr.feedback.includes("accuracy") ? curr.score : curr.score), 0) / Math.max(report.evaluations.length, 1)
  );
  
  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <HistoryClient 
      report={serializedReport} 
      accuracyScore={accuracyScore} 
      formattedDate={formattedDate} 
    />
  );
}
