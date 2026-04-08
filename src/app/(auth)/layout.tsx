import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-qt-mist">
      <header className="border-b border-qt-soft-gray bg-qt-bg px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-qt-text">
          QueueTip
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
