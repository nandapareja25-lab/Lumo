"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneBackdrop } from "./scene-backdrop";
import { GlowOrb } from "./glow-orb";

/** Una ventana con luna y estrellas afuera, Lumo en el borde acompañando la hora de dormir. */
export function RutinaScene() {
  const reduceMotion = useReducedMotion();

  return (
    <SceneBackdrop>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* marco de ventana */}
        <rect x="30" y="10" width="40" height="36" rx="4" fill="#140D0A" />
        <rect x="34" y="14" width="32" height="28" rx="2" fill="#2D2A26" />
        <rect x="49" y="14" width="1.4" height="28" fill="#140D0A" />
        <rect x="34" y="27" width="32" height="1.4" fill="#140D0A" />

        {/* luna dentro de la ventana */}
        <circle cx="57" cy="22" r="6" fill="#F3ECDF" opacity="0.9" />

        {/* Lumo en el borde de la ventana */}
        <motion.g
          animate={reduceMotion ? {} : { y: [0, -1.6, 0] }}
          transition={{ duration: 3.4, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="38" cy="50" rx="7" ry="6" fill="#F2BB4E" />
          <circle cx="38" cy="42" r="6" fill="#F2BB4E" />
        </motion.g>
        <GlowOrb cx={38} cy={51} r={5} duration={2.6} />
      </svg>
    </SceneBackdrop>
  );
}
