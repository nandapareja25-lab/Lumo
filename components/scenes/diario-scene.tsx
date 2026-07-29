"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneBackdrop } from "./scene-backdrop";
import { GlowOrb } from "./glow-orb";

/** Un diario abierto con una pluma que brilla mientras escribe. */
export function DiarioScene() {
  const reduceMotion = useReducedMotion();

  return (
    <SceneBackdrop>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
      >
        <GlowOrb cx={54} cy={34} r={18} duration={3.2} />

        {/* diario */}
        <rect x="32" y="30" width="36" height="24" rx="3" fill="#2D2A26" />
        <rect x="49" y="30" width="1.4" height="24" fill="#140D0A" />
        <rect x="37" y="36" width="12" height="1.4" rx="0.7" fill="#5A564F" />
        <rect x="37" y="40" width="9" height="1.4" rx="0.7" fill="#5A564F" />

        {/* pluma con brillo en la punta */}
        <motion.g
          animate={reduceMotion ? {} : { rotate: [0, 3, 0] }}
          style={{ transformOrigin: "58px 40px" }}
          transition={{ duration: 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <path d="M58 40 L66 24" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="66" cy="24" r="2.4" fill="#FFE066" />
        </motion.g>
      </svg>
    </SceneBackdrop>
  );
}
