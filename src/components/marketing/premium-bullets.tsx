"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./scroll-reveal";

export function PremiumBullets() {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="mt-4 space-y-3 text-sm text-qt-text-secondary"
    >
      <motion.li variants={fadeUp} className="border-b border-qt-soft-gray pb-3">
              More complete timeline history
      </motion.li>
      <motion.li variants={fadeUp} className="border-b border-qt-soft-gray pb-3">
              More guidance for delays and stuck points
      </motion.li>
            <motion.li variants={fadeUp}>More reminders and follow-up prompts</motion.li>
    </motion.ul>
  );
}

