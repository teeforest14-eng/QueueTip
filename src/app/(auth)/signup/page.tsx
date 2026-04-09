import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-xs text-neutral-400">Loading…</p>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
