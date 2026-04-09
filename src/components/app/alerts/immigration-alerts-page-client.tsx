"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExploreSurface } from "@/components/app/explore/explore-surface";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";
import {
  ALERT_CASE_TYPE_FILTER_IDS,
  ALERT_CATEGORY_LABELS,
  AUDIENCE_FILTER_OPTIONS,
  FEATURED_ALERTS,
  SOURCE_BADGE_LABEL,
  SORTED_ALERTS,
  alertHaystack,
  alertMatchesAudience,
  alertMatchesCaseTypeFilter,
  computeImmigrationAlertImpact,
  type AlertCaseTypeFilterId,
  type AlertCategoryId,
  type AlertUrgency,
  type AudienceFilterId,
  type ImmigrationAlert,
  type UserAlertProfile,
} from "@/lib/immigration-alerts-catalog";

const surface =
  "rounded-[14px] border border-white/85 bg-white/96 shadow-[0_4px_32px_rgba(60,40,20,0.07)]";

const URGENCY_STYLES: Record<AlertUrgency, string> = {
  routine: "bg-stone-100 text-stone-800 ring-1 ring-stone-200",
  elevated: "bg-amber-50 text-amber-950 ring-1 ring-amber-200/90",
  high: "bg-rose-50 text-rose-950 ring-1 ring-rose-200/90",
};

const STATUS_OPTIONS: { id: string; label: string }[] = [
  { id: "none", label: "No status selected" },
  { id: "b1b2", label: "B-1/B-2" },
  { id: "f1", label: "F-1" },
  { id: "j1", label: "J-1" },
  { id: "h1b", label: "H-1B" },
  { id: "k1", label: "K-1" },
  { id: "tps", label: "TPS" },
  { id: "pending_aos", label: "Pending adjustment" },
  { id: "out_of_status", label: "Out of status" },
  { id: "other", label: "Other" },
];

const TARGET_OPTIONS: { id: string; label: string }[] = [
  { id: "family_gc", label: "Family-based green card" },
  { id: "marriage_aos", label: "Marriage-based adjustment" },
  { id: "ead", label: "Work permit" },
  { id: "travel_doc", label: "Travel document" },
  { id: "student", label: "Student status" },
  { id: "h1b", label: "H-1B" },
  { id: "eb_gc", label: "Employment-based green card" },
  { id: "naturalization", label: "Naturalization" },
  { id: "tps", label: "TPS" },
  { id: "consular", label: "Consular processing" },
  { id: "other", label: "Other" },
];

const STAGE_OPTIONS: { id: string; label: string }[] = [
  { id: "researching", label: "Just researching" },
  { id: "preparing", label: "Preparing to file" },
  { id: "filed", label: "Already filed" },
  { id: "waiting", label: "Waiting" },
  { id: "issue", label: "Responding to issue" },
];

function UrgencyBadge({ u }: { u: AlertUrgency }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        URGENCY_STYLES[u],
      )}
    >
      {u === "routine" ? "Routine" : u === "elevated" ? "Elevated" : "High priority"}
    </span>
  );
}

function SourceBadge({ type }: { type: ImmigrationAlert["sourceType"] }) {
  const isUscis = type === "uscis";
  return (
    <Badge tone={isUscis ? "support" : "outline"} className="text-[10px] font-bold uppercase tracking-wide">
      {SOURCE_BADGE_LABEL[type]}
    </Badge>
  );
}

