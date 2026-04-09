import Link from "next/link";
import type { Case, CaseStatusSnapshot } from "@prisma/client";
import { SnapshotWeeklyBars } from "./snapshot-weekly-bars";
import { ContentLabel } from "@/components/content-label";

export type CaseWithSnapshots = Case & {
  snapshots: CaseStatusSnapshot[];
};

export function PremiumGroupCompare({
  cases,
  currentCaseId,
}: {
  cases: CaseWithSnapshots[];
  currentCaseId: string;
}) {
  return (
    <div className="mt-2 space-y-4">
      <div>
        <ContentLabel kind="official" />
        <p className="mt-2 text-sm text-qt-text-secondary">
          Each column is one receipt in your group. Status text is whatever we last stored from sync
          (USCIS Torch when live mode is on; otherwise practice data). Charts count{" "}
          <strong>snapshots saved in QueueTip</strong>, not government processing speed.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cases.map((kase) => {
          const active = kase.id === currentCaseId;
          return (
            <div
              key={kase.id}
              className={`rounded-xl border border-qt-soft-gray bg-white p-4 shadow-sm ${
                active ? "ring-2 ring-qt-slate/25" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-qt-text-muted">
                    {kase.formType}
                  </p>
                  <p className="font-mono text-sm font-medium text-qt-text">
                    {kase.receiptNumber}
                  </p>
                  {active ? (
                    <span className="mt-1 inline-block text-[10px] font-semibold text-qt-slate">
                      Viewing now
                    </span>
                  ) : null}
                </div>
                <Link
                  href={`/app/track/${kase.id}`}
                  className="text-xs font-semibold text-qt-slate underline underline-offset-2"
                >
                  Open
                </Link>
              </div>
              <p className="mt-3 text-sm font-medium text-qt-text">
                {kase.currentStatusLabel ?? "—"}
              </p>
              <p className="text-xs text-qt-text-muted">
                Last sync:{" "}
                {kase.lastSyncedAt
                  ? kase.lastSyncedAt.toLocaleString()
                  : "never"}
              </p>
              <SnapshotWeeklyBars snapshots={kase.snapshots} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
