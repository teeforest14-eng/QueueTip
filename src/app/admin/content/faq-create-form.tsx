"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FaqCreateForm({ nextSort }: { nextSort: number }) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, sortOrder: nextSort }),
    });
    setLoading(false);
    setQuestion("");
    setAnswer("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <div>
        <Label htmlFor="q">Question</Label>
        <Input
          id="q"
          className="mt-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="a">Answer</Label>
        <textarea
          id="a"
          className="mt-1 min-h-[100px] w-full rounded-lg border border-qt-soft-gray px-3 py-2 text-sm"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Publish FAQ"}
      </Button>
    </form>
  );
}
