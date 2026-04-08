import { prisma } from "@/lib/prisma";
import { isValidReceiptFormat, normalizeReceiptNumber } from "@/lib/validation";
import { evaluateDelayForCase } from "@/lib/services/delay-service";
import type { SyncResult } from "@/lib/services/case-sync-types";
import { syncCaseFromUscisApi } from "@/lib/services/uscis-case-status";

const MOCK_STATUSES = [
  "Case Was Received",
  "Case Is Being Actively Reviewed",
  "Request for Additional Evidence Was Mailed",
  "Fingerprints Were Taken",
  "Interview Was Scheduled",
  "Case Was Approved",
] as const;

export type { SyncResult } from "@/lib/services/case-sync-types";

/**
 * Entry point for “refresh status”: mock by default, USCIS Torch API when
 * `USCIS_CASE_STATUS_MODE=live` and `uscis-case-status.ts` is implemented.
 */
export async function syncCaseFromOfficial(caseId: string): Promise<SyncResult> {
  const mode = process.env.USCIS_CASE_STATUS_MODE ?? "mock";
  if (mode === "live") {
    return syncCaseFromUscisApi(caseId);
  }
  return syncCaseFromOfficialMock(caseId);
}

/** Mock sync: validates receipt shape and rotates/plucks a plausible status. */
export async function syncCaseFromOfficialMock(
  caseId: string,
): Promise<SyncResult> {
  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c) return { ok: false, error: "Case not found" };
  const normalized = normalizeReceiptNumber(c.receiptNumber);
  if (!isValidReceiptFormat(normalized)) {
    return {
      ok: false,
      error:
        "Receipt number format looks invalid. Official receipts usually look like MSC1290123456 (3 letters + 10 digits).",
    };
  }

  const unavailable = Math.random() < 0.03;
  if (unavailable) {
    await prisma.syncLog.create({
      data: {
        caseId,
        success: false,
        message: "Official source unavailable (simulated). Try again shortly.",
      },
    });
    await prisma.case.update({
      where: { id: caseId },
      data: { syncUnavailable: true, isStale: true },
    });
    return {
      ok: false,
      error:
        "We could not reach the practice data source this time. Nothing was changed on your real government filing.",
    };
  }

  const pick =
    MOCK_STATUSES[Math.floor(Math.random() * MOCK_STATUSES.length)] ??
    "Case Was Received";
  const prev = c.currentStatusLabel;

  await prisma.$transaction(async (tx) => {
    await tx.case.update({
      where: { id: caseId },
      data: {
        currentStatusLabel: pick,
        lastSyncedAt: new Date(),
        isStale: false,
        syncUnavailable: false,
      },
    });
    await tx.caseStatusSnapshot.create({
      data: {
        caseId,
        statusLabel: pick,
        description:
          "Practice snapshot from QueueTip mock sync — not a government record.",
        source: "mock",
        isOfficial: false,
      },
    });
    await tx.caseEvent.create({
      data: {
        caseId,
        title: "Status refresh",
        description: `Mock sync recorded: ${pick}`,
        kind: "status_change",
      },
    });
    await tx.syncLog.create({
      data: {
        caseId,
        success: true,
        message: "Mock sync completed",
      },
    });
  });

  if (prev && prev !== pick) {
    const { maybeNotifyStatusChange } = await import(
      "@/lib/services/notification-service"
    );
    await maybeNotifyStatusChange(c.userId, {
      receipt: normalized,
      formType: c.formType,
      status: pick,
    });
  }

  await evaluateDelayForCase(caseId);

  return { ok: true, statusLabel: pick };
}
