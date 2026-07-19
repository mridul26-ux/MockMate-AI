"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight, Loader2, Star, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/interviews/${unwrappedParams.id}`);
        const data = await res.json();
        if (data.success && data.interview) {
          setInterview(data.interview);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching results", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [unwrappedParams.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  if (!interview) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4 border border-blue-100 shadow-sm">
            <Trophy className="w-10 h-10 text-blue-700" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Interview Completed!</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            You&apos;ve successfully completed the {interview.interviewType} interview for the {interview.role} role. Here&apos;s your personalized AI feedback.
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent pointer-events-none"></div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6">Overall Score</h2>
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="552.9"
                strokeDashoffset={552.9 - (552.9 * (interview.overallScore || 0)) / 100}
                className="text-blue-700 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-5xl font-black text-slate-900">{interview.overallScore || 0}</span>
              <span className="text-sm text-slate-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-50">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Key Strengths</h3>
            </div>
            <ul className="space-y-4">
              {interview.strengths && interview.strengths.length > 0 ? (
                interview.strengths.map((strength: string, i: number) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <Star className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No specific strengths identified.</li>
              )}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-rose-50">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Areas for Improvement</h3>
            </div>
            <ul className="space-y-4">
              {interview.weaknesses && interview.weaknesses.length > 0 ? (
                interview.weaknesses.map((weakness: string, i: number) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                    <span>{weakness}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No specific weaknesses identified.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/dashboard"
            className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 flex items-center gap-2"
          >
            Return to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
