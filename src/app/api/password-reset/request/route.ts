import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

/** Creates a reset token. In production, email the link instead of returning it. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (user) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expires },
    });
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[QueueTip] Password reset link: /reset-password?token=${token}`,
      );
    }
  }
  return NextResponse.json({
    ok: true,
    message:
      "If an account exists for that email, we sent reset instructions.",
  });
}
