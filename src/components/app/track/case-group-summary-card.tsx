import Link from "next/link";
import { TrackSurface } from "./track-surface";
import { appPrimaryCtaClass } from "@/lib/app-cta-styles";

type Props = {
  title: string;
  receiptCount: number;
  formsLabel: string;
  primaryStatus: string | null;
  stageSummary: string;
  lastSyncedAt: Date | null;
  lastGroupUpdatedAt: Date | null;
  fieldOffice: string | null;
  latestCaseId: string | null;
};

function fmt(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CaseGroupSummaryCard({
  title,
  receiptCount,
  formsLabel,
  primaryStatus,
  stageSummary,
  lastSyncedAt,
  lastGroupUpdatedAt,
  fieldOffice,
  latestCaseId,
}: Props) {
  return (
    <TrackSurface className="p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
            My case group
          </p>
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-600">
            {receiptCount} receipt{receiptCount === 1 ? "" : "s"}
            {formsLabel ? (
              <>
                {" "}
                · Forms: <span className="text-neutral-800">{formsLabel}</span>
              </>
            ) : null}
          </p>
        </div>
        {latestCaseId ? (
          <Link
            href={`/app/track/${latestCaseId}`}
            className={appPrimaryCtaClass + " inline-flex justify-center px-4 py-2.5"}
          >
            Open primary case
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 border-t border-neutral-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-neutral-500">Primary status</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">
            {primaryStatus ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">
            Estimated stage
          </p>
          <p className="mt-1 text-sm text-neutral-800">{stageSummary}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Last sync</p>
          <p className="mt-1 text-sm text-neutral-800">{fmt(lastSyncedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500">Last updated</p>
          <p className="mt-1 text-sm text-neutral-800">
            {fmt(lastGroupUpdatedAt)}
          </p>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-neutral-500">Field office</p>
          <p className="mt-1 text-sm text-neutral-800">
            {fieldOffice ?? "Not set on any receipt in this group"}
          </p>
        </div>
      </div>
    </TrackSurface>
  );
}
