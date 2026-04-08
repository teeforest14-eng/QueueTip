import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!record || record.expires < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or expired." },
      { status: 400 },
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { id: record.id } }),
  ]);
  return NextResponse.json({ ok: true });
}
