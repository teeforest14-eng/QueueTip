"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginLineField } from "@/components/auth/login-line-field";
import { QueueTipLogo } from "@/components/auth/queue-tip-logo";

const footerLinkClass =
  "text-neutral-500 underline decoration-neutral-200 underline-offset-[5px] transition-colors duration-200 hover:text-neutral-800 hover:decoration-neutral-400";

export function LoginForm({
  callbackUrl = "/app/dashboard",
}: {
  callbackUrl?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-[min(100%,18.5rem)] flex-col">
      <div className="mb-10 flex justify-center">
        <QueueTipLogo />
      </div>

      <h1 className="mb-14 text-center text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-neutral-400">
        Welcome back
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col">
        {error ? (
          <p className="mb-10 text-center text-sm leading-relaxed text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-10">
          <LoginLineField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LoginLineField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-14 w-full rounded-sm bg-qt-primary py-3.5 text-[15px] font-medium tracking-[-0.015em] text-neutral-950 transition-[background-color,opacity] duration-200 ease-out hover:bg-qt-primary-hover disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qt-slate"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>

        <div className="mt-20 flex flex-col items-center gap-6">
          <Link href="/forgot-password" className={`text-xs ${footerLinkClass}`}>
            Forgot password?
          </Link>
          <p className="text-center text-xs text-neutral-400">
            No account?{" "}
            <Link href="/signup" className={footerLinkClass}>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
