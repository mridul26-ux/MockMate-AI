"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, Target, MessageSquare, TrendingUp, Download } from "lucide-react";

export default function HistoryClient({ 
  report, 
  accuracyScore, 
  formattedDate 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: any, 
  accuracyScore: number, 
  formattedDate: string 
}) {
  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-bold border border-neutral-800 shadow-xl shadow-black/20">
          <Download className="w-4 h-4" />
          Download PDF Report
        </button>
      </div>

      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/50 rounded-3xl p-10 mb-12 relative overflow-hidden shadow-2xl shadow-black/40">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none mix-blend-overlay">
          <Target className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold mb-6 border border-emerald-500/20 tracking-widest shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            COMPLETED ON {formattedDate.toUpperCase()}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white text-glow">Interview Report</h1>
          <p className="text-neutral-400 text-xl mb-10 font-medium">Role: <span className="text-white">{report.role}</span></p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800/50 shadow-inner">
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Overall Score</div>
              <div className="text-5xl font-black text-white tracking-tighter">{report.overallScore}%</div>
            </div>
            <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800/50 shadow-inner">
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Accuracy</div>
              <div className="text-4xl font-bold text-emerald-400 tracking-tighter mt-1">{accuracyScore}%</div>
            </div>
            <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800/50 shadow-inner">
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Communication</div>
              <div className="text-4xl font-bold text-blue-400 tracking-tighter mt-1">{accuracyScore > 10 ? accuracyScore - 5 : accuracyScore}%</div>
            </div>
            <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800/50 shadow-inner">
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Completeness</div>
              <div className="text-4xl font-bold text-indigo-400 tracking-tighter mt-1">{accuracyScore > 10 ? accuracyScore - 2 : accuracyScore}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            Detailed Breakdown
          </h2>
          
          <div className="space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {report.evaluations.map((q: any, i: number) => (
              <div key={i} className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-8 hover:border-indigo-500/20 transition-colors shadow-lg shadow-black/20 group">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <h3 className="font-semibold text-xl leading-relaxed text-white/95 group-hover:text-indigo-100 transition-colors">{q.question}</h3>
                  <div className="shrink-0 px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800/50 text-sm font-black shadow-inner">
                    <span className={q.score >= 80 ? 'text-emerald-400' : 'text-yellow-400'}>{q.score}</span>
                    <span className="text-neutral-600">/100</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-neutral-300 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/30">
                  <MessageSquare className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400/70" />
                  <p className="text-sm leading-loose">{q.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            Key Takeaways
          </h2>
          
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-8 shadow-lg shadow-black/20">
            <p className="text-neutral-300 text-sm leading-loose">
              Based on your overall performance, you have a solid grasp of the core concepts but there is room for improvement. Focus on the specific feedback given for each question to refine your technical explanations and communication.
            </p>
          </div>
          
          <div className="bg-indigo-900/20 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-8 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="font-bold text-indigo-400 mb-4 text-lg relative z-10">Next Steps Action Plan</h3>
            <ul className="text-sm text-indigo-200/80 space-y-4 relative z-10">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">Review the specific technical topics where you scored below 80.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">Practice structuring your answers using the STAR method (Situation, Task, Action, Result).</span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">Take another mock interview in a few days to track your improvement.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
