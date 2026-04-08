"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { q: string; a: string };

export function FaqAccordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="divide-y divide-qt-soft-gray border-t border-qt-soft-gray">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="py-1">
            <button
              type="button"
              data-open={isOpen ? "true" : "false"}
              onClick={() => setOpen(isOpen ? null : i)}
              className="qt-faq-accordion-button flex w-full items-start justify-between gap-6 rounded-lg py-6 text-left transition-[background-color,border-color,opacity] duration-150 ease-out hover:bg-qt-mist/40 hover:opacity-90"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-normal tracking-tight text-qt-text sm:text-xl">
                {item.q}
              </span>
              <span
                className={cn(
                  "qt-faq-accordion-plus mt-0.5 shrink-0 text-lg font-light text-qt-text-muted",
                  !reduceMotion && "transition-transform duration-300 ease-out",
                  isOpen && "rotate-45",
                )}
                aria-hidden
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key={`faq-${i}`}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? {} : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-8 pr-10 text-sm leading-relaxed text-qt-text-secondary">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
