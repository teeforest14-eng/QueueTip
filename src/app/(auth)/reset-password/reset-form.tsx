"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { LockIcon } from "@/components/auth/lock-icon";

export function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Reset failed.");
      return;
    }
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {!token ? (
        <p className="rounded-[10px] border border-amber-200/90 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
          Missing token. Open the link from your reset email (or dev server
          log).
        </p>
      ) : null}
      {error ? (
        <p
          className="rounded-[10px] border border-rose-200/90 bg-rose-50 px-3 py-2.5 text-sm text-rose-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <AuthField
        id="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        trailing={<LockIcon />}
        hint="At least 8 characters."
      />
      <div className="pt-1">
        <AuthPrimaryButton
          loading={loading}
          loadingLabel="Saving…"
          disabled={!token}
        >
          Update password
        </AuthPrimaryButton>
      </div>
      <p className="pt-1 text-center text-sm text-qt-text-secondary">
        <Link
          href="/login"
          className="font-medium text-qt-slate underline decoration-qt-soft-gray underline-offset-[5px] transition-colors duration-200 hover:text-qt-text hover:decoration-qt-slate/40"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
