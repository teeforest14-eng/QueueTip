import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Placeholder upgrade: sets Premium without payment. Replace with Stripe. */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      plan: "PREMIUM",
      status: "ACTIVE",
    },
    update: { plan: "PREMIUM", status: "ACTIVE" },
  });
  return NextResponse.json({ ok: true });
}
