import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters"),
  firstName: z.string().max(120).optional(),
  lastName: z.string().max(120).optional(),
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
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { email, password, firstName, lastName } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          firstName: firstName ?? null,
          lastName: lastName ?? null,
        },
      },
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      notifPrefs: { create: {} },
    },
  });
  return NextResponse.json({ ok: true });
}
