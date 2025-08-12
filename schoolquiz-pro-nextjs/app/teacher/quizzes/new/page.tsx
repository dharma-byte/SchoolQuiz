"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Q = { text: string; options: string[]; correctIx: number };

export default function NewQuiz() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("english");
  const [questions, setQuestions] = useState<Q[]>([
    { text: "", options: ["", "", "", ""], correctIx: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateQuestion(ix: number, data: Partial<Q>) {
    setQuestions((prev) => prev.map((q, i) => (i === ix ? { ...q, ...data } : q)));
  }

  function updateOption(qIx: number, optIx: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIx ? { ...q, options: q.options.map((o, j) => (j === optIx ? value : o)) } : q
      )
    );
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, questions })
      });
      if (!res.ok) throw new Error(await res.text());
      const { id } = await res.json();
      router.push(`/teacher/quizzes/${id}`);
    } catch {
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Create Quiz</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card space-y-3">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Grammar Basics"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Subject</label>
            <select className="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="english">English</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="social">Social Studies</option>
              <option value="computers">Computers</option>
            </select>
          </div>

          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={qi} className="border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Question #{qi + 1}</h3>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qi))}
                  >
                    Delete
                  </button>
                </div>

                <input
                  className="input mb-3"
                  placeholder="Write the question..."
                  value={q.text}
                  onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                />

                <div className="grid gap-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctIx === oi}
                        onChange={() => updateQuestion(qi, { correctIx: oi })}
                      />
                      <input
                        className="input"
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="btn btn-outline"
              type="button"
              onClick={() =>
                setQuestions((prev) => [
                  ...prev,
                  { text: "", options: ["", "", "", ""], correctIx: 0 }
                ])
              }
            >
              + Add Question
            </button>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" type="button" onClick={submit} disabled={loading}>
              {loading ? "Saving..." : "Create Quiz"}
            </button>
          </div>
        </div>

        <div className="card">
          <p className="font-semibold mb-2">Rules</p>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Students will see only published quizzes.</li>
            <li>Each student can submit once per quiz.</li>
            <li>Correct answers are hidden from the client.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
