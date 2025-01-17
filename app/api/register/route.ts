// import { NextResponse } from "next/server";
// import { z } from "zod";

// const registerSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validation = registerSchema.safeParse(body);

//     if (!validation.success) {
//       return NextResponse.json(
//         { message: "Invalid input data" },
//         { status: 400 }
//       );
//     }

//     const { name, email, password } = validation.data;

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "Email already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });

//     return NextResponse.json(
//       { message: "User created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
