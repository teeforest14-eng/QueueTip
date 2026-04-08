"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-qt-soft-gray bg-qt-bg p-6 shadow-sm"
    >
      {message ? (
        <p className="text-sm text-qt-text-secondary" role="status">
          {message}
        </p>
      ) : null}
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-qt-text-secondary">
        <Link href="/login" className="text-qt-slate underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
