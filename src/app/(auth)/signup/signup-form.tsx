"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: unknown;
    };
    if (!res.ok) {
      setLoading(false);
      setError(
        typeof data.error === "string"
          ? data.error
          : "Could not create account.",
      );
      return;
    }
    const sign = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (sign?.error) {
      setError("Account created but sign-in failed. Try logging in.");
      return;
    }
    const onb = new URL("/app/onboarding", window.location.origin);
    if (intent) onb.searchParams.set("intent", intent);
    router.push(onb.pathname + onb.search);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-qt-soft-gray bg-qt-bg p-6 shadow-sm"
    >
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First name (optional)</Label>
          <Input
            id="firstName"
            className="mt-1"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last name (optional)</Label>
          <Input
            id="lastName"
            className="mt-1"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          className="mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={8}
          className="mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="mt-1 text-xs text-qt-text-muted">At least 8 characters.</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-qt-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-qt-slate underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
