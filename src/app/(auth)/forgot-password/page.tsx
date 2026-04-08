import type { Metadata } from "next";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-qt-text">Reset password</h1>
      <p className="mt-2 text-sm text-qt-text-secondary">
        We will email a link when outbound email is configured. In development,
        check the server log for the reset path.
      </p>
      <div className="mt-8">
        <ForgotForm />
      </div>
    </div>
  );
}
