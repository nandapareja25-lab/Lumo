"use client";

import { motion, useReducedMotion } from "framer-motion";

type SceneBackdropProps = {
  children: React.ReactNode;
  className?: string;
  height?: number;
};

/**
 * `height` en px es opcional — cuando no se pasa (uso como póster/reproductor), la escena
 * llena el 100% del contenedor padre; el padre controla el tamaño con su propio className.
 */

const STARS = [
  { x: 12, y: 14, r: 1.4, delay: 0 },
  { x: 82, y: 10, r: 1.1, delay: 0.6 },
  { x: 92, y: 30, r: 1.6, delay: 1.2 },
  { x: 8, y: 42, r: 1.1, delay: 0.3 },
  { x: 70, y: 8, r: 1.3, delay: 0.9 },
  { x: 30, y: 6, r: 1, delay: 1.5 },
];

/**
 * Fondo compartido de las 6 escenas: cielo nocturno con estrellas que titilan y un glow cálido
 * que respira — Vigilia (BRAND-DNA.md): ink cálido, nunca azul/verde frío. Respeta
 * prefers-reduced-motion.
 */
export function SceneBackdrop({ children, className, height }: SceneBackdropProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden ${height ? "" : "h-full w-full"} ${className ?? ""}`}
      style={{
        ...(height ? { height } : {}),
        background:
          "radial-gradient(ellipse 90% 70% at 50% 30%, #2D2A26 0%, #140D0A 75%)",
      }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#F3ECDF"
            initial={{ opacity: 0.25 }}
            animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 3.2,
              delay: s.delay,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      {children}
    </div>
  );
}
