import Link from "next/link";
import { TrackSurface } from "./track-surface";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

export function TrackEmptyState() {
  return (
    <TrackSurface className="p-8 sm:p-10">
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
          No cases yet
        </p>
        <h2 className="mt-2 text-xl font-semibold text-neutral-900">
          Start your tracking workspace
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          Add a receipt to unlock grouped forms, status tabs, timelines, and
          guidance. Invalid receipt formats are blocked early so you do not
          chase typos.
        </p>
        <Link
          href="/app/track/add-case"
          className={appPrimaryCtaClassWide + " mt-8 inline-block"}
        >
          Add receipt
        </Link>
      </div>
    </TrackSurface>
  );
}
