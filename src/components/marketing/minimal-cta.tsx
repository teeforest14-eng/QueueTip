"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export function MinimalCTA({
  href,
  children,
  className,
  variant = "line",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** `primary` = solid CTA; `line` = underline / arrow link. */
  variant?: "line" | "primary";
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={cn(
          "qt-cta-primary group is-primary inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-base font-semibold tracking-tight text-qt-text",
          "bg-qt-primary shadow-[0_1px_0_rgba(17,17,17,0.06)] transition-[background-color,transform] duration-200",
          "hover:bg-qt-primary-hover active:scale-[0.99]",
          className,
        )}
      >
        {children}
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "qt-cta-line group inline-flex items-center gap-1.5 py-1 text-sm font-semibold tracking-tight text-qt-text",
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
