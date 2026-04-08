import { prisma } from "@/lib/prisma";

export type PlanTier = "FREE" | "PREMIUM";

export async function getPlanForUser(userId: string): Promise<PlanTier> {
  if (process.env.QUEUETIP_FORCE_PREMIUM === "true") return "PREMIUM";
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub || sub.status !== "ACTIVE") return "FREE";
  return sub.plan === "PREMIUM" ? "PREMIUM" : "FREE";
}
