import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-normal leading-[1.1] tracking-tight text-qt-text",
          align === "center" && "mx-auto max-w-2xl",
        )}
      >
        {title}
      </h2>
      {description ? (
        <div
          className={cn(
            "mt-5 text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-qt-text-secondary",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
