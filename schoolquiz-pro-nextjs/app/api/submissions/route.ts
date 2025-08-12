import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error custom
  if (!session || session.user?.role !== "STUDENT") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { quizId, answers, timeTakenS } = await req.json();
  if (!quizId || !Array.isArray(answers)) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  // @ts-expect-error custom
  const userId = session.user.id;

  // one attempt only
  const existing = await prisma.submission.findUnique({
    where: { quizId_userId: { quizId, userId } }
  });
  if (existing) return new NextResponse("Already submitted", { status: 409 });

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true }
  });
  if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

  let correct = 0;
  for (const a of answers) {
    const q = quiz.questions.find((qq) => qq.id === a.questionId);
    if (q && q.correctIx === a.selectedIx) correct++;
  }
  const scorePct = Math.round((correct / quiz.questions.length) * 100);

  const submission = await prisma.submission.create({
    data: {
      quizId,
      userId,
      scorePct,
      timeTakenS: timeTakenS ?? 0,
      answers: {
        create: answers.map((a: any) => ({
          questionId: a.questionId,
          selectedIx: a.selectedIx
        }))
      }
    }
  });

  return NextResponse.json({
    id: submission.id,
    scorePct,
    correct,
    total: quiz.questions.length
  });
}
