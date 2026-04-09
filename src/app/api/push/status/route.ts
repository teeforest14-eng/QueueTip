import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPushConfigured } from "@/lib/push-server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const [count, prefs] = await Promise.all([
    prisma.pushSubscription.count({ where: { userId } }),
    prisma.notificationPreference.findUnique({ where: { userId } }),
  ]);
  return NextResponse.json({
    serverConfigured: isPushConfigured(),
    subscriptionCount: count,
    pushEnabled: prefs?.pushEnabled ?? false,
  });
}
