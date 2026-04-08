import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ alertId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { alertId } = await ctx.params;
  const alert = await prisma.alert.findFirst({
    where: { id: alertId, userId: session.user.id },
  });
  if (!alert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.alert.update({
    where: { id: alertId },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
