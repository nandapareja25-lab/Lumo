"use client";

import { ComponentProps, ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type LumoButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> & {
  variant?: "primary" | "secondary" | "ghost";
  /** El CTA principal siempre lleva flecha "→" a la derecha (lumo-design-tokens.json). Poner en
   * false solo para botones secundarios/terciarios que no representan un "avanzar". */
  showArrow?: boolean;
  children?: ReactNode;
};

/** Botón base del sistema de diseño "Estrella" — valores exactos de lumo-design-tokens.json:
 * gradiente #F7C948→#F5A300, radio pill, sombra `shadow-button`, flecha derecha en el CTA
 * principal. "secondary"/"ghost" para acciones de apoyo, sin gradiente ni flecha por defecto. */
export function LumoButton({
  variant = "primary",
  showArrow,
  className = "",
  disabled,
  children,
  ...props
}: LumoButtonProps) {
  const base = "flex h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition-transform disabled:opacity-40";
  const variants = {
    primary: "text-[#2D2A26]",
    secondary: "bg-secondary text-foreground border border-[rgba(0,0,0,0.06)]",
    ghost: "bg-transparent text-foreground border border-[rgba(0,0,0,0.08)]",
  };
  const arrow = showArrow ?? variant === "primary";

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={
        variant === "primary"
          ? { background: "linear-gradient(180deg, #F7C948 0%, #F5A300 100%)", boxShadow: "var(--shadow-button)" }
          : undefined
      }
      {...props}
    >
      {children}
      {arrow && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
    </motion.button>
  );
}
