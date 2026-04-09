import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Elevated white panel on the soft green Track background. */
export function TrackSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] bg-white text-neutral-900 shadow-[0_2px_12px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
