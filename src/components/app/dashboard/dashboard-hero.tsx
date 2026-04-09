import Link from "next/link";
import type { PlanTier } from "@/lib/plan";

export function DashboardHero({
  greeting,
  orientation,
  plan,
}: {
  greeting: string;
  orientation: string;
  plan: PlanTier;
}) {
  const isPremium = plan === "PREMIUM";

  return (
    <header className="border-b border-qt-soft-gray/90 pb-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
            Home
          </p>
          <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-qt-text sm:text-[2.125rem]">
            {greeting}
          </h1>
          <p className="text-[15px] leading-relaxed text-qt-text-secondary">
            {orientation}
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-qt-text-muted">
            QueueTip helps you stay organized and understand case language. It
            does not replace{" "}
            <span className="font-medium text-qt-text-secondary">
              USCIS systems
            </span>
            , paper notices, or advice from a qualified professional.
          </p>
        </div>
        <aside className="w-full shrink-0 rounded-2xl border border-qt-soft-gray bg-gradient-to-b from-white to-qt-mist/30 p-5 shadow-sm sm:max-w-[280px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
            Subscription
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-qt-text">
            {isPremium ? "Premium" : "Free"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-qt-text-secondary">
            {isPremium
              ? "Compare views and deeper timelines stay unlocked on this account."
              : "Core guides, tools, and tracking stay available. Premium adds depth for active cases."}
          </p>
          <Link
            href="/app/billing"
            className="mt-4 inline-flex text-sm font-semibold text-qt-slate underline decoration-qt-slate/30 underline-offset-4 hover:decoration-qt-slate"
          >
            {isPremium ? "Manage billing" : "View plans"}
          </Link>
        </aside>
      </div>
    </header>
  );
}
