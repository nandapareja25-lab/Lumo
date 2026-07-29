"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  step: number;
  total: number;
};

/** Línea fina, arranca en 5-8% (nunca 0%), nunca dots (50-DISENO-ONBOARDING-PAYWALL.md). */
export function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.max(8, Math.round((step / total) * 100));

  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: "rgba(16,32,74,0.10)" }}>
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
