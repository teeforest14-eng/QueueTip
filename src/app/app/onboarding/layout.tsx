import type { ReactNode } from "react";
import { OnboardingTopBar } from "./onboarding-top";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-qt-soft-gray bg-qt-bg">
        <OnboardingTopBar />
      </header>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
