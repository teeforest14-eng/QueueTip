import type { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function DashboardSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="border-b border-qt-soft-gray/80 px-6 pb-4 pt-6">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
            {eyebrow}
          </p>
        ) : null}
        <CardTitle className="mt-1 text-base sm:text-lg">{title}</CardTitle>
        {description ? (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-qt-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </Card>
  );
}
