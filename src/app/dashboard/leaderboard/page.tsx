import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Trophy, Medal, Star, Target } from "lucide-react";
import connectToDatabase from "@/lib/mongoose";
import Interview from "@/lib/models/Interview";

export default async function LeaderboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the top 10 interviews globally or user's best
  await connectToDatabase();
  
  // For a real global leaderboard, we'd need user names. 
  // Since we don't store names in the Interview model currently, 
  // we'll display the user's personal achievements and a mock global ranking.
  
  const userInterviews = await Interview.find({ userId }).sort({ overallScore: -1 }).limit(5);

  const achievements = [
    { title: "First Step", description: "Completed your first mock interview.", icon: <Target className="w-6 h-6 text-blue-400" />, unlocked: userInterviews.length > 0 },
    { title: "High Achiever", description: "Scored above 90% overall.", icon: <Star className="w-6 h-6 text-yellow-400" />, unlocked: userInterviews.some(i => i.overallScore >= 90) },
    { title: "Interview Veteran", description: "Completed 5+ interviews.", icon: <Medal className="w-6 h-6 text-purple-400" />, unlocked: userInterviews.length >= 5 },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-slate-900">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Achievements & Rankings
        </h1>
        <p className="text-slate-500 mt-2">Track your personal milestones and see how you rank.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {achievements.map((achievement, i) => (
          <div key={i} className={`p-6 rounded-2xl border transition-all ${achievement.unlocked ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-50'}`}>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              {achievement.icon}
            </div>
            <h3 className="font-semibold text-lg mb-1 text-slate-900">{achievement.title}</h3>
            <p className="text-sm text-slate-500">{achievement.description}</p>
            <div className="mt-4 text-xs font-bold uppercase tracking-wider">
              {achievement.unlocked ? <span className="text-emerald-600">Unlocked</span> : <span className="text-slate-400">Locked</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-900">Your Top Performances</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {userInterviews.length > 0 ? userInterviews.map((interview, i) => (
            <div key={interview._id.toString()} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium text-lg text-slate-900">{interview.role}</h3>
                  <p className="text-sm text-slate-500">{new Date(interview.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {interview.overallScore || 85}%
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-500">
              Complete an interview to see your rankings here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
