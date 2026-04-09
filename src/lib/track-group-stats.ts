import type { Case, CaseGroup } from "@prisma/client";
import { estimatedCaseStage } from "@/lib/track-case-intelligence";

type GroupWithCases = CaseGroup & { cases: Case[] };

export function aggregateGroupStats(group: GroupWithCases) {
  const { cases } = group;
  const forms = [...new Set(cases.map((c) => c.formType))].sort();
  let latest: Case | null = null;
  let latestSync: Date | null = null;
  for (const c of cases) {
    if (c.lastSyncedAt && (!latestSync || c.lastSyncedAt > latestSync)) {
      latestSync = c.lastSyncedAt;
      latest = c;
    }
  }
  if (!latest && cases.length) latest = cases[0] ?? null;
  const primaryStatus =
    latest?.currentStatusLabel ??
    cases.find((c) => c.currentStatusLabel)?.currentStatusLabel ??
    null;
  const anyOffice = cases.find((c) => c.fieldOffice)?.fieldOffice ?? null;
  let lastGroupUpdatedAt: Date | null = null;
  for (const c of cases) {
    if (!lastGroupUpdatedAt || c.updatedAt > lastGroupUpdatedAt) {
      lastGroupUpdatedAt = c.updatedAt;
    }
  }
  return {
    receiptCount: cases.length,
    formsLabel: forms.join(", "),
    forms,
    primaryStatus,
    stageSummary: estimatedCaseStage(primaryStatus),
    lastSyncedAt: latestSync,
    latestCaseId: latest?.id ?? null,
    fieldOffice: anyOffice,
    lastGroupUpdatedAt,
  };
}
