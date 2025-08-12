import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="flex items-center justify-between mb-6">
        <span className="tag">STUDENT DASHBOARD</span>
        <div className="flex gap-3">
          <Link className="btn btn-outline" href="/student">Quizzes</Link>
          <Link className="btn btn-outline" href="/student/password">Change Password</Link>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
