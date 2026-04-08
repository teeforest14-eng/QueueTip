import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syncCaseFromOfficial } from "@/lib/services/case-status-service";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ caseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { caseId } = await ctx.params;
  const c = await prisma.case.findFirst({
    where: { id: caseId, userId: session.user.id },
  });
  if (!c) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const result = await syncCaseFromOfficial(caseId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, statusLabel: result.statusLabel });
}
