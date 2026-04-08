import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidReceiptFormat, normalizeReceiptNumber } from "@/lib/validation";

const postSchema = z.object({
  receiptNumber: z.string().min(8),
  formType: z.string().min(1).max(32),
  groupLabel: z.string().max(200).optional(),
  caseGroupId: z.string().optional(),
});

export async function POST(req: Request) {
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
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const userId = session.user.id;
  const receipt = normalizeReceiptNumber(parsed.data.receiptNumber);
  if (!isValidReceiptFormat(receipt)) {
    return NextResponse.json(
      {
        error:
          "Receipt format looks invalid. Use 3 letters + 10 digits (e.g. MSC1290123456).",
      },
      { status: 400 },
    );
  }

  let groupId = parsed.data.caseGroupId;
  if (groupId) {
    const g = await prisma.caseGroup.findFirst({
      where: { id: groupId, userId },
    });
    if (!g) {
      return NextResponse.json({ error: "Case group not found" }, { status: 404 });
    }
  } else {
    const group = await prisma.caseGroup.create({
      data: {
        userId,
        label: parsed.data.groupLabel ?? "My case group",
      },
    });
    groupId = group.id;
  }

  const existing = await prisma.case.findFirst({
    where: { userId, receiptNumber: receipt },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You already added this receipt." },
      { status: 409 },
    );
  }

  const c = await prisma.case.create({
    data: {
      userId,
      caseGroupId: groupId!,
      receiptNumber: receipt,
      formType: parsed.data.formType,
      currentStatusLabel: "Case Was Received",
      lastSyncedAt: new Date(),
    },
  });
  await prisma.caseStatusSnapshot.create({
    data: {
      caseId: c.id,
      statusLabel: "Case Was Received",
      description:
        "Initial practice record — run a sync to simulate updates (not a government pull in V1).",
      source: "user",
      isOfficial: false,
    },
  });
  await prisma.caseEvent.create({
    data: {
      caseId: c.id,
      title: "Receipt added",
      description: `Form ${parsed.data.formType} linked in QueueTip.`,
      kind: "milestone",
    },
  });

  return NextResponse.json({ ok: true, caseId: c.id, caseGroupId: groupId });
}
