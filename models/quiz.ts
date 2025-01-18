import { Schema, model } from "mongoose";
import {
  IUser,
  IQuiz,
  IQuestion,
  IAnswer,
  IQuizParticipant,
} from "@/types/quiz";
import { models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique automatically creates index
    password: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    roomCode: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 30 },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

const QuestionSchema = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ["MCQ", "TRUE_FALSE"], required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 10 },
  order: { type: Number, required: true },
});

const AnswerSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    participant: {
      type: Schema.Types.ObjectId,
      ref: "QuizParticipant",
      required: true,
    },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    responseTime: { type: Number, required: true },
  },
  { timestamps: true }
);

const QuizParticipantSchema = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
});

// Only add indexes that aren't automatically created by unique: true
QuestionSchema.index({ quiz: 1 });
AnswerSchema.index({ question: 1, participant: 1 });
QuizParticipantSchema.index({ quiz: 1, user: 1 });

export const User = models.User || model<IUser>("User", UserSchema);
export const Quiz = models.Quiz || model<IQuiz>("Quiz", QuizSchema);
export const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);
export const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);
export const QuizParticipant =
  models.QuizParticipant ||
  model<IQuizParticipant>("QuizParticipant", QuizParticipantSchema);

export default {
  User,
  Quiz,
  Question,
  Answer,
  QuizParticipant,
};
