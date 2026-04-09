import type { CaseGroup, OnboardingAnswer } from "@prisma/client";

type GroupWithCases = CaseGroup & { cases: { id: string }[] };

export function buildDashboardOrientation(
  onb: OnboardingAnswer | null,
  groups: GroupWithCases[],
): string {
  const caseCount = groups.reduce((n, g) => n + g.cases.length, 0);
  const groupCount = groups.length;
  const parts: string[] = [];

  if (caseCount > 0) {
    parts.push(
      `You are following ${caseCount} receipt${caseCount === 1 ? "" : "s"} across ${groupCount} case group${groupCount === 1 ? "" : "s"}.`,
    );
  }

  if (onb?.completed && onb.routedPath) {
    parts.push(
      `Onboarding placed emphasis on ${friendlyPath(onb.routedPath)}—that is a sensible default when you are deciding where to click first.`,
    );
  } else if (onb?.skipped) {
    parts.push(
      "When you have a moment, finishing onboarding tightens which guides and reminders we surface first.",
    );
  } else if (onb && !onb.completed && !onb.skipped) {
    parts.push(
      "Complete the short onboarding flow so we can align the workspace to where you are in the process.",
    );
  }

  if (parts.length === 0) {
    return "When you add receipts, they appear here with clear labels for official sync data versus QueueTip guidance.";
  }

  return parts.join(" ");
}

function friendlyPath(p: string): string {
  const map: Record<string, string> = {
    TRACK: "Track",
    PREPARE: "Prepare",
    RESOLVE: "Resolve",
    EXPLORE: "Explore",
  };
  return map[p] ?? p;
}

export function waitVsActCopy(
  w: "wait" | "act" | "either" | undefined,
): string {
  if (w === "act") {
    return "Suggested posture: review the next checks in your case view or use official channels if something time-sensitive applies.";
  }
  if (w === "wait") {
    return "Suggested posture: continue to monitor; verify material changes on USCIS Case Status rather than relying on timing guesses.";
  }
  return "Suggested posture: confirm details on USCIS tools when in doubt; use QueueTip to stay organized, not as a substitute for official notices.";
}
