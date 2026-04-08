import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandLockup({
  className,
  compact = false,
  variant = "default",
}: {
  className?: string;
  compact?: boolean;
  /** `header`: slightly smaller mark for the sticky nav. */
  variant?: "default" | "header";
}) {
  const logoBox =
    variant === "header"
      ? "h-36 w-36 sm:h-40 sm:w-40"
      : compact
        ? "h-32 w-32"
        : "h-40 w-40 sm:h-44 sm:w-44";

  const imageSizes =
    variant === "header"
      ? "(max-width: 640px) 144px, 160px"
      : "(max-width: 640px) 160px, 176px";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 text-left text-qt-text",
        compact ? "gap-3" : variant === "header" ? "gap-3 sm:gap-4" : "gap-4 sm:gap-5",
        className,
      )}
      aria-label="QueueTip home"
    >
      <span
        className={cn(
          "relative block shrink-0 overflow-hidden",
          logoBox,
        )}
      >
        <Image
          src="/brand/queuetip-logo-bw.png"
          alt="QueueTip logo"
          fill
          className="object-contain"
          sizes={imageSizes}
          priority
        />
      </span>
      <span
        className={cn(
          "min-w-0 leading-none",
          variant === "header" &&
            !compact &&
            "flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3",
        )}
      >
        {variant === "header" && !compact ? (
          <>
            <span className="shrink-0 font-display text-[1.18rem] tracking-tight sm:text-[1.25rem]">
              QueueTip
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted sm:text-[11px] sm:tracking-[0.22em]">
              Family-based immigration guidance
            </span>
          </>
        ) : (
          <>
            <span
              className={cn(
                "block font-display tracking-tight",
                compact ? "text-[1.05rem]" : "text-[1.18rem] sm:text-[1.25rem]",
              )}
            >
              QueueTip
            </span>
            {!compact ? (
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-qt-text-muted">
                Family immigration guidance
              </span>
            ) : null}
          </>
        )}
      </span>
    </Link>
  );
}
