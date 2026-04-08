import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  checklistItemId: z.string(),
  completed: z.boolean().optional(),
  savedLater: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const item = await prisma.documentChecklistItem.findUnique({
    where: { id: parsed.data.checklistItemId },
  });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const row = await prisma.userChecklistProgress.upsert({
    where: {
      userId_checklistItemId: {
        userId: session.user.id,
        checklistItemId: item.id,
      },
    },
    create: {
      userId: session.user.id,
      checklistItemId: item.id,
      completed: parsed.data.completed ?? false,
      savedLater: parsed.data.savedLater ?? false,
    },
    update: {
      completed: parsed.data.completed ?? undefined,
      savedLater: parsed.data.savedLater ?? undefined,
    },
  });

  return NextResponse.json({ ok: true, progress: row });
}
