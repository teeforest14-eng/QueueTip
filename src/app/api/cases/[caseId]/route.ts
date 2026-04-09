import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const patchBody = z.object({
  /** Set to `null` to clear manual field office. */
  fieldOffice: z.union([z.string().min(1).max(200), z.null()]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { caseId } = await params;
  const json = await req.json().catch(() => null);
  const parsed = patchBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const existing = await prisma.case.findFirst({
    where: { id: caseId, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { fieldOffice } = parsed.data;
  const updated = await prisma.case.update({
    where: { id: caseId },
    data:
      fieldOffice !== undefined
        ? { fieldOffice }
        : {},
    select: {
      id: true,
      fieldOffice: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(updated);
}
