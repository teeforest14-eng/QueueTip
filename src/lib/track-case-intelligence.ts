import type { InterpretationOutput } from "@/lib/services/interpretation-service";

export type PossibleOutcome = {
  label: string;
  meaning: string;
  likelihood: "common" | "possible" | "less common";
  timingHint?: string;
};

export type Watchout = {
  title: string;
  detail: string;
};

export function estimatedCaseStage(statusLabel: string | null): string {
  if (!statusLabel) return "Awaiting first status";
  const l = statusLabel.toLowerCase();
  if (l.includes("received")) return "Early intake";
  if (l.includes("fingerprint") || l.includes("biometric")) return "Biometrics phase";
  if (l.includes("interview")) return "Interview path";
  if (l.includes("rfe") || l.includes("evidence")) return "Evidence / RFE";
  if (l.includes("approved")) return "Decision — favorable";
  if (l.includes("denied")) return "Decision — unfavorable";
  if (l.includes("transferred")) return "Routing / transfer";
  if (l.includes("card") || l.includes("produced")) return "Document production";
  return "Active processing";
}

export function nextLikelyMilestone(
  formType: string,
  statusLabel: string | null,
): string {
  const s = (statusLabel ?? "").toLowerCase();
  const isWorkAuth = /I-765|EAD/i.test(formType);
  const isTravel = /I-131|AP/i.test(formType);
  const is485 = /I-485/i.test(formType);
  if (!statusLabel) return "First USCIS status line after sync";
  if (s.includes("received")) {
    if (is485) return "Biometrics notice or case transfer (varies)";
    if (isWorkAuth) return "EAD processing update or card production (varies)";
    if (isTravel) return "Advance parole decision or RFE (varies)";
    return "Next queue milestone per form type";
  }
  if (s.includes("fingerprint") || s.includes("biometric")) {
    return "Interview scheduling, RFE, or continued queue (varies)";
  }
  if (s.includes("interview")) {
    return "Decision or follow-up request";
  }
  return "Next posted update on USCIS Case Status";
}

const DEFAULT_OUTCOMES: PossibleOutcome[] = [
  {
    label: "Biometrics appointment",
    meaning: "USCIS may schedule you to capture fingerprints and photo.",
    likelihood: "common",
    timingHint: "Often within several weeks to a few months after receipt, varies widely.",
  },
  {
    label: "Request for Evidence (RFE)",
    meaning: "USCIS may ask for additional documents before deciding.",
    likelihood: "possible",
    timingHint: "Can arrive at many stages; response deadlines are strict.",
  },
  {
    label: "Interview scheduled",
    meaning: "For some categories, an in-person or remote interview may be required.",
    likelihood: "possible",
  },
  {
    label: "Case approved",
    meaning: "USCIS issues a favorable decision on the petition or application.",
    likelihood: "common",
    timingHint: "Timing depends on form type, workload, and office — not predictable here.",
  },
  {
    label: "Case transferred",
    meaning: "The file may move to another service center or field office.",
    likelihood: "possible",
  },
  {
    label: "Card or document produced",
    meaning: "After approval, USCIS may produce EAD, green card, advance parole, etc.",
    likelihood: "common",
  },
];

export function possibleOutcomesForStatus(statusLabel: string | null): PossibleOutcome[] {
  const s = (statusLabel ?? "").toLowerCase();
  const out = [...DEFAULT_OUTCOMES];
  if (s.includes("received")) {
    return out;
  }
  if (s.includes("actively reviewed") || s.includes("review")) {
    return out.map((o) =>
      o.label.includes("RFE")
        ? { ...o, likelihood: "common" as const }
        : o,
    );
  }
  if (s.includes("fingerprint") || s.includes("biometric")) {
    return out.filter((o) => !o.label.includes("Biometrics"));
  }
  if (s.includes("approved")) {
    return out.filter((o) => o.label.includes("Card") || o.label.includes("approved"));
  }
  return out;
}

export function nextActionsChecklist(
  interpretation: InterpretationOutput | null,
  formType: string,
): { do: string[]; avoid: string[]; monitor: string[] } {
  const wva = interpretation?.waitVsAct;
  const wait =
    wva === "wait"
      ? "Mostly monitor official channels; avoid unnecessary duplicate filings."
      : wva === "act"
        ? "Review notices and official instructions; respond before any deadline."
        : "Confirm time-sensitive items on USCIS Case Status and any paper notices.";

  return {
    do: [
      "Save every USCIS receipt and notice in one place.",
      "Keep your mailing address current in USCIS systems.",
      `Track ${formType} milestones in context of your full case group.`,
      wait,
    ],
    avoid: [
      "Do not submit duplicate applications unless USCIS or counsel instructs you to.",
      "Do not rely on QueueTip as proof of government status — verify on USCIS Case Status.",
    ],
    monitor: [
      "Biometrics or appointment letters (mail and online case updates).",
      "Processing-time ranges for your form type (official USCIS tool).",
      "Any RFE or interview notice with a response deadline.",
    ],
  };
}

export function buildWatchouts(input: {
  daysSinceAdded: number;
  daysSinceSync: number | null;
  daysSinceStatusSnapshot: number | null;
  statusLabel: string | null;
}): Watchout[] {
  const w: Watchout[] = [];
  if (input.daysSinceSync != null && input.daysSinceSync > 14) {
    w.push({
      title: "Sync is a bit stale",
      detail:
        "Run a fresh sync when you can, and still confirm the latest line on USCIS Case Status.",
    });
  }
  if (
    input.statusLabel?.toLowerCase().includes("received") &&
    input.daysSinceStatusSnapshot != null &&
    input.daysSinceStatusSnapshot > 90
  ) {
    w.push({
      title: "Long time in “received” posture",
      detail:
        "Many cases sit in queue for extended periods. Compare to published processing ranges; escalate only with facts or counsel.",
    });
  }
  if (input.daysSinceAdded > 0 && input.daysSinceAdded < 21) {
    w.push({
      title: "Early tracking window",
      detail:
        "Notices often arrive by mail after online updates — keep both in mind.",
    });
  }
  return w;
}

export function timelineEstimateBlocks(input: {
  formType: string;
  fieldOffice: string | null;
  serviceCenter: string | null;
}): { title: string; body: string; disclaimer: boolean }[] {
  return [
    {
      title: "USCIS average range (national)",
      body: `Use the official USCIS processing times tool for ${input.formType}. QueueTip does not replace that reference.`,
      disclaimer: true,
    },
    {
      title: input.fieldOffice
        ? `Field office context (${input.fieldOffice})`
        : "Field office context",
      body: input.fieldOffice
        ? "Local queues can differ from national averages. Estimates here are practice-level only — not a prediction."
        : "Add your field office when known to anchor future timeline copy and reminders.",
      disclaimer: true,
    },
    {
      title: input.serviceCenter
        ? `Service center (${input.serviceCenter})`
        : "Service center",
      body: input.serviceCenter
        ? "Some forms are primarily adjudicated at a service center before any local steps."
        : "If USCIS shows a service center on your notice, you can record it when we expose that field from sync.",
      disclaimer: true,
    },
    {
      title: "Most likely next update window",
      body: "Depends on form type, office workload, and case path. Treat any window as informational, not a commitment.",
      disclaimer: true,
    },
  ];
}
