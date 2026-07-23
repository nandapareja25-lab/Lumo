"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneBackdrop } from "./scene-backdrop";
import { GlowOrb } from "./glow-orb";

/** Un umbral cálido abierto — Lumo invitando a entrar. */
export function RegistroScene() {
  const reduceMotion = useReducedMotion();

  return (
    <SceneBackdrop>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* umbral / puerta */}
        <path d="M40 60 L40 24 Q50 14 60 24 L60 60 Z" fill="#140D0A" />
        <path d="M43 60 L43 25 Q50 18 57 25 L57 60 Z" fill="#F0A94E" opacity="0.18" />

        <GlowOrb cx={50} cy={38} r={20} duration={3} />

        {/* Lumo en el umbral, invitando */}
        <motion.g
          animate={reduceMotion ? {} : { y: [0, -2, 0] }}
          transition={{ duration: 2.6, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="50" cy="52" rx="8" ry="7" fill="#F2BB4E" />
          <circle cx="50" cy="43" r="6.5" fill="#F2BB4E" />
          <circle cx="50" cy="53" r="2.8" fill="#FFE066" />
        </motion.g>
      </svg>
    </SceneBackdrop>
  );
}
