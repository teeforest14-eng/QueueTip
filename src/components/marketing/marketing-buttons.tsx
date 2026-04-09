import Link from "next/link";
import { cn } from "@/lib/cn";

export function MarketingPrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "qt-cta-primary is-primary inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold tracking-tight text-neutral-950",
        "bg-qt-primary shadow-[0_1px_0_rgba(17,17,17,0.06)] transition-[background-color,transform] duration-200",
        "hover:bg-qt-primary-hover active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function MarketingSecondaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "is-secondary qt-link-subtle inline-flex items-center gap-1 py-1 text-sm font-medium tracking-tight text-qt-text-secondary",
        "transition-colors duration-200 hover:text-qt-text",
        className,
      )}
    >
      {children}
    </Link>
  );
}
