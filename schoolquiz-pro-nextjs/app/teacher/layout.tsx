import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="flex items-center justify-between mb-6">
        <span className="tag">TEACHER DASHBOARD</span>
        <div className="flex gap-3">
          <Link className="btn btn-outline" href="/teacher">Quizzes</Link>
          <Link className="btn btn-outline" href="/teacher/quizzes/new">Create Quiz</Link>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
