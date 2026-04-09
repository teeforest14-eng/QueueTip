import Link from "next/link";
import type { ReactNode } from "react";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

export function TrackPageHeader({
  secondaryAction,
}: {
  secondaryAction?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6 pb-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Track
        </h1>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          One calm workspace for official status, plain-English meaning, what to
          do next, history, and timing context — always verify on USCIS Case
          Status.
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <Link href="/app/track/add-case" className={appPrimaryCtaClassWide}>
          Add receipt
        </Link>
        {secondaryAction}
      </div>
    </header>
  );
}
