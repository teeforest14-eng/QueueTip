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
