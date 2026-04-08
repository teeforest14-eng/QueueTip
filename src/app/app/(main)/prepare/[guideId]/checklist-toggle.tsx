"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ChecklistToggle({
  checklistItemId,
  initialCompleted,
  initialSavedLater,
}: {
  checklistItemId: string;
  initialCompleted: boolean;
  initialSavedLater: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [savedLater, setSavedLater] = useState(initialSavedLater);
  const [loading, setLoading] = useState(false);

  async function patch(payload: { completed?: boolean; savedLater?: boolean }) {
    setLoading(true);
    await fetch("/api/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklistItemId, ...payload }),
    });
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <label className="flex items-center gap-2 text-sm text-qt-text-secondary">
        <input
          type="checkbox"
          checked={completed}
          disabled={loading}
          onChange={async (e) => {
            const v = e.target.checked;
            setCompleted(v);
            await patch({ completed: v });
          }}
        />
        Done
      </label>
      <label className="flex items-center gap-2 text-sm text-qt-text-secondary">
        <input
          type="checkbox"
          checked={savedLater}
          disabled={loading}
          onChange={async (e) => {
            const v = e.target.checked;
            setSavedLater(v);
            await patch({ savedLater: v });
          }}
        />
        Save for later
      </label>
      <Button
        type="button"
        variant="secondary"
        className="text-xs"
        disabled={loading}
        onClick={async () => {
          setCompleted(false);
          setSavedLater(false);
          await patch({ completed: false, savedLater: false });
        }}
      >
        Reset
      </Button>
    </div>
  );
}
