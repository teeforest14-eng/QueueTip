import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/marketing/brand-lockup";
import { requireAdmin } from "@/lib/require-admin";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/issues", label: "Issues" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/help-directory", label: "Help directory" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/content", label: "Content" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="min-h-full bg-qt-mist">
      <header className="border-b border-qt-soft-gray bg-qt-bg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLockup variant="app" href="/admin" />
            <span className="hidden text-sm font-semibold text-qt-text sm:inline">
              Admin
            </span>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-qt-slate hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/app/dashboard"
            className="ml-auto text-sm text-qt-text-secondary hover:text-qt-text"
          >
            Exit
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
