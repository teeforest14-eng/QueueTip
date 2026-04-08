"use client";

import type { Alert } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AlertRow({ alert }: { alert: Alert }) {
  const router = useRouter();
  const [read, setRead] = useState(!!alert.readAt);
  const [loading, setLoading] = useState(false);

  async function markRead() {
    setLoading(true);
    await fetch(`/api/alerts/${alert.id}/read`, { method: "POST" });
    setRead(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <li className="rounded-xl border border-qt-soft-gray bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-qt-text">{alert.title}</p>
          <p className="text-sm text-qt-text-secondary">{alert.body}</p>
          <p className="mt-1 text-xs text-qt-text-muted">
            {alert.createdAt.toLocaleString()} · {alert.type}
          </p>
        </div>
        {!read ? (
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={markRead}
          >
            Mark read
          </Button>
        ) : (
          <span className="text-xs text-qt-text-muted">Read</span>
        )}
      </div>
    </li>
  );
}
