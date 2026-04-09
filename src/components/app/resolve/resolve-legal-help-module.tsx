import Link from "next/link";
import { ResolveSurface } from "./resolve-surface";
import { appPrimaryCtaClassWide } from "@/lib/app-cta-styles";

export function ResolveLegalHelpModule({
  variant = "detail",
}: {
  variant?: "detail" | "compact";
}) {
  return (
    <ResolveSurface
      className={
        variant === "detail"
          ? "border-qt-slate/20 bg-gradient-to-br from-[#f4f7fc] to-white p-6 sm:p-8"
          : "border-qt-slate/15 bg-[#f4f7fc] p-5"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-qt-slate">
        Qualified legal help
      </p>
      <h3 className="mt-2 text-lg font-semibold text-neutral-900">
        This issue may be legally consequential
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        USCIS and immigration courts apply complex rules to unlawful presence,
        criminal history, fraud findings, waivers, and removal proceedings. Only
        an attorney licensed in the United States or a{" "}
        <span className="font-medium">DOJ-accredited representative</span> can
        give you legal advice tailored to your facts. QueueTip orients you to
        official materials—it does not assess admissibility or represent you.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/app/help-directory"
          className={appPrimaryCtaClassWide + " text-center"}
        >
          Open Help Directory
        </Link>
        <Link
          href="https://www.uscis.gov/avoid-scams/find-legal-services"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
          target="_blank"
          rel="noreferrer"
        >
          USCIS — find legal services
        </Link>
      </div>
    </ResolveSurface>
  );
}
