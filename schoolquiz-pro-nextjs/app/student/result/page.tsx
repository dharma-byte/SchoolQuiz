"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const sp = useSearchParams();
  const score = sp.get("score");
  const correct = sp.get("correct");
  const total = sp.get("total");
  const router = useRouter();

  return (
    <div className="text-center">
      <div className="rounded-2xl p-8 text-white mb-4" style={{ background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"}}>
        <h2 className="text-3xl font-bold mb-2">{score}%</h2>
        <p>Congratulations! You've completed the quiz</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><h3 className="font-semibold mb-2">Correct</h3><p className="text-2xl font-bold text-green-600">{correct}</p></div>
        <div className="card"><h3 className="font-semibold mb-2">Wrong</h3><p className="text-2xl font-bold text-red-600">{Number(total)-Number(correct)}</p></div>
        <div className="card"><h3 className="font-semibold mb-2">Total</h3><p className="text-2xl font-bold">{total}</p></div>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        <button className="btn btn-primary" onClick={()=>router.push('/student')}>📚 Back to Quizzes</button>
      </div>
    </div>
  );
}
