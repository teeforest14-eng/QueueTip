import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Set new password",
};

export default function ResetPasswordPage() {
  return (
    <AuthFormCard>
      <AuthPageHeader
        title="New password"
        subtitle="Choose a strong password you have not used elsewhere."
      />
      <Suspense
        fallback={<p className="text-sm text-qt-text-secondary">Loading…</p>}
      >
        <ResetForm />
      </Suspense>
    </AuthFormCard>
  );
}
