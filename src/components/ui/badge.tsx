import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "trust" | "support" | "soft";
  className?: string;
}) {
  const tones = {
    neutral: "bg-qt-soft-gray text-qt-text",
    trust: "bg-qt-trust/80 text-qt-text",
    support: "bg-qt-support/90 text-qt-text",
    soft: "bg-qt-primary-soft text-qt-text",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
