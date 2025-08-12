import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      id: "teacher-credentials",
      name: "Teacher",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || user.role !== "TEACHER") return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? null, email: user.email ?? null, role: "TEACHER" as const };
      }
    }),
    Credentials({
      id: "student-credentials",
      name: "Student",
      credentials: {
        rollNumber: { label: "Roll Number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.rollNumber || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { rollNumber: credentials.rollNumber } });
        if (!user || user.role !== "STUDENT") return null;
        const ok = await compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          // @ts-expect-error custom field for convenience
          rollNumber: user.rollNumber ?? null,
          role: "STUDENT" as const
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error custom
        token.role = (user as any).role;
        // @ts-expect-error custom
        token.rollNumber = (user as any).rollNumber ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error custom
        session.user.id = token.sub!;
        // @ts-expect-error custom
        session.user.role = (token as any).role ?? "STUDENT";
        // @ts-expect-error custom
        session.user.rollNumber = (token as any).rollNumber ?? null;
      }
      return session;
    }
  }
};
