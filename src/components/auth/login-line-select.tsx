import { cn } from "@/lib/cn";
import type { SelectHTMLAttributes } from "react";

type LoginLineSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  label: string;
  className?: string;
};

/** Line-style native select; styled via `.qt-login-line-select` in globals.css */
export function LoginLineSelect({
  label,
  id,
  className,
  children,
  ...props
}: LoginLineSelectProps) {
  return (
    <div className={cn("w-full [-webkit-tap-highlight-color:transparent]", className)}>
      <label
        htmlFor={id}
        className="mb-2.5 block text-[11px] font-normal uppercase tracking-[0.12em] text-neutral-500"
      >
        {label}
      </label>
      <select
        id={id}
        className="qt-login-line-select w-full py-2.5 text-[17px] font-normal text-black"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
