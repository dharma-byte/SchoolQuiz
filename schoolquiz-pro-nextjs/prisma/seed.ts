import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a default teacher
  const teacherPass = await bcrypt.hash("teacher123", 10);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@schoolquiz.local" },
    update: {},
    create: {
      name: "Admin Teacher",
      email: "teacher@schoolquiz.local",
      role: "TEACHER",
      passwordHash: teacherPass
    }
  });

  // Create a few students with rollNumber = password initially
  const rolls = ["6A001", "6A002", "7B010", "8C015"];
  for (const r of rolls) {
    const pass = await bcrypt.hash(r, 10);
    await prisma.user.upsert({
      where: { rollNumber: r },
      update: {},
      create: {
        name: `Student ${r}`,
        rollNumber: r,
        role: "STUDENT",
        passwordHash: pass
      }
    });
  }

  // Sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "General Science Basics",
      subject: "science",
      ownerId: teacher.id,
      questions: {
        create: [
          {
            text: "What is the chemical symbol for water?",
            correctIx: 0,
            options: { create: [
              { text: "H2O", idx: 0 },
              { text: "CO2", idx: 1 },
              { text: "NaCl", idx: 2 },
              { text: "O2", idx: 3 }
            ]}
          },
          {
            text: "How many planets are in our solar system?",
            correctIx: 1,
            options: { create: [
              { text: "7", idx: 0 },
              { text: "8", idx: 1 },
              { text: "9", idx: 2 },
              { text: "10", idx: 3 }
            ]}
          }
        ]
      }
    }
  });

  console.log("Seed complete. Teacher login: teacher@schoolquiz.local / teacher123");
  console.log("Student roll logins:", rolls.map(r => `${r} / ${r}`).join(", "));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
