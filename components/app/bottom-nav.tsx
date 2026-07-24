"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Sparkles, NotebookPen, User } from "lucide-react";

const ITEMS = [
  { href: "/app", label: "Inicio", icon: Home },
  { href: "/app/explorar", label: "Explorar", icon: Compass },
  { href: "/app/mi-camino", label: "Mi camino", icon: Sparkles },
  { href: "/app/diario", label: "Diario", icon: NotebookPen },
  { href: "/app/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40"
      style={{
        borderTop: "1px solid rgba(242,236,223,0.1)",
        background: "#132018",
      }}
    >
      <div className="mx-auto flex max-w-md justify-around px-1 py-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[9.5px] font-semibold"
              style={{ color: active ? "#FFD740" : "rgba(242,236,223,0.5)" }}
            >
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.8} />
              </span>
              <span className="relative">{label}</span>
              {active && (
                <motion.span
                  layoutId="bottom-nav-dot"
                  className="absolute -top-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full"
                  style={{ background: "#FFD740", boxShadow: "0 0 6px 1px rgba(255,215,64,0.6)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
