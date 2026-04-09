"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { CaseDetailTabsProps } from "./case-detail-types";
import { FieldOfficePanel } from "./field-office-panel";
import { TrackSurface } from "./track-surface";
import {
  buildWatchouts,
  nextActionsChecklist,
  nextLikelyMilestone,
  possibleOutcomesForStatus,
  timelineEstimateBlocks,
  estimatedCaseStage,
} from "@/lib/track-case-intelligence";

const TABS = [
  { id: "status", label: "Status" },
  { id: "meaning", label: "What it means" },
  { id: "next", label: "What to do next" },
  { id: "history", label: "History" },
  { id: "documents", label: "Documents" },
  { id: "outcomes", label: "Possible next steps" },
  { id: "timeline", label: "Timeline" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}

function fmtShort(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function groupCoordinationCopy(
  cases: CaseDetailTabsProps["data"]["caseGroup"]["cases"],
  currentForm: string,
) {
  const types = cases.map((c) => c.formType);
  const has485 = types.some((t) => /I-485/i.test(t));
  const has765 = types.some((t) => /I-765/i.test(t));
  const has131 = types.some((t) => /I-131/i.test(t));
  if (has485 && (has765 || has131)) {
    return `This group includes I-485 with related work/travel filings (${types.join(", ")}). Some notices and decisions may move on different clocks; track each receipt but read them together.`;
  }
  if (cases.length > 1) {
    return `Linked receipts in this group: ${types.join(", ")}. Events on one form can signal what to watch for on ${currentForm}.`;
  }
  return null;
}

function likelihoodLabel(l: "common" | "possible" | "less common") {
  if (l === "common") return "Common path";
  if (l === "possible") return "Possible";
  return "Less common";
}

export function CaseDetailTabs({
  data,
  interpretation,
  uscisLive,
}: CaseDetailTabsProps) {
  const [tab, setTab] = useState<TabId>("status");

  const daysAdded = daysSince(data.createdAt);
  const daysSync = daysSince(data.lastSyncedAt);
  const latestSnapshot = data.snapshots[0];
  const daysStatus = daysSince(latestSnapshot?.capturedAt ?? null);

  const watchouts = useMemo(
    () =>
      buildWatchouts({
        daysSinceAdded: daysAdded ?? 0,
        daysSinceSync: daysSync,
        daysSinceStatusSnapshot: daysStatus,
        statusLabel: data.currentStatusLabel,
      }),
    [daysAdded, daysSync, daysStatus, data.currentStatusLabel],
  );

  const checklist = useMemo(
    () => nextActionsChecklist(interpretation, data.formType),
    [interpretation, data.formType],
  );

  const outcomes = useMemo(
    () => possibleOutcomesForStatus(data.currentStatusLabel),
    [data.currentStatusLabel],
  );

  const timelineBlocks = useMemo(
    () =>
      timelineEstimateBlocks({
        formType: data.formType,
        fieldOffice: data.fieldOffice,
        serviceCenter: data.serviceCenter,
      }),
    [data.formType, data.fieldOffice, data.serviceCenter],
  );

  const historyRows = useMemo(() => {
    const rows: {
      title: string;
      at: string;
      source: string;
      note?: string;
    }[] = [];
    for (const s of data.snapshots) {
      rows.push({
        title: s.statusLabel,
        at: s.capturedAt,
        source: s.source + (s.isOfficial ? "" : " · practice"),
        note: s.description ?? undefined,
      });
    }
    for (const e of data.events) {
      rows.push({
        title: e.title,
        at: e.occurredAt,
        source: e.kind,
        note: e.description ?? undefined,
      });
    }
    rows.push({
      title: "Case added to QueueTip tracking",
      at: data.createdAt,
      source: "QueueTip",
    });
    rows.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
    );
    return rows;
  }, [data.snapshots, data.events, data.createdAt]);

  const lastLog = data.syncLogs[0];
  const stage = estimatedCaseStage(data.currentStatusLabel);
  const milestone = nextLikelyMilestone(data.formType, data.currentStatusLabel);
  const coord = groupCoordinationCopy(data.caseGroup.cases, data.formType);

  const confidenceOfficial =
    uscisLive && !data.syncUnavailable
      ? "Official USCIS status line (when sync succeeds)"
      : "Practice sync layer — verify on USCIS Case Status";

  const fieldSourceHint = data.fieldOffice
    ? "Stored on this case (manual or future sync)"
    : "Not returned by the current sync payload";

  return (
    <TrackSurface className="overflow-hidden">
      <div className="border-b border-neutral-100 bg-neutral-50/80 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-[10px] px-3.5 py-2 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-white text-neutral-900 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                  : "text-neutral-500 hover:bg-white/60 hover:text-neutral-800",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {tab === "status" ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {uscisLive ? (
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                      Live tracked
                    </span>
                  ) : (
                    <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                      Practice sync
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {data.currentStatusLabel ?? "No status synced yet"}
                </h2>
                <p className="font-mono text-sm text-neutral-600">
                  {data.receiptNumber}
                </p>
                <p className="text-sm font-medium text-neutral-700">
                  {data.formType}
                </p>
              </div>
              <div className="min-w-[200px] space-y-1 text-right text-sm text-neutral-600">
                <p>
                  <span className="text-neutral-500">Last updated </span>
                  {fmtShort(latestSnapshot?.capturedAt ?? data.updatedAt)}
                </p>
                <p>
                  <span className="text-neutral-500">Last sync </span>
                  {fmtShort(data.lastSyncedAt)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-neutral-100 pt-6 md:grid-cols-2">
              <div className="rounded-[12px] bg-neutral-50/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Official status
                </p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">
                  {data.currentStatusLabel ?? "—"}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  Source:{" "}
                  {uscisLive
                    ? "USCIS Case Status API / Torch (when configured)"
                    : "Mock / practice sync"}
                </p>
              </div>
              <div className="rounded-[12px] border border-qt-primary/25 bg-[#fffaf5] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  QueueTip guidance
                </p>
                <p className="mt-2 text-sm text-neutral-800">
                  <span className="font-medium">Stage:</span> {stage}
                </p>
                <p className="mt-2 text-sm text-neutral-800">
                  <span className="font-medium">Confidence:</span>{" "}
                  {confidenceOfficial}
                </p>
                <p className="mt-2 text-sm text-neutral-800">
                  <span className="font-medium">Next likely milestone:</span>{" "}
                  {milestone}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Days since added" value={daysAdded} />
              <Metric label="Days since last status snapshot" value={daysStatus} />
              <Metric label="Days since last sync" value={daysSync} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <dl className="space-y-3 text-sm">
                <Row k="Service center" v={data.serviceCenter} />
                <Row k="Priority date" v={data.priorityDate ? fmtShort(data.priorityDate) : null} />
                <Row
                  k="Stale flag"
                  v={
                    data.isStale
                      ? "Heuristic stale — refresh sync"
                      : "Not flagged"
                  }
                />
              </dl>
              <FieldOfficePanel
                caseId={data.id}
                initialValue={data.fieldOffice}
                sourceHint={fieldSourceHint}
              />
            </div>

            {coord ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Grouped forms
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.caseGroup.cases.map((c) => (
                    <Link
                      key={c.id}
                      href={`/app/track/${c.id}`}
                      className={cn(
                        "rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-300",
                        c.id === data.id && "ring-2 ring-qt-primary/40",
                      )}
                    >
                      {c.formType}
                    </Link>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {coord}
                </p>
              </div>
            ) : null}

            {watchouts.length ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Case health · watch-outs
                </p>
                <ul className="mt-3 space-y-3">
                  {watchouts.map((w) => (
                    <li
                      key={w.title}
                      className="rounded-[12px] border border-neutral-100 bg-neutral-50/80 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-neutral-900">
                        {w.title}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {w.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[12px] border border-neutral-100 bg-neutral-50/60 p-4 text-sm text-neutral-600">
              <p className="font-medium text-neutral-800">Verify with USCIS</p>
              <p className="mt-2">
                QueueTip is a practice layer. Always confirm the latest line on{" "}
                <a
                  href="https://egov.uscis.gov/"
                  className="font-semibold text-qt-slate underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  USCIS Case Status
                </a>
                .
              </p>
              {data.syncUnavailable ? (
                <p className="mt-2 font-medium text-amber-800">
                  Last sync attempt reported the source as unavailable.
                </p>
              ) : null}
              {lastLog && !lastLog.success ? (
                <p className="mt-2 text-red-700">
                  Last sync failed{lastLog.message ? `: ${lastLog.message}` : ""}
                  .
                </p>
              ) : null}
            </div>

            <NotesPreview notes={data.notes} />
          </div>
        ) : null}

        {tab === "meaning" ? (
          <div className="space-y-6">
            <section className="rounded-[12px] bg-neutral-50/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                USCIS says
              </p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {data.currentStatusLabel ?? "—"}
              </p>
            </section>
            {interpretation ? (
              <>
                <section>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    In plain English
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">
                    {interpretation.summary}
                  </p>
                  {interpretation.typicalMeaning ? (
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                      {interpretation.typicalMeaning}
                    </p>
                  ) : null}
                </section>
                <section className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[12px] border border-neutral-100 p-4">
                    <p className="text-xs font-semibold text-neutral-500">
                      Act now or wait?
                    </p>
                    <p className="mt-2 text-sm text-neutral-800">
                      {interpretation.waitVsAct === "wait"
                        ? "Usually waiting is appropriate unless a notice gives a deadline."
                        : interpretation.waitVsAct === "act"
                          ? "There may be time-sensitive actions — match any mailed notice."
                          : "Depends on your notices; confirm on Case Status and mail."}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-neutral-100 p-4">
                    <p className="text-xs font-semibold text-neutral-500">
                      What usually happens next
                    </p>
                    <p className="mt-2 text-sm text-neutral-800">
                      {milestone}
                    </p>
                  </div>
                </section>
                {interpretation.confidence ? (
                  <p className="text-xs text-neutral-500">
                    Interpretation confidence: {interpretation.confidence} (not
                    legal advice).
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-neutral-600">
                Run a successful sync to attach a status line; we will map it to
                plain English where rules exist.
              </p>
            )}
          </div>
        ) : null}

        {tab === "next" ? (
          <div className="space-y-8">
            <CheckBlock title="What to do now" items={checklist.do} />
            <CheckBlock title="What not to do" items={checklist.avoid} />
            <CheckBlock title="What to monitor" items={checklist.monitor} />
            {interpretation?.documentsToPrepare?.length ? (
              <CheckBlock
                title="Documents to keep ready"
                items={interpretation.documentsToPrepare}
              />
            ) : null}
            <div className="rounded-[12px] border border-neutral-100 bg-neutral-50/60 p-4 text-sm text-neutral-600">
              <p className="font-medium text-neutral-800">When to escalate</p>
              <p className="mt-2">
                Consider counsel or a formal inquiry if you have a missed
                deadline, a clear USCIS error, or an emergency travel/work need —
                QueueTip does not replace legal advice.
              </p>
            </div>
          </div>
        ) : null}

        {tab === "history" ? (
          <div>
            {historyRows.length === 0 ? (
              <p className="text-sm text-neutral-600">No history yet.</p>
            ) : (
              <ul className="relative space-y-0 pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-neutral-200">
                {historyRows.map((row, i) => (
                  <li key={`${row.at}-${i}`} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-neutral-300 shadow-sm ring-1 ring-neutral-200" />
                    <p className="text-sm font-semibold text-neutral-900">
                      {row.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {fmtShort(row.at)} · {row.source}
                    </p>
                    {row.note ? (
                      <p className="mt-2 text-sm text-neutral-600">{row.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {tab === "documents" ? (
          <div className="rounded-[12px] border border-dashed border-neutral-200 bg-neutral-50/50 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-neutral-900">
              No documents added yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
              You will be able to attach receipt notices, RFEs, interview
              letters, EAD/AP approvals, and decision notices. Uploads are not
              wired yet — this space is reserved.
            </p>
            <button
              type="button"
              disabled
              className="mt-6 rounded-[10px] bg-qt-primary px-4 py-2.5 text-sm font-medium text-neutral-950 opacity-50"
            >
              Add document (soon)
            </button>
          </div>
        ) : null}

        {tab === "outcomes" ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Based on your current stage and form type —{" "}
              <strong className="text-neutral-800">not predictions</strong>.
              Actual paths vary by office, workload, and case facts.
            </p>
            <ul className="space-y-3">
              {outcomes.map((o) => (
                <li
                  key={o.label}
                  className="rounded-[12px] border border-neutral-100 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-neutral-900">{o.label}</p>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                      {likelihoodLabel(o.likelihood)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">{o.meaning}</p>
                  {o.timingHint ? (
                    <p className="mt-2 text-xs text-neutral-500">{o.timingHint}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "timeline" ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Days since added to QueueTip" value={daysAdded} />
              <Metric
                label="Days since last status change (snapshot)"
                value={daysStatus}
              />
              <Metric label="Days since last sync" value={daysSync} />
              <Metric
                label="Current stage (estimate)"
                value={null}
                textOverride={stage}
              />
            </div>
            <ul className="space-y-4">
              {timelineBlocks.map((b) => (
                <li
                  key={b.title}
                  className="rounded-[12px] bg-neutral-50/90 p-4 text-sm text-neutral-700"
                >
                  <p className="font-semibold text-neutral-900">{b.title}</p>
                  <p className="mt-2 leading-relaxed">{b.body}</p>
                  {b.disclaimer ? (
                    <p className="mt-2 text-xs text-neutral-500">
                      Informational only — not a guarantee of timing or outcome.
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="text-sm text-neutral-600">
              For side-by-side snapshot activity across linked receipts, use the
              compare panel below (Premium).
            </p>
          </div>
        ) : null}
      </div>
    </TrackSurface>
  );
}

function Metric({
  label,
  value,
  textOverride,
}: {
  label: string;
  value: number | null;
  textOverride?: string;
}) {
  return (
    <div className="rounded-[12px] border border-neutral-100 bg-white px-4 py-3">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-neutral-900">
        {textOverride ?? (value != null ? `${value} d` : "—")}
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
      <dt className="text-neutral-500">{k}</dt>
      <dd className="font-medium text-neutral-900">{v ?? "—"}</dd>
    </div>
  );
}

function CheckBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((x) => (
          <li
            key={x}
            className="flex items-start gap-3 text-sm text-neutral-700 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-qt-primary/80 before:content-['']"
          >
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotesPreview({ notes }: { notes: string | null }) {
  return (
    <div className="rounded-[12px] border border-neutral-100 border-dashed bg-white/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Notes (preview)
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">
        {notes ??
          "No notes yet. Inline editing will arrive later — use this area for reminders like “Called USCIS” or “Biometrics letter received.”"}
      </p>
    </div>
  );
}
