/** Horizontal bars for counts per form type (e.g. I-130 / I-485) across the user's cases. */
export function FormMixChart({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).filter(([, n]) => n > 0);
  if (entries.length === 0) {
    return (
      <p className="mt-3 text-sm text-qt-text-secondary">
        Add receipts to see a mix of forms in your portfolio.
      </p>
    );
  }
  const max = Math.max(...entries.map(([, n]) => n));
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-qt-text-muted">
        Forms in your portfolio
      </p>
      {entries
        .sort((a, b) => b[1] - a[1])
        .map(([form, n]) => (
          <div key={form} className="flex items-center gap-3 text-sm">
            <span className="w-14 shrink-0 font-mono text-xs font-semibold text-qt-text">
              {form}
            </span>
            <div className="h-2 min-w-0 flex-1 rounded-full bg-qt-soft-gray">
              <div
                className="h-2 rounded-full bg-qt-slate/85"
                style={{ width: `${Math.max(8, (n / max) * 100)}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs text-qt-text-muted">
              {n}
            </span>
          </div>
        ))}
    </div>
  );
}
