import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ContentLabel } from "@/components/content-label";
import { appPrimaryCtaClass } from "@/lib/app-cta-styles";

export function PrimaryCaseSnapshot({
  formType,
  receiptNumber,
  statusLabel,
  lastSyncedAt,
  groupLabel,
  caseId,
  guidanceSummary,
  waitVsActLabel,
  uscisLive,
}: {
  formType: string;
  receiptNumber: string;
  statusLabel: string | null;
  lastSyncedAt: Date | null;
  groupLabel: string | null;
  caseId: string;
  guidanceSummary: string;
  waitVsActLabel: string;
  uscisLive: boolean;
}) {
  const syncSource = uscisLive
    ? "Last pull attempted from USCIS (Torch) when you run sync."
    : "Practice mode: statuses come from sample-style updates until live USCIS sync is enabled.";

  return (
    <Card className="border-qt-stone-200 bg-gradient-to-br from-white via-white to-qt-mist/25 p-6 shadow-[0_1px_0_rgba(17,17,17,0.04),0_12px_32px_-16px_rgba(17,17,17,0.12)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
              Primary receipt
            </p>
            <Badge tone="outline">Active group</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-qt-text-secondary">
              {groupLabel?.trim() || "Case group"}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-qt-text sm:text-xl">
              {receiptNumber}
            </p>
            <p className="mt-1 text-sm text-qt-text-muted">{formType}</p>
          </div>

          <div className="space-y-3 rounded-xl border border-qt-soft-gray bg-white/90 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <ContentLabel kind="official" />
              <span className="text-[11px] text-qt-text-muted">
                Posted status (from your last sync)
              </span>
            </div>
            <p className="text-base font-medium leading-snug text-qt-text">
              {statusLabel ?? "No status stored yet—run sync from the case page."}
            </p>
            <p className="text-xs text-qt-text-muted">
              Last checked in QueueTip:{" "}
              <span className="font-medium text-qt-text-secondary">
                {lastSyncedAt
                  ? lastSyncedAt.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </span>
            </p>
            <p className="text-[11px] leading-relaxed text-qt-text-muted">
              {syncSource} Always confirm the authoritative line on{" "}
              <span className="font-medium text-qt-text-secondary">
                USCIS Case Status Online
              </span>
              .
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-dashed border-qt-stone-200 bg-qt-mist/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <ContentLabel kind="typical" />
              <span className="text-[11px] text-qt-text-muted">
                QueueTip guidance—not USCIS
              </span>
            </div>
            <p className="text-sm leading-relaxed text-qt-text-secondary">
              {guidanceSummary}
            </p>
            <p className="text-xs font-medium text-qt-text-secondary">
              {waitVsActLabel}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:w-48">
          <Link href={`/app/track/${caseId}`} className={appPrimaryCtaClass}>
            Open case details
          </Link>
          <Link
            href="/app/tools"
            className="rounded-xl border border-qt-soft-gray bg-white px-4 py-2.5 text-center text-sm font-semibold text-qt-text shadow-sm transition-colors hover:bg-qt-mist"
          >
            Verify on USCIS
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function PrimaryCaseEmpty() {
  return (
    <Card className="border-dashed border-qt-stone-300 bg-qt-mist/15 p-6 sm:p-8">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
          No receipts yet
        </p>
        <h2 className="mt-3 font-display text-xl font-semibold text-qt-text">
          Add your first receipt when you are ready
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
          QueueTip will group related forms (for example I-130 with I-485), keep a
          clear timeline, and label what came from a sync versus what is our
          plain-language reading—not a government record.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/app/track/add-case" className={appPrimaryCtaClass}>
            Add receipt
          </Link>
          <Link
            href="/app/prepare"
            className="text-sm font-semibold text-qt-slate underline decoration-qt-slate/30 underline-offset-4"
          >
            Still preparing to file
          </Link>
        </div>
      </div>
    </Card>
  );
}
