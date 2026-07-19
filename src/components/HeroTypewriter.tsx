"use client";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const questions = [
  "Tell me about a time you faced a difficult challenge...",
  "How would you design a scalable system for...",
  "What is your greatest professional achievement?",
  "How do you handle conflict in a team setting?",
  "Explain a complex technical concept to a non-technical person."
];

export default function HeroTypewriter() {
  const [text, setText] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentQuestion = questions[questionIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentQuestion.length) {
          setText(currentQuestion.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2500); // Pause at end of sentence
        }
      } else {
        if (text.length > 0) {
          setText(currentQuestion.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setQuestionIndex((prev) => (prev + 1) % questions.length);
        }
      }
    }, isDeleting ? 20 : 50);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, questionIndex]);

  return (
    <div className="flex items-center justify-center mt-8 animate-fade-up-3">
      <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="font-mono text-sm sm:text-base text-slate-600 min-w-[280px] sm:min-w-[420px] text-left h-6 flex items-center">
          <span className="truncate text-slate-700 font-semibold">{text}</span>
          <span className="w-2 h-5 bg-blue-600 animate-pulse ml-1 inline-block rounded-sm"></span>
        </div>
      </div>
    </div>
  );
}
