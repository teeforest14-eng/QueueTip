"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LoginLineField } from "@/components/auth/login-line-field";
import { LoginLineSelect } from "@/components/auth/login-line-select";
import { QueueTipLogo } from "@/components/auth/queue-tip-logo";
import { getSignupCountries } from "@/lib/signup-countries";

const footerLinkClass =
  "text-neutral-500 underline decoration-neutral-200 underline-offset-[5px] transition-colors duration-200 hover:text-neutral-800 hover:decoration-neutral-400";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") ?? "";
  const countries = useMemo(() => getSignupCountries(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        country,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: unknown;
    };
    if (!res.ok) {
      setLoading(false);
      const err = data.error;
      setError(
        typeof err === "string"
          ? err
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
    <div className="mx-auto flex w-full max-w-[min(100%,18.5rem)] flex-col">
      <div className="mb-10 flex justify-center">
        <QueueTipLogo />
      </div>

      <h1 className="mb-14 text-center text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-neutral-400">
        Create account
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col">
        {error ? (
          <p
            className="mb-10 text-center text-sm leading-relaxed text-red-600"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-10">
          <LoginLineField
            id="firstName"
            label="First name (optional)"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <LoginLineField
            id="lastName"
            label="Last name (optional)"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <LoginLineField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LoginLineSelect
            id="country"
            label="Country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </LoginLineSelect>
          <div>
            <LoginLineField
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-2 text-xs text-neutral-400">
              At least 8 characters.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-14 w-full rounded-sm bg-qt-primary py-3.5 text-[15px] font-medium tracking-[-0.015em] text-neutral-950 transition-[background-color,opacity] duration-200 ease-out hover:bg-qt-primary-hover disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qt-slate"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="text-center text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className={footerLinkClass}>
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
