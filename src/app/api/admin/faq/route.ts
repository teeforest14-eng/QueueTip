import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
  sortOrder: z.number().int().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  await prisma.faqEntry.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: true,
    },
  });
  return NextResponse.json({ ok: true });
}
