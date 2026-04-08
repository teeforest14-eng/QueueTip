"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function UpgradeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function upgrade() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/billing/upgrade", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      setMsg("Could not upgrade.");
      return;
    }
    setMsg("Upgraded to Premium (placeholder).");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="slate" disabled={loading} onClick={upgrade}>
        {loading ? "Working…" : "Upgrade to Premium (demo)"}
      </Button>
      {msg ? <p className="text-sm text-qt-text-secondary">{msg}</p> : null}
    </div>
  );
}
