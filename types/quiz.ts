import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  totalPoints: number;
  gamesPlayed: number;
  gamesWon: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  roomCode: string;
  isActive: boolean;
  timeLimit: number;
  questions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion extends Document {
  quiz: Types.ObjectId;
  text: string;
  type: "MCQ" | "TRUE_FALSE";
  options: string[];
  correctAnswer: string;
  points: number;
  order: number;
}

export interface IAnswer extends Document {
  question: Types.ObjectId;
  participant: Types.ObjectId;
  answer: string;
  isCorrect: boolean;
  responseTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizParticipant extends Document {
  quiz: Types.ObjectId;
  user: Types.ObjectId;
  score: number;
  joinedAt: Date;
  finishedAt?: Date;
  currentStreak: number;
  maxStreak: number;
}
