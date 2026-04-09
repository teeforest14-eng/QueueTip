"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { ContentLabel } from "@/components/content-label";
import { ResolveSurface } from "./resolve-surface";
import { appPrimaryCtaClass, appPrimaryCtaClassWide } from "@/lib/app-cta-styles";
import { ResolveLegalHelpModule } from "./resolve-legal-help-module";

export type ResolveGuideDTO = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categorySlug: string;
  categoryName: string;
  urgencyLevel: string;
  triageLane: "monitor" | "review" | "legal";
  formsAffected: string[];
  lawyerRecommended: boolean;
  hasOfficialLinks: boolean;
};

export type ResolveCategoryDTO = { slug: string; name: string };

const URGENCIES = ["low", "moderate", "high", "critical"] as const;

const FORM_FILTERS = [
  "I-130",
  "I-485",
  "I-765",
  "I-131",
  "I-864",
  "I-601",
  "I-601A",
] as const;

function urgencyStyle(u: string) {
  switch (u) {
    case "low":
      return "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80";
    case "moderate":
      return "bg-sky-50 text-sky-900 ring-1 ring-sky-200/80";
    case "high":
      return "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80";
    case "critical":
      return "bg-rose-50 text-rose-950 ring-1 ring-rose-200/80";
    default:
      return "bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200";
  }
}

function urgencyLabel(u: string) {
  return u.charAt(0).toUpperCase() + u.slice(1);
}

