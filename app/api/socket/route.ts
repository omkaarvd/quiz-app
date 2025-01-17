// import { Server } from "socket.io";
// import { NextApiResponseServerIO } from "@/types/socket";
// import prisma from "@/lib/prisma";

// const ioHandler = (req: Request, res: NextApiResponseServerIO) => {
//   if (!res.socket.server.io) {
//     const io = new Server(res.socket.server.io);
//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       console.log("Client connected");

//       socket.on("join-room", async (roomCode: string, userId: string) => {
//         socket.join(roomCode);

//         const quiz = await prisma.quiz.findUnique({
//           where: { roomCode },
//           include: { participants: true },
//         });

//         if (quiz) {
//           io.to(roomCode).emit("player-joined", {
//             userId,
//             participantCount: quiz.participants.length,
//           });
//         }
//       });

//       socket.on("submit-answer", async (data) => {
//         const { roomCode, userId, questionId, answer, responseTime } = data;

//         const question = await prisma.question.findUnique({
//           where: { id: questionId },
//         });

//         if (question) {
//           const isCorrect = answer === question.correctAnswer;
//           const points = isCorrect ? question.points : 0;

//           await prisma.answer.create({
//             data: {
//               questionId,
//               participantId: userId,
//               answer,
//               isCorrect,
//               responseTime,
//             },
//           });

//           await prisma.quizParticipant.update({
//             where: { id: userId },
//             data: {
//               score: { increment: points },
//               currentStreak: isCorrect ? { increment: 1 } : 0,
//               maxStreak: {
//                 increment: isCorrect ? 1 : 0,
//               },
//             },
//           });

//           io.to(roomCode).emit("answer-submitted", {
//             userId,
//             isCorrect,
//             points,
//           });
//         }
//       });

//       socket.on("disconnect", () => {
//         console.log("Client disconnected");
//       });
//     });
//   }

//   return new Response("Socket is set up", { status: 200 });
// };

// export { ioHandler as GET, ioHandler as POST };
