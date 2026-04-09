import type { ReactNode } from "react";

/** Calm blue-gray band; white panels read as elevated guidance surfaces. */
export default function ResolveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="resolve-page -mx-4 -my-8 bg-qt-resolve-page px-4 py-10 sm:-mx-6 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}
