"use client";

import { useEffect } from "react";

/** Catches errors in /app/* subtree (including (main)/layout) so users see a message, not only a digest. */
export default function AppAreaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[QueueTip] /app error boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-16">
      <h1 className="font-display text-lg font-semibold text-qt-text">
        This page couldn’t load
      </h1>
      <p className="text-sm leading-relaxed text-qt-text-secondary">
        {error.message ||
          `A server error occurred in the app shell. Check DATABASE_URL, run prisma migrate deploy on that database, and confirm AUTH_URL matches this site. Reference: ${error.digest ?? "n/a"}`}
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-qt-text-muted">
          Reference: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="text-sm font-semibold text-qt-slate underline underline-offset-4"
      >
        Try again
      </button>
    </div>
  );
}
