import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function ExploreSurface({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-[14px] border border-white/80 bg-white/95 shadow-[0_4px_32px_rgba(60,40,20,0.06)] backdrop-blur-[1px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
