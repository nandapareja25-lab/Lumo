"use client";

import { motion, useReducedMotion } from "framer-motion";

type GlowOrbProps = {
  cx: number;
  cy: number;
  r: number;
  color?: string;
  duration?: number;
};

/** El glow cálido que "respira" — reutilizado por Lumo y por todas las escenas. */
export function GlowOrb({ cx, cy, r, color = "#F0A94E", duration = 2.4 }: GlowOrbProps) {
  const reduceMotion = useReducedMotion();
  const id = `glow-${cx}-${cy}`;

  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#${id})`}
        initial={{ opacity: 0.7 }}
        animate={reduceMotion ? { opacity: 0.85 } : { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
        transition={{ duration, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    </>
  );
}
