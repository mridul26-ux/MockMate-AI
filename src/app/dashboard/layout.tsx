import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bot, History, Plus, LayoutDashboard, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
            <Bot className="w-6 h-6 text-blue-700" />
            <span>MockMate AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/new" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              New Interview
            </Link>
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-800 font-medium transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 text-blue-700" />
              Overview
            </Link>
            <Link 
              href="/dashboard/history" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
            >
              <History className="w-5 h-5" />
              Past Interviews
            </Link>
            <Link 
              href="/dashboard/leaderboard" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
            >
              <Trophy className="w-5 h-5" />
              Achievements
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
