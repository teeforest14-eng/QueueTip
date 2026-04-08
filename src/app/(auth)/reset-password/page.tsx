import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Set new password",
};

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-qt-text">New password</h1>
      <p className="mt-2 text-sm text-qt-text-secondary">
        Choose a strong password you have not used elsewhere.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-qt-text-secondary">Loading…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
