"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { StoryPoster } from "@/components/app/story-poster";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { STORIES, CUENTOS } from "@/lib/story-catalog";
import { AppState, readApp } from "@/lib/app-data";

type FilterId = "historias" | "musica" | "actividades";
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "historias", label: "Historias" },
  { id: "musica", label: "Música" },
  { id: "actividades", label: "Actividades" },
];

/** Favoritos — nueva pantalla del nav (rebrand "Estrella" v2, 2026-07-28), conectada a un dato
 * que ya existía sin usar (`favoriteStoryIds`/`toggleFavorite`, lib/app-data.ts) — no se fabrica
 * nada nuevo, solo se le da una pantalla real a un mecanismo que ya funcionaba. Música y
 * Actividades no tienen favoritos propios todavía (esas colecciones no tienen contenido/función
 * de favorito real) — el filtro existe para navegar, pero cae a un estado vacío honesto. */
export default function FavoritosPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [filter, setFilter] = useState<FilterId>("historias");

  useEffect(() => {
    setState(readApp());
  }, []);

  if (!state) return null;

  const favorites =
    filter === "historias" ? [...STORIES, ...CUENTOS].filter((s) => state.favoriteStoryIds.includes(s.id)) : [];

  return (
    <main className="flex min-h-dvh flex-col gap-5 bg-background px-4 pt-10 text-foreground">
      <div>
        <h1 className="font-heading text-h1">Mis favoritos</h1>
        <p className="mt-1 text-body text-muted-foreground">Todo lo que más te gusta</p>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors"
            style={
              filter === f.id
                ? { background: "linear-gradient(180deg, #F7C948, #F5A300)", color: "#2D2A26", boxShadow: "var(--shadow-button)" }
                : { background: "transparent", border: "1.5px solid #EFEDE8", color: "#5A564F" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-category-pink/15">
            <Heart className="h-7 w-7 text-category-pink" />
          </div>
          <LumoPortrait pose="lumo-frontal" size={64} />
          <p className="max-w-[26ch] text-body text-muted-foreground">
            {filter === "historias"
              ? "Todavía no marcaron ninguna historia como favorita. Toquen el corazón en la que más les guste para encontrarla acá."
              : "Todavía no hay contenido disponible acá. Muy pronto."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favorites.map((story) => (
            <StoryPoster key={story.id} story={story} size="large" />
          ))}
        </div>
      )}
    </main>
  );
}
