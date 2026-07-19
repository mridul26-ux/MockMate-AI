"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Code, Briefcase, GraduationCap, Loader2, Upload, FileText } from "lucide-react";

export default function NewInterviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: "Software Engineer",
    experience: "Junior",
    skills: "",
    jobDescription: "",
    resumeText: "",
    interviewType: "technical",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("resume", file);

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.success && data.text) {
        setFormData((prev) => ({ ...prev, resumeText: data.text }));
      } else {
        console.error("Failed to parse resume", data.error);
        alert(data.error || "Failed to parse resume");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during file upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, we would save this to the database first
      // and get an interview ID. For now, we'll just navigate to a placeholder ID.
      
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success && data.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        throw new Error("Failed to create interview");
      }
      
    } catch (error) {
      console.error("Failed to setup interview:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Set Up Your Interview</h1>
        <p className="text-slate-500">Tell us what you&apos;re interviewing for so we can tailor the questions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 shadow-sm p-6 md:p-8 rounded-2xl">
        <div className="space-y-4">
          {/* Interview Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, interviewType: "technical" })}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                formData.interviewType === "technical" 
                  ? "border-indigo-600 bg-blue-50 text-blue-800 shadow-sm" 
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Code className="w-6 h-6" />
              <span className="font-medium">Technical</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, interviewType: "hr" })}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                formData.interviewType === "hr" 
                  ? "border-indigo-600 bg-blue-50 text-blue-800 shadow-sm" 
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="font-medium">HR / Behavioral</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Role</label>
            <input 
              type="text" 
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400"
              placeholder="e.g. Frontend Developer, Data Analyst"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
            <div className="relative">
              <select 
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="Internship">Internship</option>
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (2-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
              <GraduationCap className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Key Skills (Optional)</label>
            <input 
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400"
              placeholder="e.g. React, Node.js, System Design"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Description (Optional)</label>
            <textarea 
              rows={4}
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400 custom-scrollbar"
              placeholder="Paste the job description here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Your Resume (PDF / DOCX)</label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 group-hover:text-slate-600">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 mb-3 animate-spin text-blue-700" />
                  ) : resumeFile ? (
                    <FileText className="w-8 h-8 mb-3 text-blue-700" />
                  ) : (
                    <Upload className="w-8 h-8 mb-3" />
                  )}
                  <p className="mb-2 text-sm">
                    {isUploading ? (
                      <span className="font-semibold text-slate-700">Extracting text...</span>
                    ) : resumeFile ? (
                      <span className="font-semibold text-blue-700">{resumeFile.name}</span>
                    ) : (
                      <><span className="font-semibold text-slate-700">Click to upload</span> or drag and drop</>
                    )}
                  </p>
                  {!resumeFile && !isUploading && (
                    <p className="text-xs text-slate-400">PDF or DOCX (MAX. 5MB)</p>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            {formData.resumeText && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                ✓ Resume successfully parsed and attached to your profile.
              </p>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-700/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Interview...
            </>
          ) : (
            <>
              <Bot className="w-5 h-5" />
              Generate Questions
            </>
          )}
        </button>
      </form>
    </div>
  );
}
