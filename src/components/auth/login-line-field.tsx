import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type LoginLineFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  className?: string;
};

/** Line-only inputs: bottom border only; UA focus box suppressed via `.qt-login-line-input`. */
export function LoginLineField({
  label,
  id,
  className,
  ...props
}: LoginLineFieldProps) {
  return (
    <div
      className={cn("w-full [-webkit-tap-highlight-color:transparent]", className)}
    >
      <label
        htmlFor={id}
        className="mb-2.5 block text-[11px] font-normal uppercase tracking-[0.12em] text-neutral-500"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "qt-login-line-input w-full py-2.5 text-[17px] font-normal text-black",
          "placeholder:text-neutral-400",
        )}
        {...props}
      />
    </div>
  );
}
