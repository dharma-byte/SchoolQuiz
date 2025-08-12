import { prisma } from "@/lib/prisma";

export default async function TeacherHome() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, subject: true, createdAt: true }
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map(q => (
          <a key={q.id} href={`/teacher/quizzes/${q.id}`} className="card hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="tag">{q.subject}</span>
              <small className="text-neutral-500">{new Date(q.createdAt).toLocaleString()}</small>
            </div>
            <h3 className="font-semibold">{q.title}</h3>
          </a>
        ))}
        {quizzes.length === 0 && (
          <div className="card text-center">No quizzes yet. Create your first quiz!</div>
        )}
      </div>
    </div>
  );
}
