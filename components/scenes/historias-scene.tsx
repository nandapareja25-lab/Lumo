"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneBackdrop } from "./scene-backdrop";
import { GlowOrb } from "./glow-orb";

/** Un libro abierto del que sale la luz de la historia — Lumo asomado detrás. */
export function HistoriasScene() {
  const reduceMotion = useReducedMotion();

  return (
    <SceneBackdrop>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
      >
        <GlowOrb cx={50} cy={30} r={20} duration={2.8} />

        {/* libro abierto */}
        <motion.g
          animate={reduceMotion ? {} : { rotate: [0, 0.6, 0] }}
          style={{ transformOrigin: "50px 42px" }}
          transition={{ duration: 4, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <path d="M50 30 L28 36 L28 46 L50 40 Z" fill="#2A1F17" />
          <path d="M50 30 L72 36 L72 46 L50 40 Z" fill="#3A2A1E" />
        </motion.g>

        {/* Lumo asomado detrás del libro */}
        <circle cx="60" cy="24" r="6" fill="#F2BB4E" />
        <circle cx="60" cy="27" r="2.4" fill="#FFE066" opacity="0.9" />
      </svg>
    </SceneBackdrop>
  );
}
