"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { TrackSurface } from "@/components/app/track/track-surface";
import { Badge } from "@/components/ui/badge";
import { ContentLabel } from "@/components/content-label";
import { cn } from "@/lib/cn";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";
import {
  TOOL_CATEGORIES,
  TOOL_DECISION_ROWS,
  TOOL_FLOW_STRIPS,
  TOOL_PREP_STRIP_ITEMS,
  TOOL_STAGES,
  USCIS_TOOLS,
  categoryLabel,
  getToolById,
  haystackForTool,
  type ToolCategoryId,
  type ToolStageId,
  type UscisToolEntry,
} from "@/lib/uscis-tools-catalog";

const surfacePremium =
  "rounded-[14px] border border-white/90 bg-white/98 shadow-[0_4px_32px_rgba(0,50,24,0.07)]";

function ToolCard({
  tool,
  compact,
}: {
  tool: UscisToolEntry;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-col gap-3 border-b border-neutral-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {tool.featured && (
              <Badge tone="soft" className="text-[10px] uppercase tracking-wide">
                Most used
              </Badge>
            )}
            {tool.urgentFollowUp && (
              <Badge tone="support" className="text-[10px] uppercase tracking-wide">
                Urgent follow-up
              </Badge>
            )}
            <h3 className="font-semibold text-neutral-900">{tool.name}</h3>
          </div>
          <p className="text-sm text-neutral-600">{tool.summary}</p>
          <Badge tone="outline" className="text-[11px]">
            {categoryLabel(tool.category)}
          </Badge>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {tool.learnHref && (
            <Link
              href={tool.learnHref}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/30 hover:bg-neutral-50"
            >
              Learn how QueueTip uses this
            </Link>
          )}
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className={appPrimaryCtaClassWide + " px-4 py-2 text-xs"}
          >
            Open official site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex h-full flex-col rounded-[13px] border border-neutral-100/90 bg-gradient-to-b from-white to-neutral-50/40 p-6 transition",
        "hover:border-qt-slate/20 hover:shadow-[0_14px_40px_rgba(0,45,22,0.09)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <ContentLabel kind="official" />
          <Badge tone="outline">{categoryLabel(tool.category)}</Badge>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {tool.featured && (
            <Badge tone="soft" className="text-[10px] uppercase tracking-wide">
              Most used
            </Badge>
          )}
          {tool.urgentFollowUp && (
            <Badge tone="support" className="text-[10px] uppercase tracking-wide">
              Urgent follow-up
            </Badge>
          )}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-qt-slate">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{tool.summary}</p>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        Best for
      </p>
      <p className="mt-1 text-sm text-neutral-800">{tool.bestFor}</p>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        When to use it
      </p>
      <p className="mt-1 text-sm text-neutral-700">{tool.whenToUse}</p>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        Why it matters
      </p>
      <p className="mt-1 text-sm text-neutral-700">{tool.whyMatters}</p>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        What to have ready
      </p>
      <ul className="mt-2 list-inside list-disc text-sm text-neutral-700">
        {tool.needBefore.map((n) => (
          <li key={n} className="marker:text-qt-slate">
            {n}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className={appPrimaryCtaClassWide + " text-center"}
        >
          Open official site
        </a>
        {tool.learnHref && (
          <Link
            href={tool.learnHref}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/25 hover:bg-neutral-50"
          >
            Learn how QueueTip uses this
          </Link>
        )}
      </div>
    </div>
  );
}

export function OfficialToolsPageClient() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategoryId | "all">("all");
  const [stage, setStage] = useState<ToolStageId | "all">("all");
  const [mostUsedOnly, setMostUsedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USCIS_TOOLS.filter((t) => {
      if (mostUsedOnly && !t.featured) return false;
      if (urgentOnly && !t.urgentFollowUp) return false;
      if (category !== "all" && t.category !== category) return false;
      if (stage !== "all" && !t.stages.includes(stage)) return false;
      if (!q) return true;
      return haystackForTool(t).includes(q);
    });
  }, [query, category, stage, mostUsedOnly, urgentOnly]);

  const grouped = useMemo(() => {
    const m = new Map<ToolCategoryId, UscisToolEntry[]>();
    for (const c of TOOL_CATEGORIES) m.set(c.id, []);
    for (const t of filtered) {
      m.get(t.category)?.push(t);
    }
    return TOOL_CATEGORIES.map((c) => ({
      ...c,
      tools: m.get(c.id) ?? [],
    })).filter((g) => g.tools.length > 0);
  }, [filtered]);

  const featuredTools = useMemo(
    () => USCIS_TOOLS.filter((t) => t.featured),
    [],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-12 sm:space-y-16">
      {/* Hero */}
      <TrackSurface className={cn(surfacePremium, "p-8 sm:p-10 lg:p-12")}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-qt-slate">
          Official channels
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Official USCIS tools
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">
          Use this hub to find the right USCIS system for checking posted status,
          understanding published timing, updating addresses and account records,
          locating forms and fees, finding offices and medical providers, and
          handling common follow-ups. QueueTip organizes and explains; only USCIS
          operates these tools.
        </p>
        <p className="mt-4 max-w-3xl rounded-[11px] border border-emerald-900/10 bg-emerald-50/40 px-4 py-3 text-sm leading-relaxed text-neutral-800">
          <span className="font-semibold text-neutral-900">
            QueueTip provides informational guidance only.
          </span>{" "}
          Always verify editions, fees, and eligibility details on the live USCIS
          site before you act.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="#tool-library"
            className={appPrimaryCtaClassWide + " text-center"}
          >
            Browse official tools
          </a>
          <button
            type="button"
            onClick={focusSearch}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/25 hover:bg-neutral-50"
          >
            Search tools
          </button>
        </div>
      </TrackSurface>

      {/* Sticky search / filters */}
      <div className="sticky top-0 z-20 -mx-1 px-1 py-2">
        <TrackSurface
          className={cn(
            surfacePremium,
            "border-qt-trust/30 p-4 shadow-[0_8px_32px_rgba(0,50,24,0.12)] backdrop-blur-md sm:p-5",
          )}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="tools-search"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
              >
                Search
              </label>
              <input
                ref={searchRef}
                id="tools-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: processing time, missing notice, change address, civil surgeon…"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-qt-support/40 placeholder:text-neutral-400 focus:border-qt-slate/40 focus:ring-2"
              />
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:max-w-xl">
              <div>
                <label
                  htmlFor="tools-category"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Category
                </label>
                <select
                  id="tools-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ToolCategoryId | "all")
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/40 focus:ring-2 focus:ring-qt-support/40"
                >
                  <option value="all">All categories</option>
                  {TOOL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="tools-stage"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Stage
                </label>
                <select
                  id="tools-stage"
                  value={stage}
                  onChange={(e) =>
                    setStage(e.target.value as ToolStageId | "all")
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/40 focus:ring-2 focus:ring-qt-support/40"
                >
                  <option value="all">All stages</option>
                  {TOOL_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={mostUsedOnly}
                  onChange={(e) => setMostUsedOnly(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-qt-slate focus:ring-qt-support/40"
                />
                <span className="font-medium">Most used only</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-qt-slate focus:ring-qt-support/40"
                />
                <span className="font-medium">Urgent follow-up tools</span>
              </label>
            </div>
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition",
                  viewMode === "cards"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition",
                  viewMode === "list"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                Compact list
              </button>
            </div>
          </div>
        </TrackSurface>
      </div>

      {/* Featured */}
      <section aria-labelledby="featured-heading" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="featured-heading"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate"
            >
              Featured — most used
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">
              High-traffic USCIS entry points. Bookmark these; confirm each URL on
              uscis.gov if a link ever changes.
            </p>
          </div>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredTools.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      {/* Decision support */}
      <TrackSurface className={cn(surfacePremium, "p-8 sm:p-10")}>
        <h2 className="text-xl font-semibold text-neutral-900">
          Which tool should I use?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
          Match a plain-English need to the official USCIS system. This is routing
          guidance only—not a guarantee that e-Request or another channel will
          accept your specific case.
        </p>
        <ul className="mt-8 divide-y divide-neutral-100">
          {TOOL_DECISION_ROWS.map((row) => {
            const t = getToolById(row.toolId);
            if (!t) return null;
            return (
              <li
                key={row.need + row.toolId}
                className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm font-medium text-neutral-900">{row.need}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-neutral-600">→</span>
                  <span className="text-sm font-semibold text-qt-slate">
                    {t.name}
                  </span>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
                  >
                    Open
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </TrackSurface>

      {/* Prep strip */}
      <TrackSurface className={cn(surfacePremium, "p-8 sm:p-8")}>
        <h2 className="text-lg font-semibold text-neutral-900">
          What to gather before you open USCIS tools
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Processing-time and inquiry tools work best when the identifiers on your
          screen match your receipt notice.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {TOOL_PREP_STRIP_ITEMS.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 px-4 py-3 text-sm text-neutral-800"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-qt-slate"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </TrackSurface>

      {/* Recommended sequences */}
      <section aria-labelledby="flows-heading" className="space-y-6">
        <h2
          id="flows-heading"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate"
        >
          Recommended sequences
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {TOOL_FLOW_STRIPS.map((flow) => (
            <TrackSurface
              key={flow.title}
              className={cn(surfacePremium, "flex h-full flex-col p-6")}
            >
              <h3 className="font-semibold text-neutral-900">{flow.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {flow.description}
              </p>
              <ol className="mt-4 flex flex-1 flex-col gap-2">
                {flow.toolIds.map((id, i) => {
                  const t = getToolById(id);
                  if (!t) return null;
                  return (
                    <li key={id} className="flex items-center gap-2 text-sm">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                        {i + 1}
                      </span>
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-qt-slate underline-offset-2 hover:underline"
                      >
                        {t.name}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </TrackSurface>
          ))}
        </div>
      </section>

      {/* Full library */}
      <section id="tool-library" className="scroll-mt-28 space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Full tool library
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            {filtered.length} tool{filtered.length === 1 ? "" : "s"} match your
            filters. Results stay grouped by category for scanning.
          </p>
        </div>
        {grouped.length === 0 ? (
          <TrackSurface className={cn(surfacePremium, "p-10 text-center")}>
            <p className="text-sm text-neutral-600">
              No tools match. Clear filters or try another keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStage("all");
                setMostUsedOnly(false);
                setUrgentOnly(false);
              }}
              className={cn(appPrimaryCtaClassWide, "mt-6 inline-block")}
            >
              Reset filters
            </button>
          </TrackSurface>
        ) : (
          grouped.map((g) => (
            <div key={g.id}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-px flex-1 bg-gradient-to-r from-qt-slate/25 to-transparent"
                  aria-hidden
                />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  {g.label}
                </h3>
                <span
                  className="h-px flex-1 bg-gradient-to-l from-qt-slate/25 to-transparent"
                  aria-hidden
                />
              </div>
              {viewMode === "cards" ? (
                <ul className="grid gap-5 md:grid-cols-2">
                  {g.tools.map((tool) => (
                    <li key={tool.id}>
                      <ToolCard tool={tool} />
                    </li>
                  ))}
                </ul>
              ) : (
                <TrackSurface className={cn(surfacePremium, "px-5 py-2 sm:px-8")}>
                  {g.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} compact />
                  ))}
                </TrackSurface>
              )}
            </div>
          ))
        )}
      </section>

      {/* Trust footer */}
      <TrackSurface
        className={cn(
          surfacePremium,
          "border-emerald-900/10 bg-gradient-to-br from-white to-emerald-50/30 p-8 text-center sm:p-10",
        )}
      >
        <p className="text-sm leading-relaxed text-neutral-700">
          USCIS controls authentication, outages, and what each tool accepts.
          QueueTip never sees your USCIS password and cannot change posted
          timelines or case outcomes.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/app/track"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Track
          </Link>
          <Link
            href="/app/prepare"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Prepare
          </Link>
          <Link
            href="/app/explore"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Explore
          </Link>
        </div>
      </TrackSurface>
    </div>
  );
}
