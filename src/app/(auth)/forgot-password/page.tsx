import type { Metadata } from "next";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthFormCard>
      <AuthPageHeader
        title="Reset password"
        subtitle="We’ll email a link when outbound email is configured. In development, check the server log for the reset path."
      />
      <ForgotForm />
    </AuthFormCard>
  );
}
