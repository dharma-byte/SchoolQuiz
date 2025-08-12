import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg">Choose your portal</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card text-center">
          <h2 className="text-xl font-bold mb-2">Student Portal</h2>
          <p className="mb-4">Log in with your Roll Number to take published quizzes.</p>
          <Link className="btn btn-primary" href="/login?role=student">Go to Student Login →</Link>
        </div>
        <div className="card text-center">
          <h2 className="text-xl font-bold mb-2">Teacher Portal</h2>
          <p className="mb-4">Log in with your email to create and manage quizzes.</p>
          <Link className="btn btn-secondary" href="/login?role=teacher">Go to Teacher Login →</Link>
        </div>
      </div>
    </div>
  );
}
