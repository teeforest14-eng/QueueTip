"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { USCIS_FIELD_OFFICES } from "@/lib/uscis-field-offices";
import { cn } from "@/lib/cn";

export function FieldOfficePanel({
  caseId,
  initialValue,
  sourceHint,
}: {
  caseId: string;
  initialValue: string | null;
  sourceHint: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState(initialValue ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return USCIS_FIELD_OFFICES.slice(0, 10);
    return USCIS_FIELD_OFFICES.filter((o) =>
      o.toLowerCase().includes(q),
    ).slice(0, 12);
  }, [query]);

  async function persist(next: string | null) {
    setSaving(true);
    setErr(null);
    const res = await fetch(`/api/cases/${caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldOffice: next }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setErr(data.error ?? "Could not save");
      return;
    }
    setValue(next ?? "");
    setEditing(false);
    setQuery("");
    router.refresh();
  }

  return (
    <div className="rounded-[12px] bg-neutral-50/90 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Field office
          </p>
          {!editing ? (
            <p className="mt-1 text-sm font-medium text-neutral-900">
              {value || "Not available from source"}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-neutral-500">{sourceHint}</p>
          <p className="mt-1 text-xs text-neutral-500">
            Used to improve local timeline estimates — not a government record.
          </p>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-qt-slate underline-offset-2 hover:underline"
          >
            {value ? "Change" : "Add field office"}
          </button>
        ) : null}
      </div>

      {editing ? (
        <div className="mt-4 space-y-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search offices…"
            className="w-full rounded-[10px] border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-qt-primary/30"
          />
          <ul className="max-h-40 overflow-y-auto rounded-[10px] border border-neutral-100 bg-white">
            {matches.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => persist(o)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-50",
                    o === value && "bg-neutral-50 font-medium",
                  )}
                >
                  {o}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {value ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => persist(null)}
                className="rounded-[10px] px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Clear
              </button>
            ) : null}
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setEditing(false);
                setQuery("");
              }}
              className="rounded-[10px] px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
          {err ? <p className="text-sm text-red-600">{err}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
