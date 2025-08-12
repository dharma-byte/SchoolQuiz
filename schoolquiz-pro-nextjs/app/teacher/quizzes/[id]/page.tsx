import { prisma } from "@/lib/prisma";

export default async function ManageQuiz({ params }: { params: { id: string }}) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: { options: true },
        orderBy: { id: "asc" }
      },
      submissions: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!quiz) return <div>Not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="tag">{quiz.subject}</span>
          <h2 className="text-xl font-bold">{quiz.title}</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h3 className="font-semibold">Questions</h3>
          {quiz.questions.map((q,i) => (
            <div key={q.id} className="border rounded-2xl p-3">
              <p className="font-semibold mb-2">{i+1}. {q.text}</p>
              <ul className="grid gap-1">
                {q.options.sort((a,b)=>a.idx-b.idx).map(o => (
                  <li key={o.id} className={`px-3 py-2 rounded-xl border ${q.correctIx===o.idx ? "bg-green-100 border-green-300 font-semibold" : "bg-neutral-50 border-neutral-200"}`}>
                    {String.fromCharCode(65+o.idx)}. {o.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Submissions</h3>
          <div className="space-y-2">
            {quiz.submissions.map(s => (
              <div key={s.id} className="flex items-center justify-between border rounded-xl p-3">
                <div>
                  <p className="font-semibold">{s.user.name || s.user.rollNumber}</p>
                  <small className="text-neutral-500">{new Date(s.createdAt).toLocaleString()}</small>
                </div>
                <span className="font-bold">{s.scorePct}%</span>
              </div>
            ))}
            {quiz.submissions.length === 0 && <p className="text-neutral-500">No submissions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
