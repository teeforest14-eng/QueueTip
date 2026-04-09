import type { ReactNode } from "react";

/** Soft green section background (`--qt-trust-section`); white cards sit elevated on top. */
export default function TrackLayout({ children }: { children: ReactNode }) {
  return (
    <div className="track-page -mx-4 -my-8 bg-qt-trust-section px-4 py-10 sm:-mx-6 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}
