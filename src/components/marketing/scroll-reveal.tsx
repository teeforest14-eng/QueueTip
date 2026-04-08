"use client";

import { Children, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: easing } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.48, ease: easing } },
};

export const softScale: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easing } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ delay: delayMs / 1000 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealStagger({
  children,
  className,
  childClassName,
  staggerMs = 70,
}: {
  children: ReactNode;
  className?: string;
  childClassName?: string;
  staggerMs?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      className={className}
    >
      {Children.map(children, (child, i) => {
        return (
          <motion.div
            variants={fadeUp}
            transition={{ delay: (i * staggerMs) / 1000 }}
            className={childClassName}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
