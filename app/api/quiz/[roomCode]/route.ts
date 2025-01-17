// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { z } from "zod";

// const generateRoomCode = () => {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   let code = "";
//   for (let i = 0; i < 6; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// };

// const quizSchema = z.object({
//   title: z.string().min(1),
//   description: z.string().optional(),
//   timeLimit: z.number().min(10).max(300),
//   questions: z.array(
//     z.object({
//       text: z.string().min(1),
//       type: z.enum(["MCQ", "TRUE_FALSE"]),
//       options: z.array(z.string()),
//       correctAnswer: z.string(),
//       points: z.number().min(1).max(100),
//       order: z.number(),
//     })
//   ),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validation = quizSchema.safeParse(body);

//     if (!validation.success) {
//       return NextResponse.json(
//         { message: "Invalid input data" },
//         { status: 400 }
//       );
//     }

//     const { title, description, timeLimit, questions } = validation.data;

//     let roomCode;
//     let isUnique = false;
//     while (!isUnique) {
//       roomCode = generateRoomCode();
//       const existingQuiz = await prisma.quiz.findUnique({
//         where: { roomCode },
//       });
//       if (!existingQuiz) {
//         isUnique = true;
//       }
//     }

//     const quiz = await prisma.quiz.create({
//       data: {
//         title,
//         description,
//         timeLimit,
//         roomCode: roomCode!,
//         creatorId: "session.user.id",
//         questions: {
//           create: questions.map((q) => ({
//             text: q.text,
//             type: q.type,
//             options: q.options,
//             correctAnswer: q.correctAnswer,
//             points: q.points,
//             order: q.order,
//           })),
//         },
//       },
//     });

//     return NextResponse.json(quiz, { status: 201 });
//   } catch (error) {
//     console.error("Quiz creation error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
