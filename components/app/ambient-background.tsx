"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const STARS = [
  { x: 8, y: 6, r: 0.5, delay: 0 },
  { x: 22, y: 12, r: 0.35, delay: 0.8 },
  { x: 88, y: 8, r: 0.5, delay: 0.4 },
  { x: 70, y: 15, r: 0.35, delay: 1.4 },
  { x: 45, y: 5, r: 0.4, delay: 1.9 },
  { x: 95, y: 20, r: 0.3, delay: 1.1 },
];

const LEAVES = [
  { x: "12%", size: 14, delay: 0, duration: 9, drift: 18 },
  { x: "78%", size: 10, delay: 2.5, duration: 11, drift: -14 },
  { x: "45%", size: 12, delay: 5, duration: 10, drift: 12 },
  { x: "88%", size: 9, delay: 7.5, duration: 12, drift: -20 },
];

/**
 * Escenario fijo detrás de TODA la app: cielo, colinas, árboles, estrellas, hojas cayendo y luz
 * cálida — reemplaza el fondo plano. Muy sutil para no competir con el contenido. Vive una sola
 * vez en app/layout.tsx (z-0, fixed) mientras el contenido real corre en un contenedor z-10.
 * Las colinas/árboles tienen un parallax leve atado al scroll de la página (capas a distinta
 * velocidad = sensación de profundidad).
 */
export function AmbientBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const hillsY = useTransform(scrollY, [0, 1000], [0, -30]);
  const treesY = useTransform(scrollY, [0, 1000], [0, -55]);
  const sunY = useTransform(scrollY, [0, 1000], [0, 20]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* cielo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #BFE0EC 0%, #D7E9DE 38%, #EAEFDD 68%, #F2EEDF 100%)",
        }}
      />

      {/* sol / luz cálida */}
      <motion.div
        className="absolute -right-16 -top-16 h-80 w-80 rounded-full"
        style={{
          y: reduceMotion ? 0 : sunY,
          background:
            "radial-gradient(circle, rgba(224,164,56,0.35) 0%, rgba(224,164,56,0) 70%)",
        }}
      />

      {/* estrellas */}
      <svg className="absolute inset-x-0 top-0 h-64 w-full" viewBox="0 0 100 30" preserveAspectRatio="xMidYMin slice">
        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#FFFFFF"
            initial={{ opacity: 0.3 }}
            animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4, delay: s.delay, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* hojas cayendo suavemente */}
      {!reduceMotion &&
        LEAVES.map((leaf, i) => (
          <motion.svg
            key={i}
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            className="absolute top-0 opacity-40"
            style={{ left: leaf.x }}
            initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: "115vh",
              x: [0, leaf.drift, 0, -leaf.drift, 0],
              rotate: [0, 25, -15, 25, 0],
              opacity: [0, 0.45, 0.45, 0.45, 0],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <path
              d="M12 2C6 6 4 12 12 22C20 12 18 6 12 2Z"
              fill="#8FB89A"
            />
          </motion.svg>
        ))}

      {/* colinas */}
      <motion.svg
        className="absolute inset-x-0 bottom-0 h-64 w-full"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        style={{ y: reduceMotion ? 0 : hillsY }}
      >
        <path d="M0 100 Q100 60 200 95 T400 80 V160 H0 Z" fill="#BFD9C4" opacity="0.55" />
        <path d="M0 130 Q120 90 220 120 T400 110 V160 H0 Z" fill="#8FB89A" opacity="0.45" />
        <path d="M0 150 Q140 120 260 145 T400 135 V160 H0 Z" fill="#1F3D2E" opacity="0.18" />
      </motion.svg>

      {/* árboles al borde, dejando pasar la luz */}
      <motion.svg
        className="absolute bottom-0 left-0 h-40 w-40 opacity-25"
        viewBox="0 0 100 100"
        style={{ y: reduceMotion ? 0 : treesY }}
      >
        <path d="M50 100 V55" stroke="#1F3D2E" strokeWidth="4" />
        <circle cx="50" cy="40" r="26" fill="#1F3D2E" />
      </motion.svg>
      <motion.svg
        className="absolute bottom-0 right-0 h-32 w-32 opacity-20"
        viewBox="0 0 100 100"
        style={{ y: reduceMotion ? 0 : treesY }}
      >
        <path d="M50 100 V60" stroke="#1F3D2E" strokeWidth="4" />
        <circle cx="50" cy="45" r="22" fill="#1F3D2E" />
      </motion.svg>
    </div>
  );
}
