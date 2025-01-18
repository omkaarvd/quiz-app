import dbConnect from "@/lib/db-connect";
import { Question, Quiz } from "@/models/quiz";
import { IQuestion, IQuiz } from "@/types/quiz";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const quizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  timeLimit: z.number().min(10).max(300),
  questions: z.array(
    z.object({
      text: z.string().min(1),
      type: z.enum(["MCQ", "TRUE_FALSE"]),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      points: z.number().min(1).max(100),
      order: z.number(),
    })
  ),
});

export async function POST(req: Request) {
  await dbConnect();

  try {
    if (!req.body) {
      return NextResponse.json(
        { message: "Request body is required" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = quizSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { title, description, timeLimit, questions } = validation.data;

    let roomCode = generateRoomCode();
    let isUnique = false;

    while (!isUnique) {
      const existingQuiz = await Quiz.findOne({ roomCode });
      if (!existingQuiz) {
        isUnique = true;
      } else {
        roomCode = generateRoomCode();
      }
    }

    const quiz = new Quiz({
      title,
      description,
      timeLimit,
      roomCode,
      questions: [],
    }) as IQuiz;

    // Save quiz first
    await quiz.save();

    const questionDocs = (await Question.create(
      questions.map((q) => ({
        quiz: quiz._id,
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        order: q.order,
      }))
    )) as IQuestion[];

    quiz.questions = questionDocs.map((q) => q._id as Types.ObjectId);
    await quiz.save();

    return NextResponse.json(
      {
        ...quiz.toObject(),
        questions: questionDocs,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quiz creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