export function ResolveWorkspace({
  guides,
  categories,
}: {
  guides: ResolveGuideDTO[];
  categories: ResolveCategoryDTO[];
}) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("");
  const [formFilter, setFormFilter] = useState<string>("");
  const [lawyerOnly, setLawyerOnly] = useState(false);
  const [triageLane, setTriageLane] = useState<
    "monitor" | "review" | "legal" | null
  >(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      if (triageLane && g.triageLane !== triageLane) return false;
      if (categorySlug && g.categorySlug !== categorySlug) return false;
      if (urgency && g.urgencyLevel !== urgency) return false;
      if (formFilter && !g.formsAffected.includes(formFilter)) return false;
      if (lawyerOnly && !g.lawyerRecommended) return false;
      if (q) {
        const hay = `${g.title} ${g.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    guides,
    query,
    categorySlug,
    urgency,
    formFilter,
    lawyerOnly,
    triageLane,
  ]);

  const grouped = useMemo(() => {
    const m = new Map<string, ResolveGuideDTO[]>();
    for (const g of filtered) {
      const list = m.get(g.categoryName) ?? [];
      list.push(g);
      m.set(g.categoryName, list);
    }
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 sm:space-y-16">
      {/* Hero */}
      <ResolveSurface className="overflow-hidden p-8 sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate">
            Guidance center
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Resolve issues in your case
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            QueueTip helps you understand delays, notices, contradictions,
            missing updates, document questions, and higher-risk areas that may
            touch admissibility or court proceedings. Each path is structured:
            what it may mean, what to verify, when waiting is still ordinary, and
            when qualified help matters.
          </p>
          <p className="mt-4 rounded-[10px] border border-neutral-200/80 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-700">
            <span className="font-semibold text-neutral-900">
              Informational only.
            </span>{" "}
            This is not legal advice. QueueTip does not represent you, decide
            eligibility, or guarantee outcomes or timelines.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#resolve-issue-grid"
              className={appPrimaryCtaClassWide + " text-center"}
            >
              Browse issues
            </a>
            <Link
              href="/app/help-directory"
              className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/30 hover:bg-neutral-50"
            >
              Help Directory
            </Link>
          </div>
        </div>
      </ResolveSurface>

      {/* Triage strip */}
      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            {
              lane: "monitor" as const,
              title: "Probably normal / monitor",
              body: "Often within posted ranges or routine processing noise. Good for checking official tools before reacting.",
              examples: "Long waits inside ranges, generic online status",
            },
            {
              lane: "review" as const,
              title: "Needs closer review",
              body: "Deadlines, mismatched notices, RFEs, or gaps that deserve careful reading and organized follow-up.",
              examples: "RFEs, NOIDs, mail vs. portal differences",
            },
            {
              lane: "legal" as const,
              title: "Get legal help soon",
              body: "Admissibility, court, enforcement, or fraud-level issues where authorized advice is important.",
              examples: "Unlawful presence, criminal history, ICE / EOIR",
            },
          ] as const
        ).map((col) => (
          <ResolveSurface
            key={col.lane}
            className={cn(
              "flex flex-col p-5 transition hover:shadow-[0_8px_32px_rgba(20,50,100,0.1)]",
              triageLane === col.lane &&
                "ring-2 ring-qt-slate/35 ring-offset-2 ring-offset-qt-resolve-page",
            )}
          >
            <h2 className="text-sm font-semibold text-neutral-900">
              {col.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {col.body}
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Examples: {col.examples}
            </p>
            <button
              type="button"
              onClick={() =>
                setTriageLane((prev) => (prev === col.lane ? null : col.lane))
              }
              className={cn(
                "mt-4 w-full rounded-[10px] px-3 py-2 text-sm font-semibold transition",
                triageLane === col.lane
                  ? "bg-qt-slate text-white"
                  : "border border-neutral-200 bg-white text-neutral-800 hover:border-qt-slate/30 hover:bg-neutral-50",
              )}
            >
              {triageLane === col.lane ? "Showing this lane" : "Filter to this lane"}
            </button>
          </ResolveSurface>
        ))}
      </div>

      {/* Filters */}
      <ResolveSurface className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-900">
          Find your issue
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-medium text-neutral-500">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keywords…"
              className="mt-1 w-full rounded-[10px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-qt-slate/40 focus:outline-none focus:ring-2 focus:ring-qt-slate/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-500">
              Category
            </span>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-qt-slate/40 focus:outline-none focus:ring-2 focus:ring-qt-slate/20"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-500">
              Urgency
            </span>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-qt-slate/40 focus:outline-none focus:ring-2 focus:ring-qt-slate/20"
            >
              <option value="">Any</option>
              {URGENCIES.map((u) => (
                <option key={u} value={u}>
                  {urgencyLabel(u)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-500">
              Form relevance
            </span>
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-qt-slate/40 focus:outline-none focus:ring-2 focus:ring-qt-slate/20"
            >
              <option value="">Any form</option>
              {FORM_FILTERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-neutral-200 bg-neutral-50/80 px-4 py-3 sm:col-span-2 lg:col-span-2">
            <input
              type="checkbox"
              checked={lawyerOnly}
              onChange={(e) => setLawyerOnly(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-qt-slate focus:ring-qt-slate/30"
            />
            <span className="text-sm text-neutral-800">
              Show issues that may need legal help
            </span>
          </label>
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Showing {filtered.length} of {guides.length} issues
          {triageLane ? ` · Lane: ${triageLane}` : ""}
        </p>
      </ResolveSurface>

      {/* Grid */}
      <div id="resolve-issue-grid" className="scroll-mt-28 space-y-10">
        {grouped.length === 0 ? (
          <ResolveSurface className="p-10 text-center text-sm text-neutral-600">
            No issues match these filters. Try clearing search or the triage
            lane.
          </ResolveSurface>
        ) : (
          grouped.map(([catName, items]) => (
            <div key={catName}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-qt-slate">
                {catName}
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((g) => (
                  <li key={g.id}>
                    <ResolveSurface className="group flex h-full flex-col p-5 transition hover:border-qt-slate/25 hover:shadow-[0_12px_40px_rgba(20,50,100,0.09)]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                            urgencyStyle(g.urgencyLevel),
                          )}
                        >
                          {urgencyLabel(g.urgencyLevel)}
                        </span>
                        {g.lawyerRecommended ? (
                          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-200/80">
                            Legal help
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-neutral-900 group-hover:text-qt-slate">
                        {g.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                        {g.summary}
                      </p>
                      {g.formsAffected.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {g.formsAffected.map((f) => (
                            <span
                              key={f}
                              className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                        <ContentLabel kind="typical" />
                        {g.hasOfficialLinks ? (
                          <ContentLabel kind="official" />
                        ) : null}
                        {g.lawyerRecommended ? (
                          <span className="inline-flex items-center rounded-md border border-violet-200 bg-violet-50/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-900">
                            Lawyer may be important
                          </span>
                        ) : null}
                      </div>
                      <Link
                        href={`/app/resolve/${g.slug}`}
                        className={
                          appPrimaryCtaClass +
                          " mt-5 w-full justify-center py-2.5 text-center"
                        }
                      >
                        View issue details
                      </Link>
                    </ResolveSurface>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Serious-case band */}
      <ResolveSurface className="border-qt-slate/20 bg-gradient-to-br from-white via-[#f0f5fc] to-white p-8 sm:p-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          Higher-risk situations
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
          Some problems are not ordinary “tracking” friction. Unlawful presence,
          criminal grounds, fraud or misrepresentation findings, false claims to
          citizenship, prior removals, and immigration court proceedings involve
          statutes, waivers, and EOIR rules that USCIS policy materials treat as
          distinct from routine case status updates. QueueTip can help you get
          oriented to official reading—
          <span className="font-medium">
            {" "}
            not to choose strategy or predict results.
          </span>
        </p>
        <p className="mt-3 max-w-3xl text-sm text-neutral-600">
          For court and enforcement matters, Department of Justice / EOIR
          resources apply alongside USCIS. When your situation touches those
          areas, prioritize an attorney or DOJ-accredited representative.
        </p>
        <div className="mt-6">
          <ResolveLegalHelpModule variant="compact" />
        </div>
      </ResolveSurface>

      {/* When to escalate */}
      <ResolveSurface className="p-8 sm:p-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          When to escalate
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "When to wait",
              d: "Inside posted processing ranges, no deadlines pending, and notices are consistent—periodic checks on USCIS tools may be enough.",
            },
            {
              t: "When to follow up",
              d: "After proof of delivery on responses, address changes, or clear USCIS errors—use official inquiry channels when eligible.",
            },
            {
              t: "When to verify records",
              d: "Before major decisions, compare I-94, passport stamps, court dockets, and your filed forms for alignment.",
            },
            {
              t: "When to seek legal help",
              d: "NOIDs, denials, criminal history, unlawful presence, fraud concerns, waivers, or any ICE / NTA / court notice.",
            },
            {
              t: "When court changes the equation",
              d: "Removal proceedings, missed hearings, or prior orders require EOIR-aware counsel—not just a USCIS case check.",
            },
          ].map((x) => (
            <li
              key={x.t}
              className="rounded-[12px] border border-neutral-100 bg-neutral-50/50 p-4"
            >
              <p className="text-sm font-semibold text-neutral-900">{x.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {x.d}
              </p>
            </li>
          ))}
        </ul>
      </ResolveSurface>

      {/* Footer CTA */}
      <ResolveSurface className="flex flex-col items-center gap-4 p-10 text-center sm:p-12">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Need qualified help?
        </h2>
        <p className="max-w-lg text-sm text-neutral-600">
          The Help Directory lists types of support. For legal advice, work
          only with authorized professionals.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app/help-directory"
            className={appPrimaryCtaClassWide + " min-w-[200px]"}
          >
            Help Directory
          </Link>
          <Link
            href="/app/explore"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Explore tools
          </Link>
          <Link
            href="/app/track"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Track
          </Link>
        </div>
      </ResolveSurface>
    </div>
  );
}
