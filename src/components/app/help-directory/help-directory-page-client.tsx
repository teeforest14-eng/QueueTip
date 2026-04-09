"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ResolveSurface } from "@/components/app/resolve/resolve-surface";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";
import {
  HELP_CASE_TYPE_FILTERS,
  HELP_DIRECTORY_LISTINGS,
  HELP_HIGH_STAKES_CHIPS,
  HELP_LANGUAGE_FILTERS,
  HELP_PROVIDER_TYPES,
  helpDirectoryStats,
  listingMatchesConsultationFilter,
  type HelpCaseTypeFilter,
  type HelpDirectoryListing,
  type HelpProviderType,
} from "@/lib/help-directory-demo-data";

type FormatFilter = "any" | "remote" | "in_person" | "both";

const surfaceHero =
  "rounded-[14px] border border-white/80 bg-white/96 shadow-[0_4px_32px_rgba(25,45,95,0.08)]";

function consultationLabel(mode: HelpDirectoryListing["consultationMode"]) {
  switch (mode) {
    case "remote":
      return "Remote";
    case "in_person":
      return "In-person";
    case "both":
      return "Remote & in-person";
    default:
      return mode;
  }
}

function haystack(l: HelpDirectoryListing): string {
  return [
    l.name,
    l.state,
    l.serviceRegion,
    ...l.languages,
    ...l.caseTypes,
    l.shortDescription,
    l.providerType,
  ]
    .join(" ")
    .toLowerCase();
}

