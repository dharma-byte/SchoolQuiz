import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SchoolQuiz Pro",
  description: "Interactive Learning Platform for Students & Teachers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <header className="text-center text-white mb-6">
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow">🎓 SchoolQuiz Pro</h1>
            <p className="opacity-90">Interactive Learning Platform for Students & Teachers</p>
          </header>
          <main className="card">{children}</main>
          <footer className="text-center text-white mt-6 opacity-80">
            <p>© {new Date().getFullYear()} SchoolQuiz Pro</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
