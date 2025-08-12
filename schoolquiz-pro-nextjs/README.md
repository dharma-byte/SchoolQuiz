# 🎓 SchoolQuiz Pro — Next.js (App Router)

Separate, secure portals for Teachers and Students. Teachers can create and manage quizzes; Students log in with roll numbers, take each quiz **only once**, and view results. Built with **Next.js 14**, **Prisma + SQLite**, **NextAuth (Credentials)**, and **Tailwind**.

## ✨ Features
- App Router, server actions where relevant
- **Role-separated** interfaces: `/teacher` and `/student`
- **Auth**: Teacher (email/password) & Student (rollNumber/password). First-time student password = roll number
- **Create quizzes** with MCQs; mark a single correct option
- **Take quiz once** enforced at DB level (unique submission)
- **Results view** on completion
- **Change password** page for students
- Tailwind UI styled similar to your static prototype

## 🚀 Quick start

```bash
# 1) Unzip and install deps
npm install

# 2) Prepare env
cp .env.example .env
# edit AUTH_SECRET to a strong value

# 3) Create DB schema
npx prisma db push

# 4) Seed sample data (one teacher and few students)
npm run prisma:seed

# 5) Run
npm run dev
```

- App: http://localhost:3000
- Teacher login: `teacher@schoolquiz.local` / `teacher123`
- Student examples: `6A001` / `6A001` (password initially equals roll number)

## 🧭 Routes
- `/` — Landing (choose student/teacher portal)
- `/login?role=student` — Student login
- `/login?role=teacher` — Teacher login
- `/teacher` — Manage quizzes (auth: TEACHER)
- `/teacher/quizzes/new` — Create quiz
- `/teacher/quizzes/[id]` — Quiz details & submissions
- `/student` — List of published quizzes (auth: STUDENT)
- `/student/quizzes/[id]` — Take quiz (10-minute timer)
- `/student/result` — Post-submission result view
- `/student/password` — Change password

## 🔐 Auth details
- NextAuth with credential providers (teacher vs student)
- Middleware protects `/teacher/*` and `/student/*`
- Prisma schema models users, quizzes, questions, options, submissions (unique per user/quiz)

## 🛠 Notes
- This is local-first using SQLite; you can switch to Postgres by changing `DATABASE_URL` and running `prisma db push`.
- Correct answers are never sent to the student client; scoring is done on the server.
- Students cannot re-submit because of a DB-level unique constraint and API check.

Enjoy! 🎉
