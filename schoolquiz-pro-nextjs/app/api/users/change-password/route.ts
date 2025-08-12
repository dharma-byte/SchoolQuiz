import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  // @ts-expect-error custom
  const userId = session.user.id;

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return new NextResponse("Invalid payload", { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return new NextResponse("Not found", { status: 404 });

  const ok = await compare(currentPassword, user.passwordHash);
  if (!ok) return new NextResponse("Incorrect password", { status: 403 });

  const newHash = await hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

  return NextResponse.json({ ok: true });
}
