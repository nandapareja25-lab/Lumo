"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SceneBackdrop } from "./scene-backdrop";
import { GlowOrb } from "./glow-orb";

/** Manos unidas en oración con pequeñas partículas de luz subiendo — Lumo posado cerca. */
export function OracionScene() {
  const reduceMotion = useReducedMotion();
  const particles = [
    { x: 46, y: 32, delay: 0 },
    { x: 52, y: 28, delay: 0.6 },
    { x: 49, y: 24, delay: 1.2 },
  ];

  return (
    <SceneBackdrop>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
      >
        <GlowOrb cx={49} cy={40} r={16} duration={3} />

        {/* manos unidas (forma abstracta) */}
        <path d="M40 46 Q49 30 58 46 Z" fill="#2A1F17" />
        <path d="M43 46 Q49 36 55 46 Z" fill="#3A2A1E" />

        {particles.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={1.1}
            fill="#F0A94E"
            initial={{ opacity: 0, y: 0 }}
            animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0, 1, 0], y: -10 }}
            transition={{
              duration: 2.6,
              delay: p.delay,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Lumo posado a un costado */}
        <circle cx="74" cy="46" r="6.5" fill="#F2BB4E" />
        <circle cx="74" cy="49" r="2.6" fill="#FFE066" opacity="0.9" />
      </svg>
    </SceneBackdrop>
  );
}
