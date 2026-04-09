"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { message?: string };
    setLoading(false);
    setMessage(data.message ?? "If an account exists, check your email.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {message ? (
        <p
          className="rounded-[10px] border border-qt-soft-gray bg-qt-stone-50 px-3 py-2.5 text-sm text-qt-text-secondary"
          role="status"
        >
          {message}
        </p>
      ) : null}
      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="pt-1">
        <AuthPrimaryButton loading={loading} loadingLabel="Sending…">
          Send reset link
        </AuthPrimaryButton>
      </div>
      <p className="pt-1 text-center text-sm text-qt-text-secondary">
        <Link
          href="/login"
          className="font-medium text-qt-slate underline decoration-qt-soft-gray underline-offset-[5px] transition-colors duration-200 hover:text-qt-text hover:decoration-qt-slate/40"
        >
          Back to log in
        </Link>
      </p>
    </form>
  );
}
