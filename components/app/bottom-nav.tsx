"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      className="fixed inset-x-0 bottom-0 z-40 backdrop-blur"
      style={{
        borderTop: "1px solid rgba(42,31,23,0.10)",
        background: "rgba(250,243,238,0.95)",
      }}
    >
      <div className="mx-auto flex max-w-md justify-around px-1 py-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 text-[9.5px] font-semibold"
              style={{ color: active ? "#B8791F" : "#8A7A63" }}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
