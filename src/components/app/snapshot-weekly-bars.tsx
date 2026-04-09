import type { CaseStatusSnapshot } from "@prisma/client";

/** Buckets snapshot counts by week (oldest → newest, left → right) for a lightweight activity strip. */
function weeklyBuckets(
  snapshots: Pick<CaseStatusSnapshot, "capturedAt">[],
  weeks = 8,
): number[] {
  const counts = Array.from({ length: weeks }, () => 0);
  const now = Date.now();
  const W = 7 * 24 * 60 * 60 * 1000;
  for (const s of snapshots) {
    const t = new Date(s.capturedAt).getTime();
    const weekIndex = Math.floor((now - t) / W);
    if (weekIndex >= 0 && weekIndex < weeks) {
      counts[weeks - 1 - weekIndex] += 1;
    }
  }
  return counts;
}

export function SnapshotWeeklyBars({
  snapshots,
  weeks = 8,
}: {
  snapshots: Pick<CaseStatusSnapshot, "capturedAt">[];
  weeks?: number;
}) {
  const buckets = weeklyBuckets(snapshots, weeks);
  const max = Math.max(1, ...buckets);
  const total = buckets.reduce((a, b) => a + b, 0);

  return (
    <div className="mt-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-qt-text-muted">
        Snapshot activity by week
      </p>
      <p className="mt-0.5 text-xs text-qt-text-muted">
        {total === 0
          ? "No history yet—run sync to record status checks."
          : `${total} stored snapshot${total === 1 ? "" : "s"} (local log, not a USCIS guarantee).`}
      </p>
      <div
        className="mt-2 flex h-14 items-end gap-1"
        role="img"
        aria-label={`Weekly snapshot counts: ${buckets.join(", ")}`}
      >
        {buckets.map((c, i) => (
          <div
            key={i}
            className="min-w-0 flex-1 rounded-t bg-qt-slate/80 transition-[height]"
            style={{
              height: `${Math.max(8, (c / max) * 100)}%`,
              opacity: c === 0 ? 0.25 : 1,
            }}
            title={`Week ${i + 1}: ${c} snapshot${c === 1 ? "" : "s"}`}
          />
        ))}
      </div>
      <p className="mt-1 flex justify-between text-[10px] text-qt-text-muted">
        <span>Older</span>
        <span>Recent</span>
      </p>
    </div>
  );
}
