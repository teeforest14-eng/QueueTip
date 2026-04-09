import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

type AuthFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "placeholder"
> & {
  label: string;
  hint?: string;
  trailing?: ReactNode;
  className?: string;
};

export function AuthField({
  label,
  hint,
  trailing,
  id,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        placeholder=" "
        className={cn(
          "peer h-12 w-full rounded-[10px] border border-qt-soft-gray bg-white px-3 pb-2 pt-5 text-[15px] text-qt-text",
          "shadow-[inset_0_1px_2px_rgba(17,17,17,0.04)]",
          "transition-[border-color,box-shadow] duration-200 ease-out",
          "placeholder:text-transparent",
          "focus:border-qt-slate focus:outline-none focus:ring-2 focus:ring-qt-support/35",
          trailing ? "pr-11" : undefined,
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 origin-[0_50%] -translate-y-1/2 text-[15px] text-qt-text-muted",
          "transition-all duration-200 ease-out",
          "peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-qt-slate",
          "peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-qt-text-secondary",
        )}
      >
        {label}
      </label>
      {trailing ? (
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-qt-text-muted [&_svg]:h-[18px] [&_svg]:w-[18px]"
          aria-hidden
        >
          {trailing}
        </span>
      ) : null}
      {hint ? (
        <p className="mt-2 text-xs leading-relaxed text-qt-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
