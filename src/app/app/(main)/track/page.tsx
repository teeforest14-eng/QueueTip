import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { aggregateGroupStats } from "@/lib/track-group-stats";
import { TrackPageHeader } from "@/components/app/track/track-page-header";
import { CaseGroupSummaryCard } from "@/components/app/track/case-group-summary-card";
import { TrackEmptyState } from "@/components/app/track/track-empty-state";
import { TrackSurface } from "@/components/app/track/track-surface";
import { appPrimaryCtaClass } from "@/lib/app-cta-styles";

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const groups = await prisma.caseGroup.findMany({
    where: { userId: session.user.id },
    include: { cases: { orderBy: { formType: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <TrackPageHeader />

      {groups.length === 0 ? (
        <TrackEmptyState />
      ) : (
        <div className="space-y-10">
          {groups.map((g) => {
            const stats = aggregateGroupStats(g);
            return (
              <section key={g.id} className="space-y-5">
                <CaseGroupSummaryCard
                  title={g.label ?? "My case group"}
                  receiptCount={stats.receiptCount}
                  formsLabel={stats.formsLabel}
                  primaryStatus={stats.primaryStatus}
                  stageSummary={stats.stageSummary}
                  lastSyncedAt={stats.lastSyncedAt}
                  lastGroupUpdatedAt={stats.lastGroupUpdatedAt}
                  fieldOffice={stats.fieldOffice}
                  latestCaseId={stats.latestCaseId}
                />
                <TrackSurface className="p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Receipts in this group
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Open the tabbed workspace for official lines, guidance, and
                    history.
                  </p>
                  <ul className="mt-5 divide-y divide-neutral-100">
                    {g.cases.map((c) => (
                      <li
                        key={c.id}
                        className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="font-mono text-sm font-medium text-neutral-900">
                            {c.receiptNumber}
                          </p>
                          <p className="text-sm text-neutral-600">{c.formType}</p>
                          <p className="text-sm font-medium text-neutral-800">
                            {c.currentStatusLabel ?? "—"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Last sync:{" "}
                            {c.lastSyncedAt
                              ? c.lastSyncedAt.toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "never"}
                          </p>
                        </div>
                        <Link
                          href={`/app/track/${c.id}`}
                          className={
                            appPrimaryCtaClass +
                            " inline-flex shrink-0 justify-center px-4 py-2.5 text-center"
                          }
                        >
                          Open workspace
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TrackSurface>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
