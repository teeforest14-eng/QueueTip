import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "trust" | "support" | "soft" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "bg-qt-soft-gray text-qt-text",
    trust: "bg-qt-trust/80 text-qt-text",
    support: "bg-qt-support/90 text-qt-text",
    soft: "bg-qt-primary-soft text-qt-text",
    outline:
      "border border-qt-stone-200 bg-white text-qt-text shadow-[0_1px_0_rgba(17,17,17,0.04)]",
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
