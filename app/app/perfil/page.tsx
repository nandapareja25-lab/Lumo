"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotebookPen, Sparkles, ChevronRight, Settings, Star, Crown, Heart } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { PushSettings } from "@/components/app/push-settings";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { STORIES, CUENTOS } from "@/lib/story-catalog";
import { AppState, ACHIEVEMENTS, clearApp, readApp } from "@/lib/app-data";

const ACHIEVEMENT_ICONS = [Star, Crown, Heart, Sparkles];

/**
 * Perfil es la pantalla utilitaria a propósito — información y control, no otra escena
 * emocional (decisión explícita del usuario, 2026-07-20). Gana los accesos a Mi Camino y Diario
 * (rebrand "Estrella" v2, 2026-07-28) — el bottom-nav ahora replica el de la referencia exacta
 * (Inicio/Explorar/Lumo/Favoritos/Perfil), así que esas dos secciones reales viven acá en vez de
 * ser tabs propios, sin perder funcionalidad ni ruta.
 */
export default function PerfilPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setState(readApp());
  }, []);

  if (!state) return null;

  const favorites = [...STORIES, ...CUENTOS].filter((s) => state.favoriteStoryIds.includes(s.id)).slice(0, 3);

  return (
    <main className="flex min-h-dvh flex-col gap-5 bg-background px-4 pb-28 pt-10 text-foreground">
      <h1 className="font-heading text-h1">Perfil</h1>

      <div
        className="flex flex-col items-center gap-2 rounded-[24px] bg-card p-6 text-center"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="relative">
          <LumoPortrait pose="lumo-frontal" size={90} />
          <button
            aria-label="Editar perfil"
            className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <p className="font-heading text-lg font-bold">
          {state.childName || "Su familia"}
          {state.childAge ? `, ${state.childAge} años` : ""}
        </p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          Así personaliza Lumo cada historia y oración para ustedes.
        </p>
      </div>

      {favorites.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-heading text-[15px] font-bold">Mis favoritos</p>
            <Link href="/app/favoritos" className="text-[12px] font-bold" style={{ color: "#5B9BD5" }}>
              Ver todos
            </Link>
          </div>
          <div className="flex gap-4">
            {favorites.map((s) => (
              <Link key={s.id} href={`/app/historia/${s.id}`} className="w-20 shrink-0 text-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full" style={{ boxShadow: "var(--shadow-card)" }}>
                  <ArtAsset
                    slug={s.id.startsWith("cuento-") ? s.id : `story-${s.id}`}
                    alt={s.title}
                    fallback={<MoodScene mood={s.scenes[0].mood} />}
                    className="absolute inset-0"
                  />
                </div>
                <p className="mt-1 truncate text-[11px] font-bold text-muted-foreground">{s.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 font-heading text-[15px] font-bold">Logros</p>
        <div className="flex gap-4">
          {ACHIEVEMENTS.map((a, i) => {
            const Icon = ACHIEVEMENT_ICONS[i % ACHIEVEMENT_ICONS.length];
            const unlocked = a.unlocked(state);
            return (
              <div key={a.id} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    background: unlocked ? "linear-gradient(160deg, #F7C948, #F5A300)" : "#F5F1E6",
                    boxShadow: unlocked ? "var(--shadow-button)" : "none",
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: unlocked ? "#2D2A26" : "#B9B5AE" }} />
                </div>
                <span className="text-[10.5px] font-bold text-muted-foreground">{a.titulo}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/app/mi-camino"
          className="flex items-center gap-4 rounded-[24px] bg-card p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-category-purple/20">
            <Sparkles className="h-5 w-5 text-category-purple" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-heading text-[15px] font-bold">Mi camino</p>
            <p className="text-[13px] text-muted-foreground">Tu progreso y tu racha con Lumo</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          href="/app/diario"
          className="flex items-center gap-4 rounded-[24px] bg-card p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-category-blue/20">
            <NotebookPen className="h-5 w-5 text-category-blue" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-heading text-[15px] font-bold">Diario</p>
            <p className="text-[13px] text-muted-foreground">Los momentos que fueron guardando</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      <div className="rounded-[24px] bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <p className="text-sm font-bold">Cristiana</p>
        <p className="text-[13px] text-muted-foreground">Tradición de fe de su familia</p>
      </div>

      <PushSettings />

      <div className="rounded-[24px] bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          El diario de su familia es privado — nunca se vende ni se comparte, y es de ustedes aunque
          decidan no seguir con Lumo.
        </p>
      </div>

      {!confirmingDelete ? (
        <button
          className="h-12 rounded-full border border-[rgba(0,0,0,0.10)] text-sm font-bold text-muted-foreground"
          onClick={() => setConfirmingDelete(true)}
        >
          Borrar mis datos
        </button>
      ) : (
        <div className="rounded-[24px] bg-card p-5 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="mb-4 text-sm text-muted-foreground">
            Esto va a borrar el diario, las oraciones y las historias guardadas en este dispositivo. No
            se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              className="h-11 flex-1 rounded-full border border-[rgba(0,0,0,0.12)] text-sm font-bold text-muted-foreground"
              onClick={() => setConfirmingDelete(false)}
            >
              Cancelar
            </button>
            <button
              className="h-11 flex-1 rounded-full text-sm font-bold text-[#2D2A26]"
              style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)" }}
              onClick={() => {
                clearApp();
                router.push("/");
              }}
            >
              Sí, borrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
