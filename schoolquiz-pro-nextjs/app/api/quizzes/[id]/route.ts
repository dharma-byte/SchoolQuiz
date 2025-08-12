import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { id: "asc" },
        include: { options: { orderBy: { idx: "asc" } } }
      }
    }
  });

  if (!quiz) return new NextResponse("Not found", { status: 404 });

  // Send a clean payload, hide correctIx
  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    subject: quiz.subject,
    questions: (quiz.questions ?? []).map((q) => ({
      id: q.id,
      text: q.text,
      options: (q.options ?? []).map((o) => ({
        id: o.id,
        text: o.text,
        idx: o.idx
      }))
    }))
  });
}
