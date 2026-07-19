import Link from "next/link";
import { ArrowRight, Bot, Mic, FileText, CheckCircle } from "lucide-react";
import HeroTypewriter from "@/components/HeroTypewriter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Global subtle noise texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span>MockMate AI</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Features</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">How it Works</Link>
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fade-up {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes audio-wave {
              0%, 100% { height: 8px; }
              50% { height: 24px; }
            }
            @keyframes grid-pan {
              0% { transform: perspective(1000px) rotateX(70deg) translateY(0) scale(2.5); }
              100% { transform: perspective(1000px) rotateX(70deg) translateY(64px) scale(2.5); }
            }
            @keyframes orb-float {
              0%, 100% { transform: translate(-50%, -50%) scale(1); }
              33% { transform: translate(-45%, -55%) scale(1.05); }
              66% { transform: translate(-55%, -45%) scale(0.95); }
            }
            .animate-fade-up-1 { animation: fade-up 0.8s ease-out 0.1s both; }
            .animate-fade-up-2 { animation: fade-up 0.8s ease-out 0.2s both; }
            .animate-fade-up-3 { animation: fade-up 0.8s ease-out 0.3s both; }
            .animate-fade-up-4 { animation: fade-up 0.8s ease-out 0.4s both; }
            .animate-fade-up-5 { animation: fade-up 0.8s ease-out 0.5s both; }
          `}} />

          {/* Animated Perspective AI Grid */}
          <div className="absolute inset-x-0 bottom-0 top-1/4 overflow-hidden -z-20 [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]">
            <div 
              className="absolute inset-[-100%] bg-[linear-gradient(to_right,#64748b_1.5px,transparent_1.5px),linear-gradient(to_bottom,#64748b_1.5px,transparent_1.5px)] bg-[size:64px_64px] opacity-40" 
              style={{ animation: 'grid-pan 3s linear infinite' }}
            ></div>
          </div>

          {/* Elegant Floating Orbs */}
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/40 via-indigo-100/10 to-transparent rounded-full blur-3xl opacity-60 -z-10" style={{ animation: 'orb-float 12s ease-in-out infinite' }}></div>
          <div className="absolute top-1/2 left-[30%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent rounded-full blur-3xl opacity-50 -z-10" style={{ animation: 'orb-float 15s ease-in-out infinite reverse' }}></div>
          
          <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#EBE5D9] shadow-sm mb-8 transform transition-transform hover:scale-105 cursor-default animate-fade-up-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-sm font-bold text-foreground tracking-wide uppercase">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground leading-[1.1] animate-fade-up-2">
              Master Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 inline-block transform hover:scale-[1.02] transition-transform cursor-default pb-2">
                Next Interview
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-up-3">
              Experience ultra-realistic mock interviews. Get instant feedback on your technical accuracy, communication, and confidence.
            </p>

            <HeroTypewriter />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-up-4 mt-6">
              <Link 
                href="/dashboard" 
                className="px-10 py-5 bg-blue-700 text-white hover:bg-blue-800 rounded-full font-bold text-lg transition-all flex items-center gap-3 w-full sm:w-auto justify-center shadow-[0_8px_30px_rgb(29,78,216,0.3)] hover:shadow-[0_8px_30px_rgb(29,78,216,0.5)] hover:-translate-y-1 group"
              >
                Start Mock Interview
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="px-10 py-5 bg-card text-card-foreground hover:bg-accent border border-border rounded-full font-bold text-lg transition-all flex items-center gap-3 w-full sm:w-auto justify-center shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                See Features
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-20 pt-10 border-t border-[#EBE5D9]/50 flex flex-col items-center animate-fade-up-5">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Evaluates multiple core skills</p>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-12 opacity-70 grayscale">
                <div className="flex items-center gap-2 text-slate-700 font-bold"><CheckCircle className="w-5 h-5"/> Technical</div>
                <div className="flex items-center gap-2 text-slate-700 font-bold"><CheckCircle className="w-5 h-5"/> Communication</div>
                <div className="flex items-center gap-2 text-slate-700 font-bold"><CheckCircle className="w-5 h-5"/> Clarity</div>
                <div className="flex items-center gap-2 text-slate-700 font-bold"><CheckCircle className="w-5 h-5"/> Confidence</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)] skew-y-[-2deg] origin-top-left -z-10"></div>
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">Why Choose MockMate AI?</h2>
              <p className="text-lg text-muted-foreground">Everything you need to practice, perfect, and perform at your highest level.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-card border border-border hover:border-blue-200/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-blue-100 dark:border-blue-800/50">
                  <Bot className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Tailored Questions</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Questions dynamically generated based on your desired role, experience level, and uploaded resume.
                </p>
              </div>
              
              <div className="p-8 rounded-3xl bg-card border border-border hover:border-emerald-200/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-emerald-100 dark:border-emerald-800/50 relative z-10">
                  <Mic className="w-7 h-7" />
                </div>
                {/* Audio Waveform Animation inside card */}
                <div className="absolute top-8 right-8 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1 bg-emerald-400 rounded-full" style={{ animation: 'audio-wave 1.2s infinite ease-in-out', animationDelay: '0s' }}></div>
                  <div className="w-1 bg-emerald-400 rounded-full" style={{ animation: 'audio-wave 1.2s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                  <div className="w-1 bg-emerald-400 rounded-full" style={{ animation: 'audio-wave 1.2s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                  <div className="w-1 bg-emerald-400 rounded-full" style={{ animation: 'audio-wave 1.2s infinite ease-in-out', animationDelay: '0.1s' }}></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-card-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">Voice Recognition</h3>
                <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
                  Speak your answers naturally. The platform analyzes your verbal responses instantly and accurately.
                </p>
              </div>
              
              <div className="p-8 rounded-3xl bg-card border border-border hover:border-indigo-200/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Detailed Feedback</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Get scored on technical accuracy and communication skills, with actionable insights for improvement.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-background text-center text-muted-foreground text-sm relative z-10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4 font-bold text-foreground">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>MockMate AI</span>
          </div>
          <p>© {new Date().getFullYear()} MockMate AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
