"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SyncButton({ caseId }: { caseId: string }) {
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
    <div className="space-y-2">
      <Button type="button" onClick={run} disabled={loading}>
        {loading ? "Syncing…" : "Refresh status (practice)"}
      </Button>
      {msg ? <p className="text-sm text-qt-text-secondary">{msg}</p> : null}
    </div>
  );
}
