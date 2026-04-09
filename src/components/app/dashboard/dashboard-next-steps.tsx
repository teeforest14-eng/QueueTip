import Link from "next/link";
import type { RecommendationCard } from "@/lib/services/recommendation-service";
import { Badge } from "@/components/ui/badge";

export function DashboardNextSteps({ items }: { items: RecommendationCard[] }) {
  return (
    <ul className="space-y-3">
      {items.map((r) => (
        <li
          key={r.title + r.href}
          className="flex flex-col gap-4 rounded-xl border border-qt-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 space-y-2 border-l-[3px] border-qt-slate/40 pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-qt-text">{r.title}</p>
              {r.premiumOnly ? (
                <Badge tone="soft" className="text-[10px]">
                  Premium note
                </Badge>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-qt-text-secondary">
              {r.why}
            </p>
            {r.timing ? (
              <p className="text-xs text-qt-text-muted">{r.timing}</p>
            ) : null}
          </div>
          <Link
            href={r.href}
            className="shrink-0 rounded-xl bg-qt-slate px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            {r.actionLabel}
          </Link>
        </li>
      ))}
    </ul>
  );
}
