"use client";

import { motion, AnimatePresence } from "framer-motion";

type StepTransitionProps = {
  stepKey: string;
  children: React.ReactNode;
};

/** Transición de pasos exacta de 50-DISENO-ONBOARDING-PAYWALL.md §A4. */
export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
