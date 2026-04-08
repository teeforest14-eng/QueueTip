import Link from "next/link";
import { MarketingSecondaryLink } from "./marketing-buttons";
import { cn } from "@/lib/cn";

export function PricingShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
      <div
        className={cn(
          "qt-pricing-card flex flex-col rounded-2xl border border-qt-soft-gray bg-white p-6 shadow-[0_1px_0_rgba(17,17,17,0.04)] sm:p-8 lg:p-10",
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
          Free
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl font-normal text-qt-text">$0</span>
          <span className="text-sm text-qt-text-secondary">always</span>
        </div>
        <h3 className="mt-2 font-display text-2xl font-normal text-qt-text">Free</h3>
        <p className="mt-4 text-sm leading-relaxed text-qt-text-secondary">
          Onboarding, core filing guides, the USCIS tools hub, and basic issue guidance stay
          available for free.
        </p>
        <ul className="mt-6 flex-1 space-y-2.5 text-sm text-qt-text-secondary sm:mt-8 sm:space-y-3">
          {[
            "Guided onboarding and case dashboard",
            "Core Prepare guides (I-130, I-485, I-765, I-131)",
            "Official USCIS tools linked inside workflows",
            "Basic guidance for common stuck points",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-qt-text-muted" aria-hidden>
                —
              </span>
              {line}
            </li>
          ))}
        </ul>
        <MarketingSecondaryLink href="/signup" className="mt-8 sm:mt-10">
          Start free
        </MarketingSecondaryLink>
      </div>

      <div
        className={cn(
          "qt-pricing-card qt-pricing-premium relative flex flex-col overflow-hidden rounded-2xl border-2 border-qt-slate/25 bg-gradient-to-b from-white via-white to-qt-mist/60 p-6 shadow-[0_24px_70px_-36px_rgba(111,143,175,0.35)] sm:p-8 lg:p-10",
        )}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#A9D6FF]/25 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-slate">
            Premium
          </p>
          <span className="rounded-md border border-qt-primary-soft bg-qt-primary-soft/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-qt-text">
            Most active cases
          </span>
        </div>
        <div className="relative mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl font-normal text-qt-text">$10</span>
          <span className="text-sm text-qt-text-secondary">/ month</span>
        </div>
        <h3 className="relative mt-2 font-display text-2xl font-normal text-qt-text">Premium</h3>
        <p className="relative mt-4 text-sm leading-relaxed text-qt-text-secondary">
          More complete workflows, more case history, more reminders, and deeper issue guidance for
          active cases.
        </p>
        <ul className="relative mt-6 flex-1 space-y-2.5 text-sm text-qt-text-secondary sm:mt-8 sm:space-y-3">
          {[
            "Saved workflows and broader checklist coverage",
            "More complete timeline and snapshot history",
            "More issue guidance where templates apply",
            "More alerts, reminders, and follow-up prompts",
            "USCIS posted ranges shown in more context",
            "More tailored path recommendations",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-qt-slate/70" aria-hidden>
                —
              </span>
              {line}
            </li>
          ))}
        </ul>
        <p className="relative mt-6 text-[11px] leading-relaxed text-qt-text-muted">
          Informational guidance only—not legal services.
        </p>
        <div className="relative mt-5 sm:mt-6">
          <Link href="/signup" className="qt-cta-line text-sm font-semibold text-qt-text">
            Start free, then upgrade in app
          </Link>
        </div>
      </div>
    </div>
  );
}
