"use client";

import { signOut } from "next-auth/react";

export function OnboardingTopBar() {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
      <span className="text-sm font-semibold text-qt-text">Onboarding</span>
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
