"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, HandHeart, Heart, Music2 } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";

const FLOATING_ICONS = [
  { Icon: BookOpen, color: "#5B9BD5", top: "8%", left: "4%", delay: 0 },
  { Icon: HandHeart, color: "#9B87F5", top: "12%", right: "2%", delay: 0.3 },
  { Icon: Heart, color: "#F26B6B", bottom: "14%", left: "0%", delay: 0.6 },
  { Icon: Music2, color: "#6BCB77", bottom: "8%", right: "6%", delay: 0.9 },
] as const;

/** Loading personalizado del sistema "Estrella" — Lumo flotando en el centro con un anillo suave,
 * mensajes rotativos, barra de progreso con porcentaje, e íconos chicos flotando alrededor
 * (lumo-design-tokens.json / referencia de onboarding "preparando tu experiencia"). Reutilizable
 * en cualquier pantalla de espera. */
export function LoadingLumo({
  messages = ["Preparando tu experiencia…"],
  progress,
  progressLabel,
}: {
  messages?: string[];
  progress?: number;
  progressLabel?: string;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 1400);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="relative flex flex-col items-center gap-6 text-center">
      <div className="relative flex h-44 w-44 items-center justify-center">
        {FLOATING_ICONS.map(({ Icon, color, delay, ...pos }, i) => (
          <motion.div
            key={i}
            className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-white"
            style={{ ...pos, boxShadow: "var(--shadow-card)" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </motion.div>
        ))}

        <motion.div
          className="absolute inset-4 rounded-full"
          style={{ border: "3px solid rgba(246,201,69,0.3)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-7 rounded-full"
          style={{ border: "3px solid rgba(91,155,213,0.3)" }}
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <LumoPortrait pose="lumo-feliz" size={92} />
        </motion.div>
      </div>

      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[24ch] font-heading text-[17px] font-bold text-foreground"
      >
        {messages[messageIndex]}
      </motion.p>

      {progress != null && (
        <div className="w-56">
          {progressLabel && (
            <div className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-muted-foreground">
              <span>{progressLabel}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          )}
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(16,32,74,0.08)]">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
