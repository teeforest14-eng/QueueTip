import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AuthFormCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-qt-soft-gray bg-white p-8 shadow-[0_20px_56px_-28px_rgba(17,17,17,0.12)]",
        className,
      )}
    >
      <div className="mb-8 flex justify-center">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-qt-text transition-colors duration-200 hover:text-qt-slate"
        >
          QueueTip
        </Link>
      </div>
      {children}
    </div>
  );
}
