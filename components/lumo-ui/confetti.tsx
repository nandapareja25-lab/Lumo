"use client";

import { motion } from "framer-motion";

const COLORS = ["#F06BA8", "#F5B800", "#6BCB77", "#9B87F5", "#5B9BD5"];
const SHAPES = ["rect", "spiral"] as const;

/** Confeti de celebración — rectángulos y espirales de colores cayendo, para la pantalla final
 * del onboarding ("¡Todo está listo!", lumo-design-tokens.json / referencia). Puramente
 * decorativo, respeta `prefers-reduced-motion` a través de la regla global en app/globals.css. */
export function Confetti({ count = 24 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    const shape = SHAPES[i % SHAPES.length];
    const left = (i * 37) % 100;
    const delay = (i % 8) * 0.15;
    const duration = 2.6 + (i % 5) * 0.3;
    return { id: i, color, shape, left, delay, duration };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{ left: `${p.left}%` }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.shape === "rect" ? (
            <div className="h-2.5 w-1.5 rounded-sm" style={{ background: p.color }} />
          ) : (
            <div
              className="h-3 w-3 rounded-full border-2"
              style={{ borderColor: p.color, borderRightColor: "transparent", borderBottomColor: "transparent" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
