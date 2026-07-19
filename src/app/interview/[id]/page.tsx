"use client";

import { use, useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Mic, MicOff, CheckCircle2, ChevronRight, Loader2, Code as CodeIcon, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism-tomorrow.css";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ActiveInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isEvaluating, setIsEvaluating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [feedback, setFeedback] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Fetch real questions
    const fetchInterview = async () => {
      try {
        const res = await fetch(`/api/interviews/${unwrappedParams.id}`);
        const data = await res.json();
        if (data.success && data.interview) {
          setQuestions(data.interview.questions);
          setResumeText(data.interview.resumeText || "");
          setJobDescription(data.interview.jobDescription || "");
        }
      } catch (error) {
        console.error("Failed to load interview", error);
      }
    };
    fetchInterview();
  }, [unwrappedParams.id]);

  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlayingTTS(true);
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google'));
    if (englishVoice) utterance.voice = englishVoice;
    
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (currentQuestion) {
      // Delay speech slightly to avoid synchronous setState inside effect
      setTimeout(() => speakQuestion(currentQuestion.text), 10);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionIndex, currentQuestion]);

  useEffect(() => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(prev => prev + " " + currentTranscript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!transcript) setFeedback(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.text,
          answer: transcript,
          code: currentQuestion.requiresCode ? code : undefined,
          language: currentQuestion.requiresCode ? language : undefined,
          resumeText,
          jobDescription,
        }),
      });
      const data = await res.json();
      if (data.success) setFeedback(data.evaluation);
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = async () => {
    // Save current evaluation
    const currentEval = {
      question: currentQuestion.text,
      score: feedback?.overallScore || 0,
      feedback: feedback?.feedback || "",
    };
    
    const newEvaluations = [...evaluations, currentEval];
    setEvaluations(newEvaluations);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript("");
      setCode("");
      setFeedback(null);
    } else {
      setIsEvaluating(true);
      try {
        // Save evaluations to DB first
        await fetch(`/api/interviews/${unwrappedParams.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ evaluations: newEvaluations }),
        });
        
        // Run the final evaluation to generate strengths/weaknesses
        const res = await fetch("/api/evaluate-final", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewId: unwrappedParams.id }),
        });
        
        const data = await res.json();
        
        if (data.success) {
          router.push(`/interview/${unwrappedParams.id}/results`);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to finish interview", error);
        router.push("/dashboard");
      }
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
          {currentQuestion.requiresCode && <CodeIcon className="w-5 h-5 text-blue-700" />}
          Mock Interview
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 flex items-center gap-4">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Video, Transcript, and Editor */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 w-full sm:w-1/3 aspect-video border border-slate-200 shrink-0 shadow-sm group">
              <Webcam audio={false} className="w-full h-full object-cover" mirrored={true} />
              {isRecording && (
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                  <span className="text-[10px] font-bold text-red-600 tracking-wider">REC</span>
                </div>
              )}
              {/* Premium Inner Shadow */}
              <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/5 pointer-events-none rounded-2xl"></div>
            </div>
            
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 text-sm tracking-wide">Spoken Answer</h3>
                <button 
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isRecording 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200" 
                      : "bg-blue-700 text-white hover:bg-blue-800 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isRecording ? "Stop Recording" : "Start Answering"}
                </button>
              </div>
              <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm overflow-y-auto max-h-[120px] custom-scrollbar shadow-inner">
                {transcript || (
                  <span className="italic text-slate-400">Explain your thought process aloud...</span>
                )}
              </div>
            </div>
          </div>

          {currentQuestion.requiresCode && (
            <div className="flex-1 bg-[#0d0d0e] border border-neutral-800/50 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/40 ring-1 ring-white/5">
              <div className="bg-[#1a1a1c] border-b border-neutral-800/50 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[#242426] text-neutral-300 text-xs font-mono border border-neutral-700 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="javascript">solution.js (JavaScript)</option>
                    <option value="python">solution.py (Python)</option>
                    <option value="java">Solution.java (Java)</option>
                    <option value="cpp">solution.cpp (C++)</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#141415] border-r border-neutral-800/30 pointer-events-none flex flex-col items-center py-4 text-[#444] font-mono text-xs select-none">
                   {/* Fake line numbers for aesthetic */}
                   {Array.from({length: 15}).map((_, i) => <span key={i} className="mb-[6px]">{i+1}</span>)}
                </div>
                <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={(code) => {
                    const grammar = Prism.languages[language] || Prism.languages.javascript;
                    return Prism.highlight(code, grammar, language);
                  }}
                  padding={16}
                  style={{
                    fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                    fontSize: 14,
                    minHeight: "300px",
                    outline: "none",
                    marginLeft: "40px",
                    lineHeight: "1.5"
                  }}
                  className="editor-container text-emerald-300"
                  textareaClassName="focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Question & Feedback */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 relative">
          <div key={currentQuestionIndex} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold mb-6 border border-blue-100 tracking-wider">
                <div className="w-2 h-2 rounded-full bg-blue-700 animate-pulse"></div>
                QUESTION {currentQuestionIndex + 1}
              </div>
              <div className="flex items-start justify-between gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900">
                  {currentQuestion.text}
                </h2>
                <button
                  onClick={() => speakQuestion(currentQuestion.text)}
                  className={`shrink-0 p-3 rounded-full transition-all ${isPlayingTTS ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-700'}`}
                  title="Listen to question"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleEvaluate}
                disabled={isEvaluating || (!transcript && !code)}
                className="w-full py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Response...
                  </>
                ) : "Submit Answer"}
              </button>
            </div>

          {feedback && !isEvaluating && (
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900">AI Evaluation</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Overall Score</div>
                    <div className="text-3xl font-black text-slate-900">{feedback.overallScore}%</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Accuracy</div>
                    <div className="text-3xl font-black text-emerald-600">{feedback.accuracyScore}%</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 tracking-wide uppercase">Detailed Feedback</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={nextQuestion}
                  className="mt-auto w-full py-4 bg-blue-950 text-white hover:bg-slate-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
