"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Option = { id: string; text: string; idx: number };
type Question = { id: string; text: string; options: Option[] };
type Quiz = { id: string; title: string; subject: string; questions: Question[] };

export default function TakeQuiz() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load quiz
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setQuiz(null);
    setIndex(0);
    setAnswers({});
    setTimeLeft(600);

    fetch(`/api/quizzes/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setQuiz(data);
      })
      .catch(() => !cancelled && setError("Failed to load quiz"));
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (timeLeft <= 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (error) {
    return <div className="card text-red-600">Error: {error}</div>;
  }
  if (!quiz) {
    return <div className="card">Loading...</div>;
  }

  const total = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
  if (total === 0) {
    return <div className="card">This quiz has no questions yet.</div>;
  }

  // Clamp index to a safe range
  const safeIndex = Math.min(Math.max(index, 0), total - 1);
  const q = quiz.questions[safeIndex];
  const progress = Math.round(((safeIndex + 1) / total) * 100);

  function select(ix: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: ix }));
  }

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        quizId: quiz.id,
        timeTakenS: Math.max(0, 600 - timeLeft),
        answers: Object.entries(answers).map(([questionId, selectedIx]) => ({
          questionId,
          selectedIx,
        })),
      };

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        alert("You have already submitted this quiz.");
        router.push("/student");
        return;
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to submit.");
      }

      const data = await res.json();
      router.push(`/student/result?score=${data.scorePct}&correct=${data.correct}&total=${data.total}`);
    } catch (e) {
      alert((e as Error).message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="text-center rounded-2xl p-4 text-white"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <h2 className="text-2xl font-bold">{quiz.title}</h2>
        <div className="h-2 bg-neutral-200 rounded mt-3">
          <div className="h-2 bg-green-500 rounded" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <span>
            Question {safeIndex + 1} of {total}
          </span>
          <span className="bg-red-500 px-3 py-1 rounded-full">
            ⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="card mt-4">
        <p className="text-sm text-neutral-500 mb-1">Question {safeIndex + 1}</p>
        <h3 className="text-lg font-semibold mb-4">{q.text}</h3>

        <div className="grid gap-2">
          {q.options
            .slice() // copy just in case
            .sort((a, b) => a.idx - b.idx)
            .map((o) => {
              const selected = answers[q.id] === o.idx;
              return (
                <button
                  key={o.id}
                  onClick={() => select(o.idx)}
                  className={`text-left px-4 py-3 rounded-xl border-2 ${
                    selected ? "border-green-600 bg-green-100" : "border-neutral-200 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + o.idx)}.</span> {o.text}
                </button>
              );
            })}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button className="btn btn-outline" disabled={safeIndex === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
            ← Previous
          </button>
          {safeIndex === total - 1 ? (
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>
              Finish Quiz →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
