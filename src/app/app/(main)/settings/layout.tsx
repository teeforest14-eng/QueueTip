import type { ReactNode } from "react";

/** Same soft green band as Official Tools — elevated white panels on top. */
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="track-page -mx-4 -my-8 bg-qt-trust-section px-4 py-10 sm:-mx-6 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}
