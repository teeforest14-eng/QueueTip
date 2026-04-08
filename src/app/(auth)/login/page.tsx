import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-qt-text">Log in</h1>
      <p className="mt-2 text-sm text-qt-text-secondary">
        Access your dashboard, cases, and saved progress.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-qt-text-secondary">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
