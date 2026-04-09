import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function ResolveSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-white/70 bg-white/95 shadow-[0_4px_28px_rgba(20,50,100,0.07)] backdrop-blur-[2px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
