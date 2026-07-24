import { BottomNav } from "@/components/app/bottom-nav";

/**
 * "Marco oscuro" (APP-REDISENO-INSTRUCCIONES.md §2, 2026-07-24): cada pantalla pinta su propio
 * header en --forest (para poder variar el título por pantalla), y el bottom nav vive acá fijo,
 * también --forest — el contenido scrolleable entre ambos queda en --cream. bg-[#132018] es el
 * mismo forest de la landing (CLAUDE.md no lo redefine, es una decisión de este rediseño).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#132018]">
      <div className="flex-1 bg-[#FBF5EC] pb-24">{children}</div>
      <BottomNav />
    </div>
  );
}
