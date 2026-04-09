"use client";

/**
 * Catches errors in the root layout. Must define <html> and <body>.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-100 px-4 py-16 text-neutral-900">
        <div className="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold">This page couldn’t load</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {error.message ||
              "A server error occurred at the root of the app. This is often a bad AUTH_SECRET rotation, a broken build, or an environment mismatch—not your password."}
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-neutral-500">
              Reference: {error.digest}
            </p>
          ) : null}
          <p className="mt-4 text-sm text-neutral-600">
            If you recently changed hosts, confirm{" "}
            <span className="font-medium">AUTH_URL</span> /{" "}
            <span className="font-medium">NEXTAUTH_URL</span> match this site’s
            URL and that <span className="font-medium">DATABASE_URL</span> and{" "}
            <span className="font-medium">prisma migrate deploy</span> match that
            database.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 text-sm font-semibold text-neutral-900 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
