import type { ReactNode } from "react";
import { LabelChip } from "@/components/marketing/label-chips";

function MockRow({
  title,
  meta,
  hint,
  chip,
}: {
  title: string;
  meta: string;
  hint: string;
  chip: ReactNode;
}) {
  return (
    <div className="group flex items-start justify-between gap-3 border-b border-qt-soft-gray py-3 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-qt-text">{title}</p>
        <p className="mt-0.5 text-[11px] text-qt-text-muted">{meta}</p>
        <p className="mt-1 text-[11px] text-qt-slate opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {hint}
        </p>
      </div>
      <div className="shrink-0 pt-0.5">{chip}</div>
    </div>
  );
}

export function TrustComparisonPremium() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="qt-trust-panel rounded-2xl border border-qt-soft-gray bg-white p-1 shadow-[0_20px_60px_-40px_rgba(17,17,17,0.14)]">
        <div className="rounded-[0.875rem] bg-qt-mist/50 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-normal tracking-tight text-qt-text sm:text-[1.65rem]">
              Official resources
            </h3>
            <span className="hidden rounded-md border border-[#7eb8e8] bg-[#A9D6FF]/40 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-qt-text sm:inline">
              Source
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-qt-text-secondary">
            USCIS status updates, posted processing ranges, current form editions, and filing rules
            appear where you need them, linked back to the official source.
          </p>
          <div className="mt-6 rounded-xl border border-qt-soft-gray bg-white px-4 py-1">
            <MockRow
              title="Case status"
              meta="Posted receipt / phase from USCIS tools"
              hint="Directly sourced from official systems."
              chip={<LabelChip variant="official" active />}
            />
            <MockRow
              title="Processing time range"
              meta="USCIS tool output for form & field office"
              hint="USCIS posted ranges can change. QueueTip shows the current posted range."
              chip={<LabelChip variant="official" active />}
            />
            <MockRow
              title="Form edition & fee"
              meta="Linked from workflow to current instructions"
              hint="Always confirm the current edition and fee before filing."
              chip={<LabelChip variant="official" active />}
            />
          </div>
        </div>
      </div>

      <div className="qt-trust-panel rounded-2xl border border-qt-slate/20 bg-white p-1 shadow-[0_20px_60px_-40px_rgba(111,143,175,0.2)]">
        <div className="rounded-[0.875rem] bg-gradient-to-b from-white to-qt-mist/40 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-normal tracking-tight text-qt-text sm:text-[1.65rem]">
              QueueTip guidance
            </h3>
            <span className="hidden rounded-md border border-qt-primary-soft bg-qt-primary-soft/50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-qt-text sm:inline">
              Labeled
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-qt-text-secondary">
            QueueTip adds plain-language guidance, common patterns, and next checks that help you
            stay oriented without treating guidance like official fact.
          </p>
          <div className="mt-6 rounded-xl border border-qt-soft-gray bg-white px-4 py-1">
            <MockRow
              title="What this status often means"
              meta="Typical pattern — not a USCIS statement"
              hint="This is based on common case patterns, not a USCIS statement."
              chip={<LabelChip variant="typical" active />}
            />
            <MockRow
              title="Suggested next checks"
              meta="Wait vs. act framing with tool links"
              hint="Helps you decide what to check next without overstating certainty."
              chip={<LabelChip variant="next" active />}
            />
            <MockRow
              title="Issue walkthrough"
              meta="RFE delays, biometrics timing, and similar stuck points"
              hint="Clear next checks reduce second-guessing."
              chip={<LabelChip variant="next" active />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
