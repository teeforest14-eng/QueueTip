import type { ReactNode } from "react";

/** Same warm cream as marketing landing (`#FFF6E8`); white cards sit on top. */
export default function PrepareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="prepare-page -mx-4 -my-8 bg-qt-warm-cream px-4 py-10 sm:-mx-6 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}
