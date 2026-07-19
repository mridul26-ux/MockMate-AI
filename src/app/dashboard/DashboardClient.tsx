"use client";

import Link from "next/link";
import { ArrowRight, Clock, Star, Trophy, Plus, Sparkles } from "lucide-react";

export default function DashboardClient({ 
  firstName,
  totalInterviews, 
  avgScore, 
  timeSpent, 
  interviews 
}: { 
  firstName: string,
  totalInterviews: number, 
  avgScore: number, 
  timeSpent: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interviews: any[] 
}) {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent rounded-full opacity-70"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent rounded-full opacity-70"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Dashboard Overview
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back, {firstName}</h1>
            <p className="text-slate-500 text-lg max-w-xl">Track your progress, review past feedback, and start your next mock interview to keep improving.</p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/dashboard/new" 
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              New Interview
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-700">Total Interviews</h3>
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{totalInterviews}</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-700">Avg. Score</h3>
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{avgScore}%</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-700">Time Spent</h3>
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{timeSpent} <span className="text-2xl text-slate-400 font-bold">hrs</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-900">Recent Interviews</h2>
          <Link href="/dashboard/history" className="text-sm text-blue-700 hover:text-blue-600 font-medium transition-colors">
            View all history &rarr;
          </Link>
        </div>
        
        <div className="divide-y divide-slate-200">
          {interviews.length > 0 ? interviews.slice(0, 5).map((interview) => (
            <Link 
              key={interview._id.toString()} 
              href={`/interview/${interview._id}/results`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-all group cursor-pointer gap-4 block"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors truncate">{interview.role}</h3>
                <p className="text-sm text-slate-500 truncate">{new Date(interview.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Score</div>
                  <div className={`text-xl font-bold ${interview.overallScore ? (interview.overallScore >= 80 ? 'text-emerald-600' : 'text-yellow-600') : 'text-slate-400'}`}>
                    {interview.overallScore ? `${interview.overallScore}%` : 'N/A'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-blue-700 group-hover:border-blue-600 transition-all shadow-sm group-hover:shadow-md shrink-0">
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
                className="px-8 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-sm hover:shadow"
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
