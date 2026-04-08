"use client";

import { ContentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GuideStatusForm({
  id,
  status,
}: {
  id: string;
  status: ContentStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/guides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: value }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="flex items-center gap-2 text-sm">
      <select
        className="rounded-lg border border-qt-soft-gray px-2 py-1"
        value={value}
        onChange={(e) => setValue(e.target.value as ContentStatus)}
      >
        <option value="DRAFT">DRAFT</option>
        <option value="PUBLISHED">PUBLISHED</option>
      </select>
      <Button type="submit" variant="secondary" disabled={loading}>
        Save
      </Button>
    </form>
  );
}
