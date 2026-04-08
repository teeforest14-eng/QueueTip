import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-qt-text">Create your account</h1>
      <p className="mt-2 text-sm text-qt-text-secondary">
        You will complete a short onboarding flow next so we can route you to
        the right path.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-qt-text-secondary">Loading…</p>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
