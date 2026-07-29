"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneBackdrop } from "./scene-backdrop";
import { GlowOrb } from "./glow-orb";

/** Mamá e hijo sentados junto a Lumo, escuchando la historia de la noche. */
export function HeroScene() {
  const reduceMotion = useReducedMotion();

  return (
    <SceneBackdrop>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMax slice"
      >
        <GlowOrb cx={50} cy={30} r={22} duration={3.4} />

        {/* silueta mamá */}
        <ellipse cx="35" cy="50" rx="11" ry="14" fill="#2D2A26" />
        <circle cx="35" cy="33" r="6.5" fill="#2D2A26" />

        {/* silueta hija */}
        <ellipse cx="52" cy="53" rx="8" ry="10" fill="#3A2A1E" />
        <circle cx="52" cy="41" r="5" fill="#3A2A1E" />

        {/* Lumo, sentado junto a ellas */}
        <motion.g
          animate={reduceMotion ? {} : { y: [0, -1.4, 0] }}
          transition={{ duration: 3, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="68" cy="52" rx="9" ry="8" fill="#F2BB4E" />
          <circle cx="68" cy="42" r="7.5" fill="#F2BB4E" />
          <circle cx="68" cy="53" r="3.2" fill="#FFE066" opacity="0.9" />
        </motion.g>
      </svg>
    </SceneBackdrop>
  );
}
