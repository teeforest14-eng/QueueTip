"use client";

import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

function Spinner() {
  return (
    <svg
      className="h-[18px] w-[18px] animate-spin text-neutral-950/70"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function AuthPrimaryButton({
  children,
  loading,
  loadingLabel = "Signing in…",
  className,
  disabled,
  type = "submit",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "relative flex h-[52px] w-full shrink-0 items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold text-neutral-950",
        "bg-qt-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(17,17,17,0.06)]",
        "transition-[transform,background-color,box-shadow,opacity] duration-200 ease-out",
        "hover:bg-qt-primary-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_8px_rgba(17,17,17,0.08)]",
        "hover:scale-[1.01] motion-reduce:hover:scale-100 active:scale-[0.995] motion-reduce:active:scale-100",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qt-slate/50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2.5">
          <Spinner />
          <span>{loadingLabel}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
