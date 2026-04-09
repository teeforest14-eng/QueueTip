import { Suspense } from "react";
import { HelpDirectoryPageClient } from "@/components/app/help-directory/help-directory-page-client";

function HelpDirectoryFallback() {
  return (
    <div className="mx-auto max-w-6xl rounded-[14px] border border-white/80 bg-white/90 p-10 text-center text-sm text-neutral-600 shadow-[0_4px_28px_rgba(20,50,100,0.07)]">
      Loading directory…
    </div>
  );
}

export default function HelpDirectoryPage() {
  return (
    <Suspense fallback={<HelpDirectoryFallback />}>
      <HelpDirectoryPageClient />
    </Suspense>
  );
}
