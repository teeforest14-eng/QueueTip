import type { ReactNode } from "react";

export default function AppRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-qt-mist">{children}</div>;
}
