"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forms = ["I-130", "I-485", "I-765", "I-131"];

export function AddCaseForm() {
  const router = useRouter();
  const [receiptNumber, setReceipt] = useState("");
  const [formType, setFormType] = useState("I-485");
  const [groupLabel, setGroupLabel] = useState("");
  const [caseGroupId, setCaseGroupId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiptNumber,
        formType,
        groupLabel: groupLabel || undefined,
        caseGroupId: caseGroupId || undefined,
      }),
    });
    const data = (await res.json()) as { error?: string; caseId?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not add case");
      return;
    }
    router.push(`/app/track/${data.caseId}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-qt-soft-gray bg-qt-bg p-6 shadow-sm"
    >
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <Label htmlFor="receipt">Receipt number</Label>
        <Input
          id="receipt"
          className="mt-1 font-mono"
          placeholder="MSC1290123456"
          value={receiptNumber}
          onChange={(e) => setReceipt(e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-qt-text-muted">
          3 letters + 10 digits, no spaces.
        </p>
      </div>
      <div>
        <Label htmlFor="form">Form type</Label>
        <select
          id="form"
          className="mt-1 w-full rounded-lg border border-qt-soft-gray bg-white px-3 py-2 text-sm"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          {forms.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="label">New group label (optional)</Label>
        <Input
          id="label"
          className="mt-1"
          placeholder="e.g. Marina & Sam — AOS package"
          value={groupLabel}
          onChange={(e) => setGroupLabel(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="gid">Existing group ID (optional)</Label>
        <Input
          id="gid"
          className="mt-1 font-mono text-xs"
          placeholder="Paste to add to an existing group"
          value={caseGroupId}
          onChange={(e) => setCaseGroupId(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving…" : "Save receipt"}
      </Button>
    </form>
  );
}
