"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function SyncButton({
  caseId,
  className,
}: {
  caseId: string;
  className?: string;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setMsg(null);
    const res = await fetch(`/api/cases/${caseId}/sync`, { method: "POST" });
    const data = (await res.json()) as {
      error?: string;
      statusLabel?: string;
    };
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error ?? "Sync failed");
      return;
    }
    setMsg(`Recorded practice status: ${data.statusLabel}`);
    router.refresh();
  }

  return (
    <div className={cn("flex flex-col items-stretch gap-2 sm:items-end", className)}>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-[10px] border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
      >
        {loading ? "Syncing…" : "Refresh sync"}
      </button>
      {msg ? (
        <p className="max-w-xs text-right text-xs text-neutral-600">{msg}</p>
      ) : null}
    </div>
  );
}
