"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrandLockup } from "@/components/marketing/brand-lockup";
import { cn } from "@/lib/cn";

const links = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/prepare", label: "Prepare" },
  { href: "/app/track", label: "Track" },
  { href: "/app/resolve", label: "Resolve" },
  { href: "/app/explore", label: "Explore" },
  { href: "/app/tools", label: "Tools" },
  { href: "/app/help-directory", label: "Help" },
  { href: "/app/alerts", label: "Alerts" },
];

export function AppTopNav({ email }: { email?: string | null }) {
  const pathname = usePathname();
  return (
    <header className="border-b border-qt-soft-gray bg-qt-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLockup variant="app" href="/app/dashboard" />
          <span className="hidden truncate text-xs text-qt-text-muted sm:inline">
            {email}
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-qt-text-secondary hover:text-qt-text",
                pathname === l.href && "font-medium text-qt-slate",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/app/settings"
            className={cn(
              "text-qt-text-secondary hover:text-qt-text",
              pathname.startsWith("/app/settings") && "font-medium text-qt-slate",
            )}
          >
            Settings
          </Link>
          <Link
            href="/app/billing"
            className="text-qt-text-secondary hover:text-qt-text"
          >
            Billing
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-qt-text-secondary hover:text-qt-text"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
