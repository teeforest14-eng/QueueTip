import { prisma } from "@/lib/prisma";

export type InterpretationOutput = {
  summary: string;
  typicalMeaning?: string;
  waitVsAct?: "wait" | "act" | "either";
  confidence?: string;
  officialTools?: string[];
  documentsToPrepare?: string[];
};

const fallback = (statusLabel: string): InterpretationOutput => ({
  summary: `Latest posted status: ${statusLabel}`,
  typicalMeaning:
    "We could not match this wording to a saved interpretation pattern yet. Treat the official status line as the source of truth and verify on USCIS Case Status.",
  waitVsAct: "either",
  confidence: "low",
  officialTools: ["uscis-case-status", "processing-times"],
});

export async function interpretStatusLabel(
  statusLabel: string,
): Promise<InterpretationOutput> {
  const rules = await prisma.interpretationRule.findMany({
    where: { active: true },
    orderBy: { priority: "desc" },
  });
  for (const rule of rules) {
    try {
      const re = new RegExp(rule.statusPattern, "i");
      if (re.test(statusLabel)) {
        return rule.outputJson as InterpretationOutput;
      }
    } catch {
      continue;
    }
  }
  return fallback(statusLabel);
}
