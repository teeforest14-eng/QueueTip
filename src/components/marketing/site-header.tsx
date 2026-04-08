"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { MarketingPrimaryLink, MarketingSecondaryLink } from "./marketing-buttons";
import { BrandLockup } from "./brand-lockup";
import { useState } from "react";

const nav = [
  { href: "/#trust-layer", label: "How QueueTip works" },
  { href: "/#paths", label: "Paths" },
  { href: "/#how-it-works", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-qt-soft-gray/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 lg:items-center">
            <BrandLockup variant="header" />
            <div className="flex shrink-0 items-center gap-2.5 lg:hidden">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="qt-header-menu-button inline-flex items-center justify-center rounded-md border border-qt-soft-gray bg-white px-2.5 py-2 text-sm font-semibold text-qt-text-secondary shadow-[0_1px_0_rgba(17,17,17,0.04)] transition-colors hover:bg-qt-mist/60 hover:text-qt-text"
                aria-expanded={open}
                aria-controls="mobile-marketing-nav"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <span className="sr-only">Menu</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  {open ? (
                    <>
                      <path d="M18 6L6 18M6 6l12 12" />
                    </>
                  ) : (
                    <>
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <nav className="hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium tracking-tight text-qt-text-secondary lg:flex lg:flex-1 lg:justify-center">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="qt-link-subtle !text-[13px] !font-medium !text-qt-text-secondary hover:!text-qt-text"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/login"
              className={cn(
                "qt-link-subtle text-sm font-semibold text-qt-text-secondary hover:text-qt-text",
              )}
            >
              Log in
            </Link>
            <MarketingPrimaryLink href="/signup">Start free</MarketingPrimaryLink>
          </div>
        </div>

        {open ? (
          <div
            id="mobile-marketing-nav"
            className="mt-3 space-y-4 border-t border-qt-soft-gray pt-4 lg:hidden"
          >
            <nav className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm font-medium text-qt-text-secondary">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="qt-link-subtle py-1"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between">
              <MarketingSecondaryLink href="/login" className="text-sm">
                Log in
              </MarketingSecondaryLink>
              <MarketingPrimaryLink href="/signup" className="text-sm">
                Start free
              </MarketingPrimaryLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
