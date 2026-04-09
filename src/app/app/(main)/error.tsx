"use client";

import { useEffect } from "react";

export default function MainAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[QueueTip] app main segment error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-16">
      <h1 className="font-display text-lg font-semibold text-qt-text">
        This part of the app couldn’t load
      </h1>
      <p className="text-sm leading-relaxed text-qt-text-secondary">
        {error.message ||
          "A server error occurred. If you just signed in, check database migrations and DATABASE_URL on your host."}
      </p>
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
