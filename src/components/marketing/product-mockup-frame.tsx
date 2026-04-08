"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { LabelChipRow, type LabelVariant } from "./label-chips";

type Mode = "overview" | "prepare" | "track" | "resolve";

const modes: { id: Mode; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "prepare", label: "Prepare" },
  { id: "track", label: "Track" },
  { id: "resolve", label: "Resolve" },
];

const checklistInitial = [
  {
    id: "a",
    label: "I-485 edition verified",
    whyMatters: "Form editions and field instructions can change before filing.",
    done: true,
    savedLater: false,
  },
  {
    id: "b",
    label: "I-693 civil surgeon policy",
    whyMatters: "Accredited timing and guidance reduce rework when schedules shift.",
    done: false,
    savedLater: true,
  },
  {
    id: "c",
    label: "Financial evidence packet",
    whyMatters: "A structured packet helps avoid avoidable omissions.",
    done: false,
    savedLater: false,
  },
  {
    id: "d",
    label: "Birth certificate translations",
    whyMatters: "Translations are a common friction point—clarify requirements early.",
    done: false,
    savedLater: false,
  },
];

const timelineSteps = [
  { title: "Receipt accepted", sub: "USCIS · Mar 12", label: "official" as const },
  {
    title: "Biometrics scheduled",
    sub: "Often the next milestone after receipt acceptance",
    label: "typical" as const,
  },
  { title: "Case under review", sub: "Pattern-based note", label: "typical" as const },
  {
    title: "Suggested next check: bring your appointment notice and photo ID",
    sub: "Next step",
    label: "next" as const,
  },
];

const labelCycle: LabelVariant[] = ["official", "typical", "next"];

const PANEL_ID = "qt-demo-tabpanel";
const tabTransition = { duration: 0.16, ease: [0, 0, 0.2, 1] as const };

