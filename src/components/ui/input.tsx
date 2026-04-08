import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-qt-soft-gray bg-white px-3 py-2 text-sm text-qt-text shadow-sm placeholder:text-qt-text-muted focus:border-qt-slate focus:outline-none focus:ring-2 focus:ring-qt-support/40",
        className,
      )}
      {...props}
    />
  );
}