export function HelpDirectoryPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [qInput, setQInput] = useState(() => sp.get("q") ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setQInput(sp.get("q") ?? "");
  }, [sp]);

  const stateFilter = sp.get("state") ?? "all";
  const languageFilter = sp.get("lang") ?? "all";
  const caseTypeFilter = sp.get("caseType") ?? "all";
  const providerFilter = sp.get("provider") ?? "all";
  const formatFilter = (sp.get("format") ?? "any") as FormatFilter;

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v && v !== "all") p.set(k, v);
        else p.delete(k);
      }
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [pathname, router, sp],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams(sp.toString());
      const trimmed = qInput.trim();
      if (trimmed) p.set("q", trimmed);
      else p.delete("q");
      const next = p.toString();
      if (next !== sp.toString()) {
        router.replace(next ? `${pathname}?${next}` : pathname, {
          scroll: false,
        });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [qInput, pathname, router, sp]);

  const stats = useMemo(() => helpDirectoryStats(), []);

  const filtered = useMemo(() => {
    const q = qInput.trim().toLowerCase();
    return HELP_DIRECTORY_LISTINGS.filter((l) => {
      if (q && !haystack(l).includes(q)) return false;
      if (stateFilter !== "all" && l.state !== stateFilter) return false;
      if (
        languageFilter !== "all" &&
        !l.languages.some(
          (x) => x.toLowerCase() === languageFilter.toLowerCase(),
        )
      )
        return false;
      if (
        caseTypeFilter !== "all" &&
        !l.caseTypes.includes(caseTypeFilter as HelpCaseTypeFilter)
      )
        return false;
      if (
        providerFilter !== "all" &&
        l.providerType !== (providerFilter as HelpProviderType)
      )
        return false;
      if (!listingMatchesConsultationFilter(l.consultationMode, formatFilter))
        return false;
      return true;
    });
  }, [
    qInput,
    stateFilter,
    languageFilter,
    caseTypeFilter,
    providerFilter,
    formatFilter,
  ]);

  const usStates = useMemo(
    () => [...new Set(HELP_DIRECTORY_LISTINGS.map((l) => l.state))].sort(),
    [],
  );

  const scrollToFilters = () => {
    document.getElementById("help-directory-filters")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMobileFiltersOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 sm:space-y-16">
      {/* Hero */}
      <ResolveSurface className={cn(surfaceHero, "p-8 sm:p-10 lg:p-12")}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-qt-slate">
          Outside support
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Help Directory
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">
          QueueTip explains processes and points to official sources. When your
          situation needs individualized legal strategy, accredited
          representation, or local navigation, this directory is the structured
          place to explore outside options—without replacing your own judgment or
          USCIS instructions.
        </p>
        <p className="mt-4 max-w-3xl rounded-[11px] border border-sky-900/10 bg-sky-50/50 px-4 py-3 text-sm leading-relaxed text-neutral-800">
          <span className="font-semibold text-neutral-900">
            Listings shown here may include sample entries for demonstration
            purposes
          </span>{" "}
          until vetted partner data is added. Sample rows are not endorsements
          and are not contactable in this build.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="#directory-results"
            className={appPrimaryCtaClassWide + " text-center"}
          >
            Browse support
          </a>
          <button
            type="button"
            onClick={scrollToFilters}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/25 hover:bg-neutral-50"
          >
            Filter listings
          </button>
        </div>
      </ResolveSurface>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "States represented", value: stats.statesRepresented },
          { label: "Languages (sample set)", value: stats.languagesSupported },
          { label: "Matter types (filters)", value: stats.matterTypesCovered },
          { label: "Listings with remote option", value: stats.remoteSupportListings },
        ].map((s) => (
          <ResolveSurface
            key={s.label}
            className={cn(surfaceHero, "px-5 py-4 text-center sm:text-left")}
          >
            <p className="text-2xl font-semibold tabular-nums text-neutral-900">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
              {s.label}
            </p>
          </ResolveSurface>
        ))}
      </div>

      {/* High-stakes featured */}
      <section aria-labelledby="stakes-heading" className="space-y-5">
        <div>
          <h2
            id="stakes-heading"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate"
          >
            When legal help may matter most
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            These themes often warrant licensed counsel or a DOJ-accredited
            representative. Use them to jump into filtered sample listings—not
            as medical or legal advice.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_HIGH_STAKES_CHIPS.map((c) => {
            const p = new URLSearchParams(sp.toString());
            p.set("caseType", c.caseType);
            return (
              <li key={c.label}>
                <Link
                  href={`${pathname}?${p.toString()}#directory-results`}
                  className={cn(
                    "group block h-full rounded-[13px] border border-white/90 bg-white/90 p-5 shadow-[0_2px_16px_rgba(25,45,95,0.05)] transition",
                    "hover:border-qt-slate/25 hover:shadow-[0_12px_36px_rgba(25,45,95,0.1)]",
                  )}
                >
                  <p className="font-semibold text-neutral-900 group-hover:text-qt-slate">
                    {c.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {c.blurb}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-qt-slate underline-offset-2 group-hover:underline">
                    Filter directory →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Sticky filters */}
      <div
        id="help-directory-filters"
        className="sticky top-0 z-20 scroll-mt-24 -mx-1 px-1 py-2"
      >
        <ResolveSurface
          className={cn(
            surfaceHero,
            "border-sky-200/40 p-4 shadow-[0_8px_36px_rgba(25,45,95,0.12)] backdrop-blur-md sm:p-6",
          )}
        >
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((o) => !o)}
            className="mb-4 flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-4 py-3 text-left text-sm font-semibold text-neutral-900 lg:hidden"
          >
            Search & filters
            <span className="text-neutral-400">{mobileFiltersOpen ? "▲" : "▼"}</span>
          </button>
          <div
            className={cn(
              "space-y-5",
              !mobileFiltersOpen && "hidden lg:block",
            )}
          >
            <div>
              <label
                htmlFor="help-q"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
              >
                Keyword search
              </label>
              <input
                id="help-q"
                type="search"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Name, state, language, matter type…"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-qt-support/30 placeholder:text-neutral-400 focus:border-qt-slate/35 focus:ring-2"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <label
                  htmlFor="help-state"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  State
                </label>
                <select
                  id="help-state"
                  value={stateFilter}
                  onChange={(e) =>
                    pushParams({ state: e.target.value === "all" ? null : e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/35 focus:ring-2 focus:ring-qt-support/30"
                >
                  <option value="all">All states</option>
                  {usStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="help-lang"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Language
                </label>
                <select
                  id="help-lang"
                  value={languageFilter}
                  onChange={(e) =>
                    pushParams({ lang: e.target.value === "all" ? null : e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/35 focus:ring-2 focus:ring-qt-support/30"
                >
                  <option value="all">Any language</option>
                  {HELP_LANGUAGE_FILTERS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="help-case"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Case type
                </label>
                <select
                  id="help-case"
                  value={caseTypeFilter}
                  onChange={(e) =>
                    pushParams({
                      caseType: e.target.value === "all" ? null : e.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/35 focus:ring-2 focus:ring-qt-support/30"
                >
                  <option value="all">All matter types</option>
                  {HELP_CASE_TYPE_FILTERS.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="help-provider"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Provider type
                </label>
                <select
                  id="help-provider"
                  value={providerFilter}
                  onChange={(e) =>
                    pushParams({
                      provider: e.target.value === "all" ? null : e.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/35 focus:ring-2 focus:ring-qt-support/30"
                >
                  <option value="all">All provider types</option>
                  {HELP_PROVIDER_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="help-format"
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  Consultation format
                </label>
                <select
                  id="help-format"
                  value={formatFilter}
                  onChange={(e) =>
                    pushParams({
                      format:
                        e.target.value === "any" ? null : e.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none focus:border-qt-slate/35 focus:ring-2 focus:ring-qt-support/30"
                >
                  <option value="any">Any format</option>
                  <option value="remote">Remote available</option>
                  <option value="in_person">In-person available</option>
                  <option value="both">Offers both</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setQInput("");
                  router.replace(pathname, { scroll: false });
                }}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50"
              >
                Clear all filters
              </button>
              <p className="text-xs text-neutral-500">
                Sample data is attorneys only; other provider filters return no
                matches until partners are added.
              </p>
            </div>
          </div>
        </ResolveSurface>
      </div>

      {/* Results */}
      <section id="directory-results" className="scroll-mt-28 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Directory results
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {filtered.length} listing{filtered.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <ResolveSurface className={cn(surfaceHero, "p-10 text-center")}>
            <p className="text-base font-semibold text-neutral-900">
              No listings match your filters yet.
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Try another state, language, or case type. Provider types other
              than Attorney will stay empty while the dataset is demo-only.
            </p>
            <button
              type="button"
              onClick={() => {
                setQInput("");
                router.replace(pathname, { scroll: false });
              }}
              className={cn(appPrimaryCtaClassWide, "mt-6 inline-block")}
            >
              Reset filters
            </button>
          </ResolveSurface>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {filtered.map((l) => (
              <li key={l.id}>
                <ResolveSurface
                  className={cn(
                    "flex h-full flex-col p-6 transition",
                    "hover:border-qt-slate/20 hover:shadow-[0_14px_40px_rgba(25,45,95,0.1)]",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        tone="soft"
                        className="text-[10px] font-bold uppercase tracking-wide"
                      >
                        Sample listing
                      </Badge>
                      <Badge tone="outline" className="text-[11px]">
                        {l.providerType}
                      </Badge>
                    </div>
                    <Badge tone="neutral" className="text-[10px] uppercase">
                      Demo
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">
                    {l.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {l.shortDescription}
                  </p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-neutral-500">State</dt>
                      <dd className="text-neutral-900">{l.state}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-neutral-500">Region</dt>
                      <dd className="text-neutral-900">{l.serviceRegion}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">
                        Languages
                      </dt>
                      <dd className="mt-1 flex flex-wrap gap-1.5">
                        {l.languages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-950 ring-1 ring-sky-100"
                          >
                            {lang}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">
                        Matter types (demo breadth)
                      </dt>
                      <dd className="mt-1 line-clamp-2 text-xs text-neutral-600">
                        {l.caseTypes.slice(0, 5).join(" · ")}
                        {l.caseTypes.length > 5
                          ? ` · +${l.caseTypes.length - 5} more`
                          : ""}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-neutral-500">Format</dt>
                      <dd className="text-neutral-900">
                        {consultationLabel(l.consultationMode)}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/app/help-directory/${l.slug}`}
                      className={appPrimaryCtaClassWide + " text-center"}
                    >
                      View profile
                    </Link>
                    <button
                      type="button"
                      disabled
                      title="Demo listing — not contactable"
                      className="cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-center text-sm font-semibold text-neutral-400"
                    >
                      Contact (demo)
                    </button>
                  </div>
                </ResolveSurface>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Disclaimer */}
      <ResolveSurface
        className={cn(
          surfaceHero,
          "border-amber-200/40 bg-gradient-to-br from-white to-amber-50/25 p-8",
        )}
      >
        <p className="text-sm font-semibold text-neutral-900">
          Design-safe disclaimer
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          Current listings may include sample entries used for product design and
          testing. Do not rely on placeholder listings as referrals. QueueTip does
          not verify credentials, outcomes, or availability for demo rows.
        </p>
      </ResolveSurface>
    </div>
  );
}
