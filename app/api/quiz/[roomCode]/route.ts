import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import { Quiz, QuizParticipant, User } from "@/models/quiz";
import { z } from "zod";

const participantSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  await dbConnect();

  try {
    const { roomCode } = await params;
    const { searchParams } = new URL(req.url);
    const questionIndex = parseInt(searchParams.get("index") || "0");

    // Find the quiz and populate the questions
    const quiz = await Quiz.findOne({ roomCode, isActive: true }).populate({
      path: "questions",
      options: { sort: { order: 1 } },
      select: "-correctAnswer", // Exclude correct answer from response
    });

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found or inactive" },
        { status: 404 }
      );
    }

    // Check if questionIndex is valid
    if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
      return NextResponse.json(
        { message: "Invalid question index" },
        { status: 400 }
      );
    }

    const currentQuestion = quiz.questions[questionIndex];
    const totalQuestions = quiz.questions.length;
    const isLastQuestion = questionIndex === totalQuestions - 1;

    return NextResponse.json({
      question: {
        id: currentQuestion._id,
        text: currentQuestion.text,
        type: currentQuestion.type,
        options: currentQuestion.options,
        points: currentQuestion.points,
        timeLimit: quiz.timeLimit,
      },
      metadata: {
        currentIndex: questionIndex,
        totalQuestions,
        isLastQuestion,
        quizTitle: quiz.title,
      },
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { roomCode: string } }
) {
  await dbConnect();

  try {
    const { roomCode } = params;
    const body = await req.json();

    const validation = participantSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid participant data" },
        { status: 400 }
      );
    }

    const { name, email } = validation.data;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: crypto.randomUUID(), // temporary password for guest users
      });
    }

    const quiz = await Quiz.findOne({ roomCode, isActive: true });
    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found or inactive" },
        { status: 404 }
      );
    }

    // Check if participant already exists
    const existingParticipant = await QuizParticipant.findOne({
      quiz: quiz._id,
      user: user._id,
    });

    if (existingParticipant) {
      return NextResponse.json(
        { message: "Already joined quiz", participant: existingParticipant },
        { status: 200 }
      );
    }

    // Create new participant
    const participant = await QuizParticipant.create({
      quiz: quiz._id,
      user: user._id,
      score: 0,
      joinedAt: new Date(),
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error("Participant registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
