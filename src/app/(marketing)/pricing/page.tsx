import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-qt-text sm:text-4xl">
        Pricing
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-qt-text-secondary">
        Free is intentionally capable: you still get official-tool discipline and
        honest boundaries. Premium is for families managing active cases who want
        saved workflows, deeper history, and stronger alerts—without locking the
        basics.
      </p>
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <Card className="shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <CardTitle className="text-xl">Free</CardTitle>
            <span className="text-3xl font-semibold text-qt-text">$0</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
            Guided onboarding, structured Prepare content, a full Track
            workspace for receipts you add, Resolve templates, and the official
            USCIS tools hub.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-qt-text-secondary">
            <li>· Guided onboarding and home dashboard</li>
            <li>· Prepare guides and document checklists (I-130, I-485, I-765, I-131)</li>
            <li>· Case tracking with grouped receipts and labeled interpretation</li>
            <li>· Issue guides for common stuck points</li>
            <li>· Help directory browsing inside the app</li>
            <li>· Official USCIS links embedded in context</li>
          </ul>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-lg bg-qt-primary px-5 py-3 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-qt-primary-hover"
          >
            Start free
          </Link>
        </Card>
        <Card className="border-qt-primary-soft bg-gradient-to-br from-qt-primary-soft/30 to-qt-bg shadow-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Premium</CardTitle>
              <Badge tone="soft">Active cases</Badge>
            </div>
            <div>
              <span className="text-3xl font-semibold text-qt-text">$10</span>
              <span className="text-lg text-qt-text-secondary">/month</span>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">
            Cancel anytime. Informational guidance only—not legal representation.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-qt-text-secondary">
            <li>· Saved workflows and deeper checklist progress</li>
            <li>· Expanded timeline and snapshot history across groups</li>
            <li>· Richer side-by-side views where you have multiple receipts</li>
            <li>· Range-based estimates with explicit uncertainty (never promises)</li>
            <li>· More alert categories and follow-up prompts</li>
            <li>· More personalized recommended next steps</li>
          </ul>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-lg bg-qt-slate px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Create account — upgrade in app
          </Link>
        </Card>
      </div>
      <p className="mt-12 max-w-2xl text-xs leading-relaxed text-qt-text-muted">
        QueueTip is not a law firm. Subscriptions cover software access only.
        Payment processing may vary by deployment; billing details appear at
        checkout when card charging is enabled.
      </p>
    </div>
  );
}
