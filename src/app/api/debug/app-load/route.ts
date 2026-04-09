import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildRecommendationsForUser } from "@/lib/services/recommendation-service";
import { getPlanForUser } from "@/lib/plan";

export const dynamic = "force-dynamic";

type Step = { step: string; ok: boolean; error?: string };

/**
 * Pinpoints which DB/query step breaks after login. Enable with QUEUETIP_DIAGNOSTIC=1
 * (or NODE_ENV=development). While logged in, open GET /api/debug/app-load in the browser.
 */
export async function GET() {
  const enabled =
    process.env.NODE_ENV !== "production" ||
    process.env.QUEUETIP_DIAGNOSTIC === "1" ||
    process.env.QUEUETIP_DIAGNOSTIC === "true";
  if (!enabled) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, step: "auth", error: "No session" },
      { status: 401 },
    );
  }

  const userId = session.user.id;
  const steps: Step[] = [];

  async function run(name: string, fn: () => Promise<unknown>) {
    try {
      await fn();
      steps.push({ step: name, ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      steps.push({ step: name, ok: false, error: msg });
    }
  }

  await run("userProfile.findUnique", () =>
    prisma.userProfile.findUnique({ where: { userId } }),
  );
  await run("onboardingAnswer.findUnique", () =>
    prisma.onboardingAnswer.findUnique({ where: { userId } }),
  );
  await run("caseGroup.findMany", () =>
    prisma.caseGroup.findMany({
      where: { userId },
      include: { cases: true },
      orderBy: { updatedAt: "desc" },
    }),
  );
  await run("alert.findMany", () =>
    prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  );
  await run("buildRecommendationsForUser", () =>
    buildRecommendationsForUser(userId),
  );
  await run("getPlanForUser", () => getPlanForUser(userId));
  await run("case.findFirst", () =>
    prisma.case.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { caseGroup: true },
    }),
  );
  await run("interpretationRule.findMany", () =>
    prisma.interpretationRule.findMany({
      where: { active: true },
      orderBy: { priority: "desc" },
    }),
  );
  await run("recommendationRule.findMany", () =>
    prisma.recommendationRule.findMany({
      where: { active: true },
      orderBy: { priority: "desc" },
    }),
  );

  const failed = steps.filter((s) => !s.ok);
  return NextResponse.json(
    { ok: failed.length === 0, userId, steps },
    { status: failed.length === 0 ? 200 : 500 },
  );
}
