import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, subject: true, createdAt: true }
  });
  return NextResponse.json(quizzes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error custom
  if (!session || session.user?.role !== "TEACHER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, subject, questions } = await req.json();

  // Validate shape & content
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof subject !== "string" ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) return new NextResponse("Invalid payload", { status: 400 });

  for (const q of questions) {
    if (
      !q?.text?.trim() ||
      !Array.isArray(q?.options) ||
      q.options.length !== 4 ||
      q.options.some((t: string) => typeof t !== "string" || !t.trim()) ||
      typeof q.correctIx !== "number" ||
      q.correctIx < 0 ||
      q.correctIx > 3
    ) {
      return new NextResponse("Invalid question/options", { status: 400 });
    }
  }

  const created = await prisma.quiz.create({
    data: {
      title: title.trim(),
      subject: subject.trim(),
      // @ts-expect-error custom
      ownerId: session.user.id,
      questions: {
        create: questions.map((q: any) => ({
          text: q.text.trim(),
          correctIx: q.correctIx,
          options: {
            create: q.options.map((text: string, idx: number) => ({
              text: text.trim(),
              idx
            }))
          }
        }))
      }
    }
  });

  return NextResponse.json({ id: created.id });
}
