"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { TrustChipRow } from "@/components/marketing/trust-chip-row";
import { MarketingSecondaryLink } from "@/components/marketing/marketing-buttons";
import { MinimalCTA } from "@/components/marketing/minimal-cta";
import { ProductMockupFrame } from "@/components/marketing/product-mockup-frame";
import { useRef } from "react";

const trustChips = [
  "Official USCIS sources in context",
  "Built for family-based filings",
  "Facts, patterns, and next steps clearly labeled",
] as const;

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -14]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-qt-soft-gray bg-[#FFF6E8]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
      >
        <div className="absolute -left-[20%] top-0 h-[min(520px,70vh)] w-[55%] rounded-full bg-qt-primary-soft/60 blur-3xl" />
        <div className="absolute -right-[15%] bottom-0 h-[min(400px,55vh)] w-[45%] rounded-full bg-[#F6B26B]/25 blur-3xl" />
      </div>
      <div className="qt-marketing-container relative mx-auto max-w-[70rem] px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-34 lg:pt-22">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12 lg:gap-y-0">
          <div className="self-start lg:col-span-5 xl:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-qt-text-muted">
              Family-based immigration guidance
            </p>
            <h1 className="qt-hero-title mt-4 max-w-[30ch] font-display text-[clamp(2.125rem,5vw,3.375rem)] font-bold leading-[1.05] tracking-tight text-qt-text sm:mt-5 lg:max-w-[17ch]">
              See what USCIS says, what usually happens,
              <br className="hidden sm:block" /> and what to do next.
            </h1>
            <p className="qt-hero-lead mt-5 max-w-[56ch] text-[clamp(1rem,2.2vw,1.125rem)] leading-relaxed text-qt-text-secondary sm:mt-6">
              QueueTip helps families prepare filings, track progress, and handle stuck
              points with official USCIS sources, clearly labeled guidance, and practical
              next steps.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9 sm:gap-6">
              <MinimalCTA href="/signup" variant="primary" className="text-base">
                Start free
              </MinimalCTA>
              <MarketingSecondaryLink href="/#how-it-works">
                How it works
              </MarketingSecondaryLink>
            </div>
            <p className="mt-4 text-xs text-qt-text-muted">
              Built for I-130, I-485, I-765, and I-131 workflows.
            </p>
            <TrustChipRow items={trustChips} className="mt-6 sm:mt-8" />
          </div>
          <motion.div
            className="self-start min-w-0 lg:col-span-7 xl:col-span-7 lg:pl-4 xl:pl-6"
            style={{ y: mockupY }}
          >
            <ProductMockupFrame />
            <p className="mt-4 text-center text-[11px] text-qt-text-muted sm:text-left">
              Preview the filing, tracking, and issue views to see how QueueTip keeps your case organized.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
