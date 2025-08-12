// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const { nextUrl } = req;
  const isStudentArea = nextUrl.pathname.startsWith("/student");
  const isTeacherArea = nextUrl.pathname.startsWith("/teacher");

  // Read token from cookies
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (isTeacherArea) {
    if (!token || (token as any).role !== "TEACHER") {
      return NextResponse.redirect(new URL("/login?role=teacher", nextUrl));
    }
  }
  if (isStudentArea) {
    if (!token || (token as any).role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login?role=student", nextUrl));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*"]
};
