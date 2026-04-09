import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 py-20 sm:px-8 sm:py-24">
      <div className="w-full max-w-[440px]">{children}</div>
    </div>
  );
}
