"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { ContentLabel } from "@/components/content-label";
import { ExploreSurface } from "./explore-surface";
import {
  EXPLORE_DESTINATIONS,
  EXPLORE_LOCATIONS,
  EXPLORE_STATUSES,
  EXPLORE_STAGES,
  getExploreGuidance,
  type ExploreInput,
} from "@/lib/explore-immigration";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

const selectClass =
  "mt-1.5 w-full rounded-[10px] border border-neutral-200/90 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm focus:border-qt-slate/35 focus:outline-none focus:ring-2 focus:ring-qt-primary/25";

export function ExploreWorkspace() {
  const searchParams = useSearchParams();
  const qpDest = searchParams.get("d");

  const [input, setInput] = useState<ExploreInput>({
    destination: EXPLORE_DESTINATIONS[0]?.id ?? "family_immediate",
    status: "not_selected",
    location: "inside",
    stage: "researching",
  });

  useEffect(() => {
    if (qpDest && EXPLORE_DESTINATIONS.some((x) => x.id === qpDest)) {
      setInput((prev) => ({ ...prev, destination: qpDest }));
    }
  }, [qpDest]);

  const guidance = useMemo(() => getExploreGuidance(input), [input]);

  function set<K extends keyof ExploreInput>(key: K, value: ExploreInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div id="guided-explorer" className="scroll-mt-24 space-y-8">
      <ExploreSurface className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-neutral-900">
          Guided path selector
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Choose the combination closest to your situation. Output updates
          instantly and is still general—you must confirm every step against
          current USCIS instructions.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              1 · Destination type
            </span>
            <select
              className={selectClass}
              value={input.destination}
              onChange={(e) => set("destination", e.target.value)}
            >
              {EXPLORE_DESTINATIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              2 · Current status / situation
            </span>
            <select
              className={selectClass}
              value={input.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {EXPLORE_STATUSES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              3 · Location
            </span>
            <select
              className={selectClass}
              value={input.location}
              onChange={(e) => set("location", e.target.value)}
            >
              {EXPLORE_LOCATIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              4 · Current stage
            </span>
            <select
              className={selectClass}
              value={input.stage}
              onChange={(e) => set("stage", e.target.value)}
            >
              {EXPLORE_STAGES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </ExploreSurface>

      <ExploreSurface className="overflow-hidden">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50/90 to-white px-6 py-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate">
            Your guidance snapshot
          </p>
          <h3 className="mt-1 text-xl font-semibold text-neutral-900">
            {guidance.headline}
          </h3>
        </div>
        <div className="space-y-8 p-6 sm:p-8">
          <section>
            <ContentLabel kind="official" />
            <h4 className="mt-3 text-sm font-semibold text-neutral-900">
              Official process framing
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {guidance.pathInvolves}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {guidance.insideVsAbroad}
            </p>
            <ul className="mt-4 space-y-2">
              {guidance.officialLinks.map((l) => (
                <li key={l.url + l.label}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-qt-slate underline-offset-2 hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-neutral-100 pt-8">
            <ContentLabel kind="typical" />
            <h4 className="mt-3 text-sm font-semibold text-neutral-900">
              What this path usually involves
            </h4>
            <p className="mt-2 text-sm text-neutral-600">
              Common sequence—not a promise about your case.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {guidance.typicalFlow.map((x) => (
                <li
                  key={x}
                  className="flex gap-2 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-qt-primary/80 before:content-['']"
                >
                  {x}
                </li>
              ))}
            </ul>
            <h5 className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Common decision points
            </h5>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-700">
              {guidance.decisionPoints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            {guidance.waitingPoints.length ? (
              <>
                <h5 className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Where people often wait
                </h5>
                <ul className="mt-2 space-y-2 text-sm text-neutral-600">
                  {guidance.waitingPoints.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>

          <section className="border-t border-neutral-100 pt-8">
            <ContentLabel kind="action" />
            <h4 className="mt-3 text-sm font-semibold text-neutral-900">
              What to verify first
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {guidance.verifyFirst.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h5 className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Likely next procedural steps (general)
            </h5>
            <ul className="mt-2 space-y-2 text-sm text-neutral-700">
              {guidance.likelyNextSteps.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h5 className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Forms or process types often involved
            </h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {guidance.formsOftenInvolved.map((f) => (
                <span
                  key={f}
                  className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800"
                >
                  {f}
                </span>
              ))}
            </div>
            <h5 className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Information to gather
            </h5>
            <ul className="mt-2 space-y-2 text-sm text-neutral-700">
              {guidance.gatherInfo.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          <section className="border-t border-neutral-100 pt-8">
            <h4 className="text-sm font-semibold text-neutral-900">
              Next step inside QueueTip
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {guidance.queueTipNext.map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className={cn(
                    "rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-qt-slate/30 hover:bg-neutral-50",
                  )}
                >
                  {x.label}
                </Link>
              ))}
            </div>
          </section>

          {guidance.legalHelpImportant ? (
            <section className="rounded-[12px] border border-violet-200/80 bg-violet-50/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">
                When legal help may be important
              </p>
              <p className="mt-2 text-sm leading-relaxed text-violet-950/90">
                {guidance.legalHelpNote}
              </p>
              <Link
                href="/app/help-directory"
                className={appPrimaryCtaClassWide + " mt-4 inline-block text-center"}
              >
                Help Directory
              </Link>
            </section>
          ) : (
            <section className="rounded-[12px] border border-neutral-100 bg-neutral-50/60 p-4 text-sm text-neutral-600">
              Many routine filings proceed without counsel, but eligibility and
              strategy are still legal questions. Use the Help Directory when
              your facts are complex.
            </section>
          )}
        </div>
      </ExploreSurface>
    </div>
  );
}
