import { headers } from "next/headers";

async function fetchQuizzes() {
  const h = headers();
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const base = `${protocol}://${host}`;

  const res = await fetch(`${base}/api/quizzes`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load quizzes");
  return res.json();
}

export default async function StudentHome() {
  const quizzes = await fetchQuizzes();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map((q: any) => (
          <a key={q.id} href={`/student/quizzes/${q.id}`} className="card hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <span className="tag">{q.subject}</span>
              <small className="text-neutral-500">{new Date(q.createdAt).toLocaleString()}</small>
            </div>
            <h3 className="font-semibold">{q.title}</h3>
          </a>
        ))}
        {quizzes.length === 0 && (
          <div className="card text-center">No quizzes yet. Please check back later.</div>
        )}
      </div>
    </div>
  );
}
