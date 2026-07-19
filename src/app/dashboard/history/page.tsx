import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";
import Link from "next/link";
import { Trophy, ArrowRight, Calendar, ArrowLeft } from "lucide-react";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let interviews: any[] = [];
  try {
    await connectToDatabase();
    interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Database error in History:", error);
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-500 hover:text-slate-900" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Interview History</h1>
          <p className="text-slate-500">Review all your past mock interviews and their feedback.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-200">
          {interviews.length > 0 ? interviews.map((interview) => (
            <Link 
              key={interview._id.toString()} 
              href={`/interview/${interview._id}/results`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-all group cursor-pointer gap-4 block"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors truncate">{interview.role}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 truncate">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="truncate">{new Date(interview.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Score</div>
                  <div className={`text-xl font-bold ${interview.overallScore ? (interview.overallScore >= 80 ? 'text-emerald-600' : 'text-yellow-600') : 'text-slate-400'}`}>
                    {interview.overallScore ? `${interview.overallScore}%` : 'N/A'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-700 group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-md shrink-0">
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          )) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 mb-6 text-lg">You haven&apos;t completed any interviews yet.</p>
              <Link 
                href="/dashboard/new" 
                className="px-8 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-sm"
              >
                Start First Interview
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
