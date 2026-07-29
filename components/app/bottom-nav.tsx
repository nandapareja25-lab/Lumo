"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Heart, User } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";

/** Nav de 5 items, mismo layout que la referencia (lumo-design-tokens.json): Inicio, Explorar,
 * Lumo (botón circular elevado en el centro, enlaza a /app/lumo), Favoritos, Perfil. Mi Camino y
 * Diario ya no son tabs — viven como accesos dentro de Perfil (ver app/app/perfil/page.tsx),
 * sin perder ninguna ruta ni funcionalidad, solo cambia el punto de entrada. */
const ITEMS = [
  { href: "/app", label: "Inicio", icon: Home },
  { href: "/app/explorar", label: "Explorar", icon: Compass },
];

const ITEMS_RIGHT = [
  { href: "/app/favoritos", label: "Favoritos", icon: Heart },
  { href: "/app/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  function renderItem({ href, label, icon: Icon }: (typeof ITEMS)[number]) {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[10.5px] font-bold"
        style={{ color: active ? "#F5B800" : "#B9B5AE" }}
      >
        <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-white" style={{ borderTop: "1px solid #EFEDE8" }}>
      <div className="relative mx-auto flex max-w-md items-center px-1 py-2">
        {ITEMS.map(renderItem)}

        <Link
          href="/app/lumo"
          aria-label="Lumo"
          className="relative -mt-7 flex flex-1 flex-col items-center gap-1"
        >
          <motion.div
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -2 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-1"
            style={{ boxShadow: "var(--shadow-mascot)", border: "3px solid #FFF4D6" }}
          >
            <LumoPortrait pose="lumo-frontal" size={44} />
          </motion.div>
          <span className="text-[10.5px] font-bold" style={{ color: pathname === "/app/lumo" ? "#F5B800" : "#B9B5AE" }}>
            Lumo
          </span>
        </Link>

        {ITEMS_RIGHT.map(renderItem)}
      </div>
    </nav>
  );
}
