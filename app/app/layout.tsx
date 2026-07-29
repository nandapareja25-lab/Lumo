import { BottomNav } from "@/components/app/bottom-nav";

/**
 * Marco de la app (rebrand "Estrella" v2, 2026-07-28) — fondo blanco cálido de `app/globals.css`,
 * el bottom nav vive fijo abajo, blanco, con el botón circular de Lumo elevado en el centro.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex-1 pb-24">{children}</div>
      <BottomNav />
    </div>
  );
}
