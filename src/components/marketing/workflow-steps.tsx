"use client";

import { ScrollRevealStagger } from "@/components/marketing/scroll-reveal";

const steps = [
  {
    n: "01",
    title: "Create your account",
    body: "Set up one place to keep your case progress, saved work, and reminders.",
  },
  {
    n: "02",
    title: "Answer a short intake",
    body: "A short intake routes you into Prepare, Track, Resolve, or Explore based on where your case stands now.",
  },
  {
    n: "03",
    title: "Work inside your path",
    body: "Work through checklists, timelines, or issue guides with official facts clearly separated from QueueTip guidance.",
  },
  {
    n: "04",
    title: "Stay oriented",
    body: "Alerts, USCIS tool shortcuts, and saved progress help you stop starting over every time you check your case.",
  },
] as const;

export function WorkflowSteps() {
  return (
    <ScrollRevealStagger
      className="grid gap-12 md:grid-cols-2 lg:gap-10 xl:grid-cols-4 xl:gap-12"
      staggerMs={85}
    >
      {steps.map((s) => (
        <div key={s.n} className="relative">
          <span className="font-display text-4xl font-light tabular-nums text-white">
            {s.n}
          </span>
          <h3 className="mt-4 text-base font-semibold tracking-tight text-qt-text">
            {s.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-qt-text-secondary">{s.body}</p>
        </div>
      ))}
    </ScrollRevealStagger>
  );
}
