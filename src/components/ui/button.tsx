import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "slate";

const variants: Record<Variant, string> = {
  primary:
    "bg-qt-primary text-neutral-950 shadow-sm hover:bg-qt-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qt-slate",
  secondary:
    "bg-white text-qt-text border border-qt-soft-gray shadow-sm hover:bg-qt-mist",
  ghost: "text-qt-slate hover:bg-white/80",
  slate: "bg-qt-slate text-white hover:opacity-95",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
