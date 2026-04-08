"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Result = {
  id: string;
  name: string;
  type: string;
  serviceArea: string;
  languages: string[];
  caseTypes: string[];
};

const mockResults: Result[] = [
  {
    id: "r1",
    name: "Community Immigration Project",
    type: "Nonprofit",
    serviceArea: "California · Bay Area",
    languages: ["English", "Spanish"],
    caseTypes: ["I-485", "I-130"],
  },
  {
    id: "r2",
    name: "Accredited Representative Desk",
    type: "Accredited Rep",
    serviceArea: "New York · Queens",
    languages: ["English", "Kinyarwanda"],
    caseTypes: ["I-765", "I-485"],
  },
  {
    id: "r3",
    name: "Legal Aid & Family Filings",
    type: "Attorney",
    serviceArea: "Texas · Houston",
    languages: ["English", "Vietnamese"],
    caseTypes: ["I-130", "I-693"],
  },
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function filterResults(region: string, language: string, caseType: string) {
  const r = normalize(region);
  const l = normalize(language);
  const c = normalize(caseType);

  return mockResults.filter((x) => {
    if (r) {
      const hay = normalize(x.serviceArea);
      if (!hay.includes(r)) return false;
    }
    if (l) {
      const hay = normalize(x.languages.join(", "));
      if (!hay.includes(l)) return false;
    }
    if (c) {
      const hay = normalize(x.caseTypes.join(", "));
      if (!hay.includes(c)) return false;
    }
    return true;
  });
}

export function SupportDirectoryPreview() {
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [caseType, setCaseType] = useState("");

  const debouncedRegion = useDebouncedValue(region, 300);
  const debouncedLanguage = useDebouncedValue(language, 300);
  const debouncedCaseType = useDebouncedValue(caseType, 300);

  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterResults(debouncedRegion, debouncedLanguage, debouncedCaseType),
    [debouncedCaseType, debouncedLanguage, debouncedRegion],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    document.getElementById("qt-directory-results")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-qt-soft-gray bg-white p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-qt-text-muted">
            Searchable help directory
          </p>
          <Button
            type="button"
            variant="ghost"
            className="px-3 py-2 text-xs"
            onClick={() => setActiveId(null)}
          >
            Reset hover
          </Button>
        </div>

        <form
          className="qt-directory-form mt-5 grid gap-3.5 md:grid-cols-3 md:gap-4"
          onSubmit={handleSearch}
          role="search"
          aria-label="Find qualified help"
        >
          <div className="min-w-0">
            <Label htmlFor="qt-region">Geography</Label>
            <Input
              id="qt-region"
              name="geo"
              value={region}
              placeholder="e.g. California"
              aria-label="Search by geography"
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="qt-language">Language</Label>
            <Input
              id="qt-language"
              name="language"
              value={language}
              placeholder="e.g. Spanish"
              aria-label="Search by language"
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="qt-caseType">Case type</Label>
            <Input
              id="qt-caseType"
              name="caseType"
              value={caseType}
              placeholder="e.g. I-485"
              aria-label="Search by case type"
              onChange={(e) => setCaseType(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">
              Find help
            </Button>
          </div>
        </form>

        <div className="mt-5" id="qt-directory-results">
          <p className="text-xs text-qt-text-muted">
            Filter by location, language, and case type — results update as you type, or tap Find help.
          </p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-qt-text-secondary">Results</p>
            <p className="text-xs text-qt-text-muted">
              {filtered.length} match{filtered.length === 1 ? "" : "es"}
            </p>
          </div>

          <div className="mt-4 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {filtered.map((x) => {
              const isActive = activeId === x.id;
              return (
                <div
                  key={x.id}
                  className="relative"
                  onMouseEnter={() => setActiveId(x.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <motion.div
                    layout
                    className="rounded-2xl"
                    initial={false}
                    animate={{
                      scale: isActive ? 1.01 : 1,
                      opacity: isActive ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card
                      className={cn(
                        "p-4 shadow-none",
                        isActive && "border-qt-slate/30",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-[15px]">{x.name}</CardTitle>
                          <p className="mt-1 text-[11px] uppercase tracking-wide text-qt-text-muted">
                            {x.type}
                          </p>
                        </div>
                        <span className="hidden rounded-md border border-qt-soft-gray bg-white px-2 py-1 text-[10px] font-semibold text-qt-slate sm:block">
                          {x.caseTypes[0]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-qt-text-secondary">{x.serviceArea}</p>
                      <p className="mt-2 text-xs text-qt-text-muted">
                        Languages: {x.languages.join(", ")}
                      </p>
                    </Card>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.div
                        aria-hidden
                        layoutId="qt-directory-hover-ring"
                        className="pointer-events-none absolute inset-0 rounded-2xl border border-qt-slate/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-qt-soft-gray bg-qt-bg p-4 text-sm text-qt-text-secondary">
              No matches with these filters. Try a broader region or a different case type.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
