"use client";

import { signOut } from "next-auth/react";
import { BrandLockup } from "@/components/marketing/brand-lockup";

export function OnboardingTopBar() {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <BrandLockup variant="app" href="/app/dashboard" />
        <span className="hidden text-sm font-semibold text-qt-text sm:inline">
          Onboarding
        </span>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-qt-text-secondary hover:text-qt-text"
      >
        Sign out
      </button>
    </div>
  );
}
