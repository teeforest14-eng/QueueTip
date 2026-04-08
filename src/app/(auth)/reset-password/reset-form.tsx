"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-qt-soft-gray bg-qt-bg p-6 shadow-sm"
    >
      {!token ? (
        <p className="text-sm text-red-700">
          Missing token. Open the link from your reset email (or dev server
          log).
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          minLength={8}
          required
          className="mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !token}>
        {loading ? "Saving…" : "Update password"}
      </Button>
      <p className="text-center text-sm text-qt-text-secondary">
        <Link href="/login" className="text-qt-slate underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
