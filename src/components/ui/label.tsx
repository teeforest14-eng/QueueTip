import { cn } from "@/lib/cn";
import type { LabelHTMLAttributes, ReactNode } from "react";

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label
      className={cn("text-sm font-medium text-qt-text-secondary", className)}
      {...props}
    >
      {children}
    </label>
  );
}
