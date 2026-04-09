import type { ReactNode } from "react";

/** Same calm blue-gray band as Resolve — white panels read as elevated. */
export default function HelpDirectoryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="resolve-page -mx-4 -my-8 bg-qt-resolve-page px-4 py-10 sm:-mx-6 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}
