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

function coerceInterpretOutput(
  raw: unknown,
  statusLabel: string,
): InterpretationOutput {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return fallback(statusLabel);
  }
  const o = raw as Record<string, unknown>;
  const w = o.waitVsAct;
  const waitVsAct =
    w === "wait" || w === "act" || w === "either" ? w : undefined;
  const base = fallback(statusLabel);
  return {
    summary: typeof o.summary === "string" ? o.summary : base.summary,
    typicalMeaning:
      typeof o.typicalMeaning === "string" ? o.typicalMeaning : base.typicalMeaning,
    waitVsAct: waitVsAct ?? base.waitVsAct,
    confidence: typeof o.confidence === "string" ? o.confidence : base.confidence,
    officialTools: Array.isArray(o.officialTools)
      ? o.officialTools.filter((x): x is string => typeof x === "string")
      : base.officialTools,
    documentsToPrepare: Array.isArray(o.documentsToPrepare)
      ? o.documentsToPrepare.filter((x): x is string => typeof x === "string")
      : base.documentsToPrepare,
  };
}

export async function interpretStatusLabel(
  statusLabel: string,
): Promise<InterpretationOutput> {
  try {
    const rules = await prisma.interpretationRule.findMany({
      where: { active: true },
      orderBy: { priority: "desc" },
    });
    for (const rule of rules) {
      try {
        const re = new RegExp(rule.statusPattern, "i");
        if (re.test(statusLabel)) {
          return coerceInterpretOutput(rule.outputJson, statusLabel);
        }
      } catch {
        continue;
      }
    }
    return fallback(statusLabel);
  } catch (e) {
    console.error("[QueueTip] interpretStatusLabel failed:", e);
    return fallback(statusLabel);
  }
}
