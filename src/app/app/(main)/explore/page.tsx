import Link from "next/link";
import { Suspense } from "react";
import { ExploreSurface } from "@/components/app/explore/explore-surface";
import { ExploreWorkspace } from "@/components/app/explore/explore-workspace";
import {
  EXPLORE_CATEGORY_CARDS,
  USCIS_HUB_LINKS,
} from "@/lib/explore-immigration";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

function CategoryInitial({ title }: { title: string }) {
  const t = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-qt-slate/15 to-qt-primary/15 text-sm font-bold text-qt-slate">
      {t}
    </div>
  );
}

function ExplorerFallback() {
  return (
    <ExploreSurface className="p-10 text-center text-sm text-neutral-600">
      Loading explorer…
    </ExploreSurface>
  );
}

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 sm:space-y-20">
      {/* Hero */}
      <ExploreSurface className="p-8 sm:p-10 lg:p-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-qt-slate">
            Strategic navigation
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Explore your immigration path
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            Map family, fiancé(e), student, exchange visitor, employment,
            employment-based residence, investor, and cross-cutting processes
            such as adjustment of status, consular processing, and change of
            status—using{" "}
            <span className="font-medium text-neutral-800">
              USCIS official materials
            </span>{" "}
            as anchors. QueueTip adds structure and next-check framing; it does
            not replace government instructions.
          </p>
          <p className="mt-4 rounded-[11px] border border-neutral-200/90 bg-white/70 px-4 py-3 text-sm leading-relaxed text-neutral-700">
            <span className="font-semibold text-neutral-900">
              QueueTip provides informational guidance, not legal advice.
            </span>{" "}
            Eligibility, deadlines, and strategy require your own review of
            USCIS and DOS rules—and often a licensed attorney or DOJ-accredited
            representative.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#guided-explorer"
              className={appPrimaryCtaClassWide + " text-center"}
            >
              Start exploring your path
            </a>
            <a
              href="#uscis-resources"
              className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/25 hover:bg-neutral-50"
            >
              Find official USCIS resources
            </a>
          </div>
        </div>
      </ExploreSurface>

      <Suspense fallback={<ExplorerFallback />}>
        <ExploreWorkspace />
      </Suspense>

      {/* Category grid */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate">
          Major immigration categories
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Each card links into the guided selector with that destination
          pre-selected. Read USCIS pages for authoritative definitions.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {EXPLORE_CATEGORY_CARDS.map((c) => (
            <li key={c.id}>
              <ExploreSurface className="group flex h-full flex-col p-6 transition hover:border-qt-slate/20 hover:shadow-[0_12px_40px_rgba(80,50,20,0.08)]">
                <div className="flex gap-4">
                  <CategoryInitial title={c.title} />
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 group-hover:text-qt-slate">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {c.explanation}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Who it is for
                </p>
                <p className="mt-1 text-sm text-neutral-700">{c.whoFor}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Inside vs outside the U.S.
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  {c.locationRelevance}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Common stages
                </p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {c.commonStages.map((s) => (
                    <li
                      key={s}
                      className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/app/explore?d=${c.destinationId}#guided-explorer`}
                  className="mt-5 text-center text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
                >
                  Explore this path
                </Link>
              </ExploreSurface>
            </li>
          ))}
        </ul>
      </div>

      {/* USCIS hub */}
      <ExploreSurface id="uscis-resources" className="scroll-mt-24 p-8 sm:p-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          Official USCIS resources
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
          Use these hubs before you rely on any third-party summary—including
          QueueTip. Edition dates, fees, and filing addresses change.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {USCIS_HUB_LINKS.map((u) => (
            <li
              key={u.url}
              className="rounded-[12px] border border-neutral-100 bg-neutral-50/50 p-4 transition hover:border-qt-slate/15 hover:bg-white"
            >
              <a
                href={u.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
              >
                {u.label}
              </a>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                {u.blurb}
              </p>
            </li>
          ))}
        </ul>
      </ExploreSurface>

      {/* Legal boundary */}
      <ExploreSurface className="border-qt-slate/15 bg-gradient-to-br from-white to-neutral-50/80 p-8 sm:p-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          Legal boundaries
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700">
          <li>
            QueueTip is{" "}
            <span className="font-medium text-neutral-900">
              informational guidance only
            </span>
            . It does not determine eligibility, admissibility, or outcomes.
          </li>
          <li>
            It does{" "}
            <span className="font-medium text-neutral-900">not</span> replace
            legal advice. Complex transitions—especially involving status gaps,
            criminal history, fraud allegations, J-1 rules, or removal
            proceedings—warrant a licensed attorney or DOJ-accredited
            representative.
          </li>
          <li>
            Always treat{" "}
            <span className="font-medium text-neutral-900">
              USCIS and DOS instructions
            </span>{" "}
            as the operational source of truth for forms you file.
          </li>
        </ul>
        <Link
          href="/app/help-directory"
          className={appPrimaryCtaClassWide + " mt-8 inline-block text-center"}
        >
          Help Directory
        </Link>
      </ExploreSurface>

      {/* Footer CTAs */}
      <ExploreSurface className="flex flex-col items-center gap-4 p-10 text-center sm:p-12">
        <h2 className="text-xl font-semibold text-neutral-900">
          Continue in QueueTip
        </h2>
        <p className="max-w-lg text-sm text-neutral-600">
          Move from orientation into preparation, tracking, or structured issue
          guidance.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/app/prepare"
            className={appPrimaryCtaClassWide + " min-w-[160px]"}
          >
            Prepare
          </Link>
          <Link
            href="/app/track"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Track
          </Link>
          <Link
            href="/app/resolve"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Resolve
          </Link>
          <Link
            href="/app/tools"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Tools
          </Link>
        </div>
      </ExploreSurface>
    </div>
  );
}
