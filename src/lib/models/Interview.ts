import mongoose, { Schema, Document } from "mongoose";

export interface IInterview extends Document {
  userId: string;
  role: string;
  experience: string;
  interviewType: string;
  skills: string;
  jobDescription: string;
  resumeText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluations: any[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  interviewType: { type: String, required: true },
  skills: { type: String, default: "" },
  jobDescription: { type: String, default: "" },
  resumeText: { type: String, default: "" },
  questions: { type: Array, default: [] },
  evaluations: { type: Array, default: [] },
  overallScore: { type: Number, default: 0 },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
