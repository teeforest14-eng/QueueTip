import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { MinimalCTA } from "./minimal-cta";
import { LabelChip } from "./label-chips";

function PathGlyph({ title }: { title: string }) {
  if (title === "Prepare") {
    return (
      <svg className="h-9 w-9 text-qt-slate/90" viewBox="0 0 40 40" fill="none" aria-hidden>
        <rect x="8" y="10" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="1.25" />
        <path d="M12 16h16M12 21h12M12 26h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    );
  }
  if (title === "Track") {
    return (
      <svg className="h-9 w-9 text-qt-slate/90" viewBox="0 0 40 40" fill="none" aria-hidden>
        <path d="M10 28V12l6-4 8 4 6-4v16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="18" r="2" fill="currentColor" />
        <circle cx="24" cy="22" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (title === "Resolve") {
    return (
      <svg className="h-9 w-9 text-qt-slate/90" viewBox="0 0 40 40" fill="none" aria-hidden>
        <path d="M20 8v6M20 26v6M12 20h6M22 20h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    );
  }
  return (
    <svg className="h-9 w-9 text-qt-slate/90" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="14" cy="16" r="3" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="26" cy="22" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path d="M17 18l6 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function PathCard({
  title,
  who,
  body,
  reduces,
  href,
  className,
  style,
}: {
  title: string;
  who: string;
  body: string;
  reduces: string;
  href: string;
  className?: string;
  style?: CSSProperties;
}) {
  const preview =
    title === "Prepare" ? (
      <div className="space-y-2 rounded-xl border border-qt-soft-gray bg-qt-bg p-2.5 sm:p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-qt-text-muted">
          Checklist preview
        </p>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-qt-soft-gray bg-white p-2">
          <span className="min-w-0 truncate text-sm font-medium text-qt-text">
            I-485 current edition confirmed
          </span>
          <LabelChip variant="official" active={false} />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-qt-soft-gray bg-white p-2">
          <span className="min-w-0 truncate text-sm font-medium text-qt-text-muted">
            I-693 timing check
          </span>
          <LabelChip variant="next" active={false} />
        </div>
      </div>
    ) : title === "Track" ? (
      <div className="space-y-2 rounded-xl border border-qt-soft-gray bg-qt-bg p-2.5 sm:p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-qt-text-muted">
          Timeline preview
        </p>
        <div className="rounded-lg border border-qt-soft-gray bg-white p-2">
          <p className="text-sm font-medium text-qt-text">Receipt accepted</p>
          <p className="mt-1 flex items-center gap-2 text-[11px] text-qt-text-muted">
            <LabelChip variant="official" active={false} />
            USCIS · Mar 12
          </p>
        </div>
        <div className="rounded-lg border border-qt-soft-gray bg-white p-2">
          <p className="text-sm font-medium text-qt-text">Biometrics scheduled</p>
          <p className="mt-1 flex items-center gap-2 text-[11px] text-qt-text-muted">
            <LabelChip variant="typical" active={false} />
            Often the next milestone after receipt acceptance
          </p>
        </div>
      </div>
    ) : title === "Resolve" ? (
      <div className="space-y-2 rounded-xl border border-qt-soft-gray bg-qt-bg p-2.5 sm:p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-qt-text-muted">
          Issue guidance
        </p>
        <div className="rounded-lg border border-qt-soft-gray bg-white p-2">
          <p className="flex items-center gap-2 text-sm font-medium text-qt-text">
            <LabelChip variant="typical" active={false} />
            Long silence after RFE response
          </p>
          <p className="mt-1 text-[11px] text-qt-text-muted">
            What to watch, what to verify, and when to follow up
          </p>
        </div>
      </div>
    ) : (
      <div className="space-y-2 rounded-xl border border-qt-soft-gray bg-qt-bg p-2.5 sm:p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-qt-text-muted">
          Journey view
        </p>
        <div className="rounded-lg border border-qt-soft-gray bg-white p-2">
          <p className="text-sm font-medium text-qt-text">Prepare → Track → Resolve</p>
          <p className="mt-1 text-[11px] text-qt-text-muted">
            See the full process first, then move into Prepare, Track, or Resolve.
          </p>
        </div>
      </div>
    );

  return (
    <article
      style={style}
      className={cn(
        "qt-path-card qt-motion-hover group relative flex h-full flex-col overflow-hidden rounded-2xl border border-qt-soft-gray bg-white p-6 shadow-[0_1px_0_rgba(17,17,17,0.04)] sm:p-7 lg:p-8",
        className,
      )}
    >
      <div className="absolute right-5 top-5 opacity-[0.14] transition-opacity duration-300 group-hover:opacity-25 sm:right-6 sm:top-6">
        <PathGlyph title={title} />
      </div>
      <div className="flex items-baseline justify-between gap-3 pr-11 sm:gap-4 sm:pr-14">
        <h3 className="font-display text-[1.35rem] font-normal tracking-tight text-qt-text sm:text-2xl">
          {title}
        </h3>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted"
          aria-hidden
        >
          Path
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-qt-slate sm:mt-4">
        {who}
      </p>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-qt-text-secondary sm:mt-3">
        {body}
      </p>
      <p className="mt-5 border-t border-qt-soft-gray pt-4.5 text-xs leading-relaxed text-qt-text-muted sm:mt-6 sm:pt-5">
        <span className="font-semibold text-qt-text-secondary">Clears up: </span>
        {reduces}
      </p>
      <p className="qt-path-hint mt-3 text-[11px] font-medium text-qt-slate opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Guided steps · clear labels · official USCIS links
      </p>
      <div className="qt-path-hover-preview mt-3 max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-300 ease-out group-hover:max-h-96 group-hover:opacity-100 sm:mt-4">
        {preview}
      </div>
      <MinimalCTA href={href} className="mt-5 self-start text-sm sm:mt-6">
        Begin with {title}
      </MinimalCTA>
    </article>
  );
}