export function ProductMockupFrame() {
  const [mode, setMode] = useState<Mode>("overview");
  const [checklist, setChecklist] = useState(checklistInitial);
  const [timelineIdx, setTimelineIdx] = useState(0);
  const [issueOpen, setIssueOpen] = useState(false);
  const [labelIdx, setLabelIdx] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pauseAuto, setPauseAuto] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || pauseAuto) return;
    const t = window.setInterval(() => {
      setMode((m) => {
        const i = modes.findIndex((x) => x.id === m);
        return modes[(i + 1) % modes.length].id;
      });
    }, 5500);
    return () => clearInterval(t);
  }, [pauseAuto, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || pauseAuto) return;
    const t = window.setInterval(() => {
      setTimelineIdx((i) => (i + 1) % timelineSteps.length);
    }, 2800);
    return () => clearInterval(t);
  }, [pauseAuto, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || pauseAuto) return;
    const t = window.setInterval(() => {
      setLabelIdx((i) => (i + 1) % labelCycle.length);
    }, 2200);
    return () => clearInterval(t);
  }, [pauseAuto, reduceMotion]);

  const toggleItem = useCallback((id: string) => {
    setChecklist((rows) => rows.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  }, []);

  const toggleSavedLater = useCallback((id: string) => {
    setChecklist((rows) =>
      rows.map((r) => (r.id === id ? { ...r, savedLater: !r.savedLater } : r)),
    );
  }, []);

  const activeLabel = useMemo(() => labelCycle[labelIdx], [labelIdx]);
  const modeIndex = modes.findIndex((m) => m.id === mode);
  const tabRefs = useRef<Record<Mode, HTMLButtonElement | null>>({
    overview: null,
    prepare: null,
    track: null,
    resolve: null,
  });

  const focusTab = useCallback((id: Mode) => {
    tabRefs.current[id]?.focus();
  }, []);

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent, idx: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (idx + dir + modes.length) % modes.length;
        const nextId = modes[next]!.id;
        setMode(nextId);
        setPauseAuto(true);
        focusTab(nextId);
      }
      if (e.key === "Home") {
        e.preventDefault();
        setMode(modes[0]!.id);
        setPauseAuto(true);
        focusTab(modes[0]!.id);
      }
      if (e.key === "End") {
        e.preventDefault();
        const last = modes[modes.length - 1]!.id;
        setMode(last);
        setPauseAuto(true);
        focusTab(last);
      }
    },
    [focusTab],
  );

  return (
    <motion.div
      className={cn(
        "qt-mockup-enter overflow-hidden rounded-2xl border border-qt-soft-gray bg-white shadow-[0_24px_80px_-32px_rgba(17,17,17,0.12)]",
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      onHoverStart={() => setPauseAuto(true)}
      onHoverEnd={() => setPauseAuto(false)}
    >
      <div className="flex items-center gap-2 border-b border-qt-soft-gray bg-qt-mist/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-qt-soft-gray" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-qt-primary-soft" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#A9D6FF]/80" aria-hidden />
        <span className="ml-2 text-[11px] font-medium tracking-tight text-qt-text-muted">
          See how QueueTip works
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <LayoutGroup>
          <div
            role="tablist"
            aria-label="How QueueTip works"
            className="qt-mockup-tablist flex flex-wrap gap-2 rounded-full border border-qt-soft-gray bg-qt-mist/60 p-1"
          >
            {modes.map(({ id, label }, idx) => (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[id] = el;
                }}
                id={`qt-demo-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={mode === id}
                aria-controls={PANEL_ID}
                tabIndex={mode === id ? 0 : -1}
                onClick={() => {
                  setMode(id);
                  setPauseAuto(true);
                }}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
                className={cn(
                  "qt-mockup-tab relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-colors duration-200",
                  mode === id ? "text-qt-text" : "text-qt-text-secondary",
                )}
              >
                {mode === id ? (
                  <motion.span
                    layoutId="qt-demo-tab-active"
                    className="pointer-events-none absolute inset-0 rounded-full bg-white shadow-[0_2px_12px_-4px_rgba(17,17,17,0.22)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                ) : null}
                <span className="qt-mockup-tab-label pointer-events-none relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="mt-2 h-1.5 rounded-full bg-qt-soft-gray/70">
          <motion.div
            className="h-full rounded-full bg-qt-slate/75"
            animate={{ width: `${((modeIndex + 1) / modes.length) * 100}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-qt-text-secondary">
          One update. Three clear layers: the official record, what usually happens next, and the
          next check that matters.
        </p>
        {/* Fixed min-height so tab switches don’t resize the card and shift the hero copy column. */}
        <section
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={`qt-demo-tab-${mode}`}
          className="mt-4 min-h-[32rem] sm:min-h-[38rem]"
        >
          <AnimatePresence mode="wait">
            {mode === "overview" ? (
              <motion.div
                key="overview"
                className="qt-mockup-panel"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
                transition={reduceMotion ? { duration: 0 } : tabTransition}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                  Your case overview
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-qt-soft-gray bg-white p-3">
                    <p className="text-xs font-semibold text-qt-text">Current path</p>
                    <p className="mt-1 text-sm text-qt-text-secondary">Track · Active case group</p>
                  </div>
                  <div className="rounded-lg border border-qt-soft-gray bg-white p-3">
                    <p className="text-xs font-semibold text-qt-text">Alerts</p>
                    <p className="mt-1 text-sm text-qt-text-secondary">2 new · biometrics + status sync</p>
                  </div>
                  <div className="rounded-lg border border-qt-soft-gray bg-white p-3 sm:col-span-2">
                    <p className="text-xs font-semibold text-qt-text">Recommended next step</p>
                    <p className="mt-1 text-sm text-qt-text-secondary">
                      Save your receipt, check the posted range, and review next steps if your case is outside expected movement.
                    </p>
                  </div>
                  <div className="rounded-lg border border-qt-soft-gray bg-qt-bg p-3 sm:col-span-2">
                    <p className="text-xs font-semibold text-qt-text">Do we need to act now?</p>
                    <p className="mt-1 text-sm text-qt-text-secondary">
                      Not yet for this example. Keep monitoring for movement and follow up if timing stays outside the posted range.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {mode === "prepare" ? (
              <motion.div
                key="prepare"
                className="qt-mockup-panel"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
                transition={reduceMotion ? { duration: 0 } : tabTransition}
              >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                  Supporting documents checklist
              </p>
                <ul className="mt-3 space-y-3">
                  {checklist.map((row) => (
                    <li
                      key={row.id}
                      className="rounded-lg border border-qt-soft-gray bg-white p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "font-medium text-qt-text",
                              row.done && "text-qt-text-muted line-through",
                            )}
                          >
                            {row.label}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-qt-text-secondary">
                            <span className="font-semibold text-qt-text">
                              Why this matters:{" "}
                            </span>
                            {row.whyMatters}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:items-end">
                          <label className="flex items-center gap-2 text-xs text-qt-text-secondary">
                            <input
                              type="checkbox"
                              checked={row.done}
                              onChange={() => toggleItem(row.id)}
                            />
                            Done
                          </label>
                          <label className="flex items-center gap-2 text-xs text-qt-text-secondary">
                            <input
                              type="checkbox"
                              checked={row.savedLater}
                              onChange={() => toggleSavedLater(row.id)}
                            />
                            Save for later
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() => setChecklist(checklistInitial)}
                  >
                    Reset checklist preview
                  </Button>
                </div>
              </motion.div>
            ) : null}

            {mode === "track" ? (
              <motion.div
                key="track"
                className="qt-mockup-panel"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
                transition={reduceMotion ? { duration: 0 } : tabTransition}
              >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                Case timeline
              </p>
              <div className="relative mt-4 pl-1">
                <div
                  className="absolute bottom-0 left-[7px] top-1 w-px bg-qt-soft-gray"
                  aria-hidden
                />
                <ul className="space-y-0">
                  {timelineSteps.map((step, i) => {
                    const active = i === timelineIdx;
                    return (
                      <li key={step.title} className="relative flex gap-3 pb-4 last:pb-0">
                        <motion.span
                          className={cn(
                            "relative z-[1] mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-all duration-500",
                            active
                              ? "scale-110 border-qt-slate bg-white shadow-[0_0_0_4px_rgba(111,143,175,0.2)]"
                              : "border-qt-soft-gray bg-white",
                          )}
                          animate={active ? { scale: 1.08 } : { scale: 1 }}
                          aria-hidden
                        />
                        <motion.div
                          className={cn(
                            "min-w-0 flex-1 rounded-lg border px-3 py-2 transition-all duration-300",
                            active
                              ? "border-qt-slate/35 bg-qt-mist/80"
                              : "border-transparent bg-transparent",
                          )}
                          animate={active ? { opacity: 1 } : { opacity: 0.8 }}
                        >
                          <p className="text-sm font-medium text-qt-text">{step.title}</p>
                          <p className="mt-0.5 text-[11px] text-qt-text-muted">{step.sub}</p>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 rounded-lg border border-qt-soft-gray bg-qt-bg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-qt-text-muted">
                    Snapshot note
                  </p>
                  <p className="mt-1 text-xs text-qt-text-secondary">
                    The official update stays separate from QueueTip guidance, so you can see what
                    changed and what to check next.
                  </p>
                </div>
              </div>
              </motion.div>
            ) : null}

            {mode === "resolve" ? (
              <motion.div
                key="resolve"
                className="qt-mockup-panel"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
                transition={reduceMotion ? { duration: 0 } : tabTransition}
              >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
                Issue resolution
              </p>
              <div className="mt-3 rounded-xl border border-qt-soft-gray bg-qt-mist/30">
                <button
                  type="button"
                  data-open={issueOpen ? "true" : "false"}
                  onClick={() => setIssueOpen((o) => !o)}
                  className="qt-mockup-accordion-button flex w-full items-start justify-between gap-3 rounded-lg px-3 py-3 text-left transition-[background-color,border-color] duration-150 ease-out hover:bg-qt-mist/60"
                  aria-expanded={issueOpen}
                >
                  <div className="pointer-events-none min-w-0">
                    <p className="text-sm font-semibold text-qt-text">Long silence after RFE response</p>
                    <p className="mt-1 text-xs text-qt-text-secondary">
                      Wait vs. act — structured guidance
                    </p>
                  </div>
                  <span
                    className={cn(
                      "qt-mockup-accordion-plus mt-0.5 shrink-0 text-lg font-light text-qt-text-muted transition-transform duration-300 ease-out",
                      issueOpen && "rotate-45",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {issueOpen ? (
                    <motion.div
                      key="issue-open"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 border-t border-qt-soft-gray px-3 pb-3 pt-2 text-xs leading-relaxed text-qt-text-secondary">
                        <p>
                          Compare posted processing ranges to your receipt date. If inside range,
                          waiting is often expected—USCIS links stay one tap away.
                        </p>
                        <p className="text-qt-text-muted">
                          Labels distinguish official posted data from typical patterns and suggested
                          next checks.
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        <div className="mt-4 border-t border-qt-soft-gray pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-qt-text-muted">
            Label system
          </p>
          <div className="mt-2">
            <motion.div
              key={activeLabel}
              initial={{ opacity: 0.65, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26 }}
            >
              <LabelChipRow activeVariant={activeLabel} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