function ImpactPanel({
  alert,
  profile,
}: {
  alert: ImmigrationAlert;
  profile: UserAlertProfile;
}) {
  const impact = useMemo(
    () => computeImmigrationAlertImpact(alert, profile),
    [alert, profile],
  );

  const relColor =
    impact.relevance === "high"
      ? "border-emerald-200/80 bg-emerald-50/50"
      : impact.relevance === "possible"
        ? "border-amber-200/80 bg-amber-50/40"
        : "border-stone-200 bg-stone-50/60";

  return (
    <div className={cn("mt-5 space-y-4 rounded-xl border p-4", relColor)}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          A. Likely relevance
        </p>
        <p className="mt-1 text-sm font-semibold text-neutral-900">
          {impact.relevanceLabel}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          B. Why this may matter
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-neutral-700">
          {impact.whyMatters.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          C. What to verify first
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-neutral-700">
          {impact.verifyFirst.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          D. Suggested next checks
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-neutral-700">
          {impact.nextChecks.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
      {impact.legalHelpNote ? (
        <div className="rounded-lg border border-rose-200/80 bg-rose-50/60 px-3 py-3 text-sm text-rose-950">
          <p className="font-semibold">E. When legal help may matter</p>
          <p className="mt-1 leading-relaxed">{impact.legalHelpNote}</p>
        </div>
      ) : (
        <p className="text-xs text-neutral-500">
          E. Legal help: no automatic flag for this item based on metadata—still
          seek counsel if your facts are sensitive.
        </p>
      )}
    </div>
  );
}

function AlertCard({
  alert,
  profile,
  expanded,
  onToggleExpand,
  showSummary,
  onToggleSummary,
}: {
  alert: ImmigrationAlert;
  profile: UserAlertProfile;
  expanded: boolean;
  onToggleExpand: () => void;
  showSummary: boolean;
  onToggleSummary: () => void;
}) {
  return (
    <ExploreSurface
      className={cn(
        "flex h-full flex-col p-6 transition",
        "hover:border-qt-slate/20 hover:shadow-[0_14px_44px_rgba(80,50,20,0.1)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <SourceBadge type={alert.sourceType} />
          <Badge tone="neutral" className="text-[10px]">
            {ALERT_CATEGORY_LABELS[alert.category]}
          </Badge>
        </div>
        <UrgencyBadge u={alert.urgency} />
      </div>
      <time
        dateTime={alert.publishedDate}
        className="mt-3 text-xs font-medium text-neutral-500"
      >
        {alert.publishedDate}
      </time>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-neutral-900">
        {alert.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{alert.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {alert.tags.slice(0, 5).map((t) => (
          <span
            key={t}
            className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a
          href={alert.officialUrl}
          target="_blank"
          rel="noreferrer"
          className={appPrimaryCtaClassWide + " text-center"}
        >
          Open official source
        </a>
        <button
          type="button"
          onClick={onToggleSummary}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
        >
          {showSummary ? "Hide QueueTip summary" : "Read QueueTip summary"}
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          className="rounded-lg border border-qt-slate/30 bg-qt-primary-soft/50 px-4 py-2.5 text-center text-sm font-semibold text-neutral-900 hover:bg-qt-primary-soft"
        >
          {expanded ? "Hide impact view" : "How does this affect me?"}
        </button>
      </div>
      {showSummary ? (
        <p className="mt-4 rounded-lg border border-neutral-100 bg-neutral-50/80 p-3 text-sm leading-relaxed text-neutral-700">
          <span className="font-semibold text-neutral-900">QueueTip summary: </span>
          {alert.queueTipSummary}
        </p>
      ) : null}
      {expanded ? <ImpactPanel alert={alert} profile={profile} /> : null}
    </ExploreSurface>
  );
}

export function ImmigrationAlertsPageClient() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<AlertCategoryId | "all">("all");
  const [urgency, setUrgency] = useState<AlertUrgency | "all">("all");
  const [audience, setAudience] = useState<AudienceFilterId>("all");
  const [caseType, setCaseType] = useState<AlertCaseTypeFilterId>("all");
  const [uscisOnly, setUscisOnly] = useState(false);
  const [operationalOnly, setOperationalOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [summaryId, setSummaryId] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserAlertProfile>({
    nationality: "",
    location: "inside",
    currentStatus: "none",
    targetBenefit: "other",
    caseStage: "researching",
    ageRange: undefined,
    pendingCase: undefined,
  });

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return SORTED_ALERTS.filter((a) => {
      if (qq && !alertHaystack(a).includes(qq)) return false;
      if (category !== "all" && a.category !== category) return false;
      if (urgency !== "all" && a.urgency !== urgency) return false;
      if (!alertMatchesAudience(a, audience)) return false;
      if (!alertMatchesCaseTypeFilter(a, caseType)) return false;
      if (uscisOnly && a.sourceType !== "uscis") return false;
      if (
        operationalOnly &&
        !a.tags.includes("office_closure") &&
        a.category !== "operational_office"
      )
        return false;
      return true;
    });
  }, [q, category, urgency, audience, caseType, uscisOnly, operationalOnly]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 sm:space-y-16">
      <ExploreSurface className={cn(surface, "p-8 sm:p-10 lg:p-12")}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-qt-slate">
          Official updates
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Immigration alerts
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">
          QueueTip highlights USCIS and other U.S. government immigration notices
          so you can see what may affect filings, fees, appointments, work
          authorization, and travel—then read the primary source yourself.
        </p>
        <p className="mt-4 max-w-3xl rounded-[11px] border border-amber-900/10 bg-amber-50/45 px-4 py-3 text-sm leading-relaxed text-neutral-800">
          <span className="font-semibold text-neutral-900">
            QueueTip provides informational guidance, not legal advice.
          </span>{" "}
          Always verify effective dates, scope, and eligibility on the official
          page. QueueTip does not determine how a rule applies to you.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="#alerts-feed"
            className={appPrimaryCtaClassWide + " text-center"}
          >
            Browse latest alerts
          </a>
          <a
            href="#your-context"
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-qt-slate/25 hover:bg-neutral-50"
          >
            See how this may affect me
          </a>
        </div>
      </ExploreSurface>

      {/* Featured */}
      <section aria-labelledby="feat-head" className="space-y-6">
        <div>
          <h2
            id="feat-head"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-qt-slate"
          >
            Latest major official items
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Ten curated links to USCIS releases and stable government hubs—always
            shown here. Use filters below to narrow the same catalog.
          </p>
        </div>
        <ul className="grid gap-5 lg:grid-cols-2">
          {FEATURED_ALERTS.map((alert) => (
            <li key={alert.id}>
              <AlertCard
                alert={alert}
                profile={profile}
                expanded={expandedId === alert.id}
                onToggleExpand={() =>
                  setExpandedId((id) => (id === alert.id ? null : alert.id))
                }
                showSummary={summaryId === alert.id}
                onToggleSummary={() =>
                  setSummaryId((id) => (id === alert.id ? null : alert.id))
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Your context — shared analyzer inputs */}
      <ExploreSurface id="your-context" className={cn(surface, "scroll-mt-24 p-6 sm:p-8")}>
        <h2 className="text-lg font-semibold text-neutral-900">
          Your context (for “How does this affect me?”)
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Optional selections personalize the relevance framing below each alert.
          They do not create legal advice or eligibility determinations.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="sm:col-span-2 xl:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Country of citizenship / nationality
            </label>
            <input
              type="text"
              value={profile.nationality}
              onChange={(e) =>
                setProfile((p) => ({ ...p, nationality: e.target.value }))
              }
              placeholder="e.g. Mexico, or leave blank"
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-qt-support/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Current location
            </label>
            <select
              value={profile.location}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  location: e.target.value as UserAlertProfile["location"],
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
            >
              <option value="inside">Inside the U.S.</option>
              <option value="outside">Outside the U.S.</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Current status
            </label>
            <select
              value={profile.currentStatus}
              onChange={(e) =>
                setProfile((p) => ({ ...p, currentStatus: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Target benefit / goal
            </label>
            <select
              value={profile.targetBenefit}
              onChange={(e) =>
                setProfile((p) => ({ ...p, targetBenefit: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
            >
              {TARGET_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Case stage
            </label>
            <select
              value={profile.caseStage}
              onChange={(e) =>
                setProfile((p) => ({ ...p, caseStage: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
            >
              {STAGE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Pending case with USCIS?
            </label>
            <select
              value={
                profile.pendingCase === undefined
                  ? "unspecified"
                  : profile.pendingCase
                    ? "yes"
                    : "no"
              }
              onChange={(e) => {
                const v = e.target.value;
                setProfile((p) => ({
                  ...p,
                  pendingCase:
                    v === "unspecified" ? undefined : v === "yes",
                }));
              }}
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
            >
              <option value="unspecified">Prefer not to specify</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Age range (optional)
            </label>
            <select
              value={profile.ageRange ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  ageRange: e.target.value || undefined,
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
            >
              <option value="">Not specified</option>
              <option value="minor">Under 18</option>
              <option value="adult">18–64</option>
              <option value="senior">65+</option>
            </select>
          </div>
        </div>
      </ExploreSurface>

      {/* Sticky filters */}
      <div className="sticky top-0 z-20 -mx-1 scroll-mt-4 px-1 py-2">
        <ExploreSurface
          className={cn(
            surface,
            "border-amber-200/30 p-4 shadow-[0_8px_36px_rgba(80,50,20,0.12)] backdrop-blur-md sm:p-5",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Search & filters
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-3">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Keyword: H-1B, EAD, fee, office, TPS…"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none ring-qt-support/30 focus:ring-2 lg:col-span-1"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as AlertCategoryId | "all")
                }
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
              >
                <option value="all">All alert types</option>
                {(Object.keys(ALERT_CATEGORY_LABELS) as AlertCategoryId[]).map(
                  (k) => (
                    <option key={k} value={k}>
                      {ALERT_CATEGORY_LABELS[k]}
                    </option>
                  ),
                )}
              </select>
              <select
                value={urgency}
                onChange={(e) =>
                  setUrgency(e.target.value as AlertUrgency | "all")
                }
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
              >
                <option value="all">All urgency levels</option>
                <option value="high">High priority</option>
                <option value="elevated">Elevated</option>
                <option value="routine">Routine</option>
              </select>
              <select
                value={audience}
                onChange={(e) =>
                  setAudience(e.target.value as AudienceFilterId)
                }
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
              >
                {AUDIENCE_FILTER_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                value={caseType}
                onChange={(e) =>
                  setCaseType(e.target.value as AlertCaseTypeFilterId)
                }
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-qt-support/30"
              >
                {ALERT_CASE_TYPE_FILTER_IDS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-neutral-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={uscisOnly}
                onChange={(e) => setUscisOnly(e.target.checked)}
                className="size-4 rounded border-neutral-300 text-qt-slate focus:ring-qt-support/30"
              />
              <span className="font-medium">Official USCIS sources only</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={operationalOnly}
                onChange={(e) => setOperationalOnly(e.target.checked)}
                className="size-4 rounded border-neutral-300 text-qt-slate focus:ring-qt-support/30"
              />
              <span className="font-medium">
                Closures / operational disruptions only
              </span>
            </label>
          </div>
        </ExploreSurface>
      </div>

      {/* Feed */}
      <section id="alerts-feed" className="scroll-mt-28 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Filtered results
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Same ten sources as above, narrowed by your filters.
          </p>
        </div>
        {filtered.length === 0 ? (
          <ExploreSurface className={cn(surface, "p-6 text-sm text-neutral-700")}>
            <p className="font-semibold text-neutral-900">
              No listings match your filters yet.
            </p>
            <p className="mt-2">
              Try another keyword, alert type, audience, or matter type—or clear
              filters to see the full curated set.
            </p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategory("all");
                setUrgency("all");
                setAudience("all");
                setCaseType("all");
                setUscisOnly(false);
                setOperationalOnly(false);
              }}
              className={cn(appPrimaryCtaClassWide, "mt-4 inline-block")}
            >
              Clear filters
            </button>
          </ExploreSurface>
        ) : null}
        <ul className="grid gap-5 md:grid-cols-2">
          {filtered.map((alert) => (
            <li key={alert.id}>
              <AlertCard
                alert={alert}
                profile={profile}
                expanded={expandedId === alert.id}
                onToggleExpand={() =>
                  setExpandedId((id) => (id === alert.id ? null : alert.id))
                }
                showSummary={summaryId === alert.id}
                onToggleSummary={() =>
                  setSummaryId((id) => (id === alert.id ? null : alert.id))
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Explainer: kinds of alerts */}
      <ExploreSurface className={cn(surface, "p-8 sm:p-10")}>
        <h2 className="text-xl font-semibold text-neutral-900">
          What kind of alert is this?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Government immigration updates fall into different shapes. The label on
          each card is a rough map—only the official text is authoritative.
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            {
              term: "Policy changes",
              def: "Instructions in the Policy Manual, interpretive guidance, or screening priorities that may change how officers review cases.",
            },
            {
              term: "Operational closures",
              def: "Weather, emergencies, or staffing that affect appointments and in-person services—check the same day you travel.",
            },
            {
              term: "Filing & forms",
              def: "Edition dates, required supplements, or payment method rules that determine whether a package is accepted.",
            },
            {
              term: "Fee changes",
              def: "Published fee schedules and premium processing costs after notice-and-comment processes.",
            },
            {
              term: "Country-specific",
              def: "TPS designations, travel proclamations, or visa availability that hinge on nationality or chargeability.",
            },
            {
              term: "Employment / H-1B",
              def: "Cap registration, petition evidence, and work-authorization categories tied to employers and job roles.",
            },
          ].map((row) => (
            <div key={row.term}>
              <dt className="font-semibold text-neutral-900">{row.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-600">
                {row.def}
              </dd>
            </div>
          ))}
        </dl>
      </ExploreSurface>

      {/* When to act */}
      <ExploreSurface className={cn(surface, "p-8 sm:p-10")}>
        <h2 className="text-xl font-semibold text-neutral-900">
          When should I act?
        </h2>
        <ul className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-700">
          <li>
            <span className="font-semibold text-neutral-900">Stay informed: </span>
            Bookmark hubs (alerts index, forms, fees) and skim monthly if you are
            early in research.
          </li>
          <li>
            <span className="font-semibold text-neutral-900">
              Verify the source:{" "}
            </span>
            Before changing strategy, read the effective date and who is covered
            on the .gov page—not a screenshot or summary thread.
          </li>
          <li>
            <span className="font-semibold text-neutral-900">
              Update filing strategy:{" "}
            </span>
            When a change touches your form type, fee, or document rules while
            you are preparing or have a pending receipt.
          </li>
          <li>
            <span className="font-semibold text-neutral-900">
              Talk to counsel:{" "}
            </span>
            When the update involves inadmissibility, removal, asylum bars,
            country-specific restrictions, or anything that could affect work or
            travel in a high-stakes way.
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/app/resolve"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Resolve
          </Link>
          <Link
            href="/app/explore"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Explore
          </Link>
          <Link
            href="/app/help-directory"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
          >
            Help Directory
          </Link>
        </div>
      </ExploreSurface>
    </div>
  );
}
