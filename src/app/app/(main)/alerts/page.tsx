import { Suspense } from "react";
import { ImmigrationAlertsPageClient } from "@/components/app/alerts/immigration-alerts-page-client";

function AlertsFallback() {
  return (
    <div className="mx-auto max-w-6xl rounded-[14px] border border-white/80 bg-white/95 p-10 text-center text-sm text-neutral-600 shadow-[0_4px_28px_rgba(60,40,20,0.06)]">
      Loading alerts center…
    </div>
  );
}

export default function AlertsPage() {
  return (
    <Suspense fallback={<AlertsFallback />}>
      <ImmigrationAlertsPageClient />
    </Suspense>
  );
}
