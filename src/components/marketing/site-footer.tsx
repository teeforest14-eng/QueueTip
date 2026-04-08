import Link from "next/link";
import { BrandLockup } from "./brand-lockup";

export function SiteFooter() {
  return (
    <footer className="border-t border-qt-soft-gray bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8 lg:gap-10">
          <div className="md:col-span-5">
            <BrandLockup />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-qt-text-secondary">
              Structured guidance for family-based immigration, with official
              sources, clearly labeled guidance, and clear boundaries. Not a law
              firm.
            </p>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-qt-text-muted">
              See the privacy overview for how QueueTip handles account and case
              information.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:justify-end md:gap-7 lg:gap-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                Product
              </p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-qt-text-secondary">
                <li>
                  <Link href="/pricing" className="qt-link-subtle hover:text-qt-text">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="qt-link-subtle hover:text-qt-text">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="qt-link-subtle hover:text-qt-text">
                    How it works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                Trust
              </p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-qt-text-secondary">
                <li>
                  <Link href="/#trust-layer" className="qt-link-subtle hover:text-qt-text">
                    Facts vs guidance
                  </Link>
                </li>
                <li>
                  <Link href="/about#disclaimer" className="qt-link-subtle hover:text-qt-text">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                Legal
              </p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-qt-text-secondary">
                <li>
                  <Link href="/about#privacy" className="qt-link-subtle hover:text-qt-text">
                    Privacy overview
                  </Link>
                </li>
                <li>
                  <Link href="/about#terms" className="qt-link-subtle hover:text-qt-text">
                    Terms overview
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-qt-soft-gray pt-8 sm:mt-14 sm:pt-9 lg:mt-16 lg:pt-10">
          <p className="max-w-3xl text-xs leading-relaxed text-qt-text-muted">
            QueueTip is not a law firm and does not provide legal advice. Always
            verify filing requirements with USCIS and use qualified professionals
            when your case needs legal judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}
