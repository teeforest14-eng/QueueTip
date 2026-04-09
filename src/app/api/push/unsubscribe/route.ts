import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  endpoint: z.string().url().optional(),
});

/** Remove one subscription by endpoint, or all for the user if endpoint omitted. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    /* empty body */
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const userId = session.user.id;
  const endpoint = parsed.data.endpoint;

  if (endpoint) {
    await prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });
  } else {
    await prisma.pushSubscription.deleteMany({ where: { userId } });
  }

  const remaining = await prisma.pushSubscription.count({ where: { userId } });
  if (remaining === 0) {
    await prisma.notificationPreference.updateMany({
      where: { userId },
      data: { pushEnabled: false },
    });
  }

  return NextResponse.json({ ok: true });
}
