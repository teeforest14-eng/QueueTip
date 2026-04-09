import type { AppPath } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPlanForUser, type PlanTier } from "@/lib/plan";

export type RecommendationCard = {
  title: string;
  why: string;
  actionLabel: string;
  href: string;
  timing?: string;
  priority: number;
  premiumOnly?: boolean;
};

export async function buildRecommendationsForUser(userId: string): Promise<
  RecommendationCard[]
> {
  const [onboarding, cases, plan] = await Promise.all([
    prisma.onboardingAnswer.findUnique({ where: { userId } }),
    prisma.case.findMany({ where: { userId } }),
    getPlanForUser(userId),
  ]);

  const rules = await prisma.recommendationRule.findMany({
    where: { active: true },
    orderBy: { priority: "desc" },
  });

  const cards: RecommendationCard[] = [];

  const pushFromRule = (condition: string) => {
    const rule = rules.find((r) => r.condition === condition);
    if (!rule) return;
    const raw = rule.outputJson;
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return;
    const j = raw as Record<string, string>;
    cards.push({
      title: j.title ?? "Suggested next step",
      why: j.why ?? "",
      actionLabel: j.actionLabel ?? "Open",
      href: j.href ?? "/app/dashboard",
      timing: j.timing,
      priority: rule.priority,
    });
  };

  if (!onboarding?.completed && !onboarding?.skipped) {
    pushFromRule("onboarding_incomplete");
  }

  if (
    onboarding?.routedPath === "TRACK" ||
    onboarding?.journeyCategory === "ALREADY_FILED"
  ) {
    if (cases.length === 0) pushFromRule("track_no_cases");
  }

  if (onboarding?.routedPath === "PREPARE" || onboarding?.journeyCategory === "PREPARING_TO_FILE") {
    cards.push({
      title: "Continue your filing checklist",
      why: "Small steps now reduce RFE risk later.",
      actionLabel: "Open Prepare",
      href: "/app/prepare",
      timing: "15–30 minutes",
      priority: 80,
    });
  }

  if (onboarding?.journeyCategory === "RFE_OR_ISSUE") {
    cards.push({
      title: "Walk through your issue calmly",
      why: "Resolve separates official meaning, typical patterns, and when to escalate.",
      actionLabel: "Open Resolve",
      href: "/app/resolve",
      timing: "10 minutes",
      priority: 85,
    });
  }

  cards.push({
    title: "Verify on official Case Status",
    why: "QueueTip never replaces USCIS systems for authoritative updates.",
    actionLabel: "Official tools",
    href: "/app/tools",
    timing: "2 minutes",
    priority: 10,
  });

  if (plan === "FREE") {
    cards.push({
      title: "Compare timelines with Premium",
      why: "Premium adds richer compare views and deeper saved workflows—optional, not required for basics.",
      actionLabel: "View plans",
      href: "/app/billing",
      priority: 5,
      premiumOnly: true,
    });
  }

  return cards.sort((a, b) => b.priority - a.priority);
}

export function defaultPathForOnboarding(input: {
  journeyCategory: string | null | undefined;
  alreadyFiled: boolean | null | undefined;
}): AppPath {
  if (input.journeyCategory === "JUST_EXPLORING") return "EXPLORE";
  if (input.journeyCategory === "PREPARING_TO_FILE") return "PREPARE";
  if (input.journeyCategory === "RFE_OR_ISSUE") return "RESOLVE";
  if (input.journeyCategory === "WAITING_TOO_LONG") return "RESOLVE";
  if (input.alreadyFiled) return "TRACK";
  return "PREPARE";
}

export function premiumLocked(plan: PlanTier): boolean {
  return plan === "FREE";
}
