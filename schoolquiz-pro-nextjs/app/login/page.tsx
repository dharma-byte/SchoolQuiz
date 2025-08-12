"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const sp = useSearchParams();
  const role = sp.get("role") === "teacher" ? "teacher" : "student";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    if (role === "teacher") {
      const email = String(form.get("email"));
      const password = String(form.get("password"));
      const res = await signIn("teacher-credentials", { redirect: false, email, password });
      setLoading(false);
      if (res?.ok) router.push("/teacher");
      else setError("Invalid credentials");
    } else {
      const rollNumber = String(form.get("rollNumber"));
      const password = String(form.get("password"));
      const res = await signIn("student-credentials", { redirect: false, rollNumber, password });
      setLoading(false);
      if (res?.ok) router.push("/student");
      else setError("Invalid credentials");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">{role === "teacher" ? "Teacher Login" : "Student Login"}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {role === "teacher" ? (
          <>
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input name="email" type="email" className="input" placeholder="teacher@schoolquiz.local" required />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block mb-2 font-semibold">Roll Number</label>
              <input name="rollNumber" className="input" placeholder="e.g., 6A001" required />
            </div>
          </>
        )}
        <div>
          <label className="block mb-2 font-semibold">Password</label>
          <input name="password" type="password" className="input" required />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={loading} className="btn btn-primary w-full">{loading ? "Signing in..." : "Sign In"}</button>
      </form>
      <div className="text-center mt-4">
        <Link className="underline" href="/">{`← Back to home`}</Link>
      </div>
      {role === "student" && (
        <p className="text-sm text-neutral-500 mt-3 text-center">Tip: first-time login uses Roll Number as password. You can change it later.</p>
      )}
    </div>
  );
}
