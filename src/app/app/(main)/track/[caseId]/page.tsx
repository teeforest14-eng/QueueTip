import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { interpretStatusLabel } from "@/lib/services/interpretation-service";
import { getPlanForUser } from "@/lib/plan";
import { PremiumGroupCompare } from "@/components/app/premium-group-compare";
import { PremiumLockInline } from "@/components/premium-gate";
import { CaseDetailTabs } from "@/components/app/track/case-detail-tabs";
import { TrackSurface } from "@/components/app/track/track-surface";
import { serializeCaseDetail } from "@/lib/serialize-case-detail";
import { SyncButton } from "./sync-button";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;
  const c = await prisma.case.findFirst({
    where: { id: caseId, userId: session.user.id },
    include: {
      caseGroup: {
        include: {
          cases: {
            orderBy: { formType: "asc" },
            include: {
              snapshots: { orderBy: { capturedAt: "desc" }, take: 40 },
            },
          },
        },
      },
      snapshots: { orderBy: { capturedAt: "desc" }, take: 20 },
      events: { orderBy: { occurredAt: "desc" }, take: 30 },
      syncLogs: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  if (!c) notFound();

  const interpretation = c.currentStatusLabel
    ? await interpretStatusLabel(c.currentStatusLabel)
    : null;
  const plan = await getPlanForUser(session.user.id);
  const uscisLive = process.env.USCIS_CASE_STATUS_MODE === "live";
  const payload = serializeCaseDetail(c);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        href="/app/track"
        className="inline-flex text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
      >
        ← Track
      </Link>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Tracked receipt
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            <span className="text-neutral-700">{c.formType}</span>
            <span className="mx-2 text-neutral-300">·</span>
            <span className="font-mono text-[1.05rem] font-medium text-neutral-800 sm:text-xl">
              {c.receiptNumber}
            </span>
          </h1>
          <p className="text-sm text-neutral-600">
            Group:{" "}
            <span className="font-medium text-neutral-800">
              {c.caseGroup.label ?? "Untitled"}
            </span>
            <span className="text-neutral-400">
              {" "}
              · {c.caseGroup.cases.length} linked receipt
              {c.caseGroup.cases.length === 1 ? "" : "s"}
            </span>
          </p>
        </div>
        <SyncButton caseId={c.id} />
      </header>

      <CaseDetailTabs
        data={payload}
        interpretation={interpretation}
        uscisLive={uscisLive}
      />

      <TrackSurface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Compare & activity
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Side-by-side snapshot activity for every receipt in this group. Charts
          reflect data saved in QueueTip, not government processing speed.
        </p>
        <div className="mt-4">
          {plan === "PREMIUM" ? (
            <PremiumGroupCompare
              cases={c.caseGroup.cases}
              currentCaseId={c.id}
            />
          ) : (
            <PremiumLockInline />
          )}
        </div>
      </TrackSurface>
    </div>
  );
}
