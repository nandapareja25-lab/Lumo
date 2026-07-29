"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { LumoButton } from "@/components/lumo-ui/button";

/** Pantalla de saludo de Lumo — el botón circular central del bottom nav enlaza acá (misma idea
 * que la última tarjeta de la hoja de referencia: "¡Hola! Soy Lumo" + estrella grande + CTA
 * "¡Vamos juntos!"). No es una sección con contenido propio, es un saludo + invitación a Explorar. */
export default function LumoGreetingPage() {
  const router = useRouter();

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center text-white"
      style={{ background: "var(--night-gradient)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="relative z-10"
      >
        <LumoPortrait pose="lumo-feliz" size={150} />
      </motion.div>

      <div className="relative z-10">
        <p className="font-heading text-2xl font-bold">¡Hola!</p>
        <p className="mt-1 font-heading text-4xl font-extrabold" style={{ color: "#F5B800" }}>
          Soy Lumo
        </p>
        <p className="mx-auto mt-3 max-w-xs text-[15px] text-white/70">
          Estoy aquí para acompañarte en cada aventura bíblica.
        </p>
      </div>

      <LumoButton className="relative z-10 w-full max-w-xs" onClick={() => router.push("/app/explorar")}>
        ¡Vamos juntos!
      </LumoButton>
    </main>
  );
}
