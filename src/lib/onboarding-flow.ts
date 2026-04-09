import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function ensureOnboardingRow(userId: string) {
  let onb = await prisma.onboardingAnswer.findUnique({ where: { userId } });
  if (!onb) {
    onb = await prisma.onboardingAnswer.create({
      data: {
        userId,
        completed: false,
        skipped: false,
        lastStep: 0,
        formsInvolved: [],
      },
    });
  }
  return onb;
}

export async function redirectIfNeedsOnboarding(userId: string) {
  let onb;
  try {
    onb = await ensureOnboardingRow(userId);
  } catch (e) {
    console.error("[QueueTip] ensureOnboardingRow failed:", e);
    throw e;
  }
  if (!onb.completed && !onb.skipped) {
    redirect("/app/onboarding");
  }
}
