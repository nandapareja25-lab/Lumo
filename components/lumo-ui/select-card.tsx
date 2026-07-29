"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export type CategoryAccent = "blue" | "pink" | "green" | "purple" | "red" | "cream";

const ACCENT_HEX: Record<CategoryAccent, string> = {
  blue: "#5B9BD5",
  pink: "#F06BA8",
  green: "#6BCB77",
  purple: "#9B87F5",
  red: "#F26B6B",
  cream: "#FFF4D6",
};

/** Tarjeta seleccionable del onboarding — colores exactos de lumo-design-tokens.json
 * (category.blueChild/pinkGirl/greenFamily/purpleFaith/redValues/cream). Imagen/ícono grande
 * arriba, label centrado abajo en pastilla blanca, borde de color al seleccionar. */
export function SelectCard({
  label,
  icon,
  accent = "blue",
  selected,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  accent?: CategoryAccent;
  selected: boolean;
  onClick: () => void;
}) {
  const hex = ACCENT_HEX[accent];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-[24px] border-2 px-3 py-5 text-center"
      style={{
        background: selected ? `${hex}22` : "#FFFFFF",
        borderColor: selected ? hex : "#EFEDE8",
        boxShadow: selected ? "var(--shadow-card)" : "none",
      }}
    >
      {icon && (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
          style={{ background: `${hex}40` }}
        >
          {icon}
        </div>
      )}
      <span className="font-heading text-[15px] font-bold text-foreground text-balance">{label}</span>
    </motion.button>
  );
}
