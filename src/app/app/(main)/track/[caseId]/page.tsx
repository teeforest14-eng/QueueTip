import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { ContentLabel } from "@/components/content-label";
import { Badge } from "@/components/ui/badge";
import { interpretStatusLabel } from "@/lib/services/interpretation-service";
import { getPlanForUser } from "@/lib/plan";
import { PremiumLockInline } from "@/components/premium-gate";
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
      caseGroup: { include: { cases: { orderBy: { formType: "asc" } } } },
      snapshots: { orderBy: { capturedAt: "desc" }, take: 20 },
      events: { orderBy: { occurredAt: "desc" }, take: 30 },
      syncLogs: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!c) notFound();

  const interpretation = c.currentStatusLabel
    ? await interpretStatusLabel(c.currentStatusLabel)
    : null;
  const plan = await getPlanForUser(session.user.id);

  return (
    <div className="space-y-8">
      <Link
        href="/app/track"
        className="text-sm font-medium text-qt-slate hover:underline"
      >
        ← Track dashboard
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-qt-text">
            {c.formType} —{" "}
            <span className="font-mono">{c.receiptNumber}</span>
          </h1>
          <p className="mt-2 text-sm text-qt-text-secondary">
            Group: {c.caseGroup.label ?? "Untitled"}{" "}
            <Badge tone="neutral">
              {c.caseGroup.cases.length} linked forms
            </Badge>
          </p>
        </div>
        <SyncButton caseId={c.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Current status</CardTitle>
          <p className="mt-3 text-lg font-medium text-qt-text">
            {c.currentStatusLabel ?? "—"}
          </p>
          <p className="mt-2 text-xs text-qt-text-muted">
            Last sync:{" "}
            {c.lastSyncedAt ? c.lastSyncedAt.toLocaleString() : "never"}
            {c.isStale ? " · Flagged as stale based on configurable heuristics" : ""}
            {c.syncUnavailable ? " · Last attempt: source unavailable" : ""}
          </p>
        </Card>
        <Card>
          <CardTitle>Interpretation</CardTitle>
          {interpretation ? (
            <div className="mt-3 space-y-3 text-sm text-qt-text-secondary">
              <div>
                <ContentLabel kind="typical" />
                <p className="mt-2">{interpretation.summary}</p>
              </div>
              {interpretation.typicalMeaning ? (
                <p>{interpretation.typicalMeaning}</p>
              ) : null}
              {interpretation.waitVsAct ? (
                <p>
                  <span className="font-medium text-qt-text">
                    Wait vs act hint:{" "}
                  </span>
                  {interpretation.waitVsAct}
                </p>
              ) : null}
              {interpretation.confidence ? (
                <p className="text-xs text-qt-text-muted">
                  Confidence label: {interpretation.confidence} (not a legal
                  standard)
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-qt-text-secondary">
              Add a status via sync to see interpretation cards.
            </p>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>Grouped forms</CardTitle>
        <ul className="mt-4 space-y-2 text-sm">
          {c.caseGroup.cases.map((x) => (
            <li key={x.id}>
              <Link
                href={`/app/track/${x.id}`}
                className={
                  x.id === c.id
                    ? "font-semibold text-qt-slate"
                    : "text-qt-slate underline"
                }
              >
                {x.formType} — {x.receiptNumber}
              </Link>
              <span className="text-qt-text-muted">
                {" "}
                — {x.currentStatusLabel ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Compare & estimates</CardTitle>
        {plan === "PREMIUM" ? (
          <p className="mt-2 text-sm text-qt-text-secondary">
            Premium compare view (placeholder): side-by-side status snapshots
            across grouped receipts with range-based timing notes—still not
            promises.
          </p>
        ) : (
          <PremiumLockInline />
        )}
      </Card>

      <Card>
        <CardTitle>Status history</CardTitle>
        <ContentLabel kind="official" />
        <p className="mt-2 text-xs text-qt-text-muted">
          Snapshots include mock data until a live USCIS integration is wired.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {c.snapshots.map((s) => (
            <li key={s.id} className="border-b border-qt-soft-gray pb-3">
              <p className="font-medium text-qt-text">{s.statusLabel}</p>
              <p className="text-qt-text-secondary">
                {s.capturedAt.toLocaleString()} · {s.source}{" "}
                {s.isOfficial ? "" : "(practice)"}
              </p>
              {s.description ? (
                <p className="text-qt-text-secondary">{s.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Timeline events</CardTitle>
        <ul className="mt-4 space-y-3 text-sm">
          {c.events.map((e) => (
            <li key={e.id}>
              <p className="font-medium text-qt-text">{e.title}</p>
              <p className="text-qt-text-secondary">
                {e.occurredAt.toLocaleString()} · {e.kind}
              </p>
              {e.description ? (
                <p className="text-qt-text-secondary">{e.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Case notes</CardTitle>
        <p className="mt-2 whitespace-pre-wrap text-sm text-qt-text-secondary">
          {c.notes ?? "No notes yet. (Editing notes can be added via settings or a future inline form.)"}
        </p>
      </Card>

      <Card>
        <CardTitle>Sync log (internal)</CardTitle>
        <ul className="mt-4 text-xs text-qt-text-muted">
          {c.syncLogs.map((l) => (
            <li key={l.id}>
              {l.createdAt.toLocaleString()} — {l.success ? "ok" : "fail"} —{" "}
              {l.message}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
