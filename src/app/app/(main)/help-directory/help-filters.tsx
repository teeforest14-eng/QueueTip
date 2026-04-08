"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HelpDirectoryFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [region, setRegion] = useState(params.get("region") ?? "");
  const [language, setLanguage] = useState(params.get("language") ?? "");
  const [caseType, setCaseType] = useState(params.get("caseType") ?? "");

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (region.trim()) q.set("region", region.trim());
    if (language.trim()) q.set("language", language.trim());
    if (caseType.trim()) q.set("caseType", caseType.trim());
    router.push(`/app/help-directory?${q.toString()}`);
  }

  return (
    <form
      onSubmit={apply}
      className="grid gap-4 rounded-2xl border border-qt-soft-gray bg-qt-bg p-4 md:grid-cols-4"
    >
      <div>
        <Label htmlFor="region">Geography</Label>
        <Input
          id="region"
          className="mt-1"
          placeholder="e.g. California"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="language">Language</Label>
        <Input
          id="language"
          className="mt-1"
          placeholder="e.g. Spanish"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="caseType">Case type</Label>
        <Input
          id="caseType"
          className="mt-1"
          placeholder="e.g. I-485"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit" className="w-full">
          Apply
        </Button>
      </div>
    </form>
  );
}
