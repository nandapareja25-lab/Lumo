"use client";

import { motion } from "framer-motion";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";

export type CategoryAccent = "blue" | "pink" | "green" | "purple" | "red" | "cream";

const ACCENT_HEX: Record<CategoryAccent, string> = {
  blue: "#5B9BD5",
  pink: "#F06BA8",
  green: "#6BCB77",
  purple: "#9B87F5",
  red: "#F26B6B",
  cream: "#FFF4D6",
};

/** Tarjeta de selección con imagen 1:1 arriba y label en pastilla blanca abajo — usada en "¿Para
 * quién será Lumo?" y "¿Qué edad tiene?" (lumo-design-tokens.json `selectionCard`). Distinta de
 * `SelectCard` (que usa un ícono chico + fondo pastel, para "¿Qué desean fortalecer?"). */
export function ImageSelectCard({
  label,
  imageSlug,
  accent,
  selected,
  onClick,
}: {
  label: string;
  imageSlug: string;
  accent: CategoryAccent;
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
      className="flex flex-1 flex-col gap-2 rounded-[24px] border-2 p-1.5"
      style={{
        borderColor: selected ? hex : "transparent",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[18px]" style={{ background: `${hex}22` }}>
        <ArtAsset slug={imageSlug} alt={label} fallback={<MoodScene mood="family" />} className="absolute inset-0" />
      </div>
      <span
        className="rounded-full bg-white px-2 py-1.5 text-center text-[13px] font-bold text-foreground"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {label}
      </span>
    </motion.button>
  );
}
