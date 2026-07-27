"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { StoryPoster } from "@/components/app/story-poster";
import { PrayerPoster } from "@/components/app/prayer-poster";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { STORIES, CUENTOS, StoryTag, multiEpisodeSeries } from "@/lib/story-catalog";
import { PRAYERS } from "@/lib/prayers";
import { EXPLORE_FILTERS as FILTERS, EXPLORE_CATEGORY_CARDS as CATEGORY_CARDS, ExploreFilterId as FilterId } from "@/lib/explore-categories";
import { AppState, isGated, readApp } from "@/lib/app-data";

/**
 * Solo el catálogo real de lanzamiento — Historias Bíblicas, Oraciones Guiadas y Cuentos con
 * valores, las tres colecciones con contenido producido hoy (2026-07-27: se sumaron los 15
 * Cuentos con valores, guion+audio+ilustración completos). Nada de "Próximamente", conteos de
 * episodios ni categorías vacías: cuando exista una colección nueva real, aparece acá sola, sin
 * haber anunciado antes un espacio vacío (decisión explícita del usuario, 2026-07-20).
 */

export default function ExplorarPage() {
  return (
    <Suspense fallback={null}>
      <ExplorarPageInner />
    </Suspense>
  );
}

function ExplorarPageInner() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<FilterId>("todo");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<AppState | null>(null);
  const q = query.trim().toLowerCase();

  useEffect(() => {
    setState(readApp());
  }, []);

  // Deep-link desde Home (tarjetas de categoría) — arranca ya filtrado si viene ?categoria=.
  useEffect(() => {
    const fromUrl = searchParams.get("categoria") as FilterId | null;
    if (fromUrl && FILTERS.some((f) => f.id === fromUrl)) {
      setFilter(fromUrl);
    }
  }, [searchParams]);

  const seriesIds = useMemo(() => new Set(multiEpisodeSeries().flatMap((s) => s.episodes.map((e) => e.id))), []);

  // Historias bíblicas + Cuentos con valores, en un solo catálogo navegable — pero los pills
  // específicos de la Biblia (personajes/milagros/mujeres/valores) nunca deben mezclar cuentos
  // originales, aunque compartan el tag "valores" (ver nota en explore-categories.ts).
  const stories = useMemo(() => {
    if (filter === "musica") return [];
    const bibleTagFilters: FilterId[] = ["personajes", "milagros", "mujeres", "valores"];
    return [...STORIES, ...CUENTOS].filter((s) => {
      const isCuento = s.category === "general";
      const matchesFilter =
        filter === "todo"
          ? true
          : filter === "cuento"
            ? isCuento
            : filter === "series"
              ? seriesIds.has(s.id)
              : bibleTagFilters.includes(filter)
                ? !isCuento && s.tags.includes(filter as StoryTag)
                : s.category === filter;
      const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.character.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, q, seriesIds]);

  const prayers = useMemo(() => {
    if (!q) return PRAYERS;
    return PRAYERS.filter((p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));
  }, [q]);

  const searching = q.length > 0;

  if (!state) return null;

  return (
    <main className="relative min-h-dvh bg-[#FBF5EC] text-[#1C1712]">
      <div className="bg-[#132018] px-4 pb-5 pt-6 text-[#F2ECDF]">
        <h1 className="font-heading text-h1">Explorar</h1>
      </div>
      <div className="relative z-10 flex flex-col gap-6 pb-4 pt-6">
      <div className="px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3927F]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar historias u oraciones…"
            className="h-11 w-full rounded-full border border-[#ECDFCD] bg-white pl-10 pr-4 text-sm text-[#1C1712] outline-none placeholder:text-[#A3927F] focus-visible:border-[#B9860F]"
          />
        </div>
      </div>

      {!searching && (
        <section className="flex flex-col gap-3">
          <h2 className="px-4 font-heading text-h2">Oraciones</h2>
          <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-1">
            {PRAYERS.map((p) => (
              <PrayerPoster key={p.id} prayer={p} locked={isGated(state, p.id, "oracion")} />
            ))}
          </div>
        </section>
      )}

      {!searching && (
        <div className="grid grid-cols-2 gap-3 px-4">
          {CATEGORY_CARDS.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className="image-text-overlay relative h-28 overflow-hidden rounded-2xl text-left shadow-sm"
            >
              <ArtAsset
                slug={c.slug}
                alt={c.label}
                fallback={<MoodScene mood={c.mood} />}
                className="absolute inset-0"
              />
              <span className="overlay-content absolute bottom-3 left-3 right-3 font-heading text-h2 text-white">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {!searching && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              style={
                filter === f.id
                  ? { background: "linear-gradient(135deg, #FFD740, #F7C35C)", color: "#3A2705" }
                  : { background: "transparent", border: "1.5px solid #ECDFCD", color: "#6B5D4F" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 px-4">
        {searching && prayers.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-heading text-h2">Oraciones</h2>
            <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
              {prayers.map((p) => (
                <PrayerPoster key={p.id} prayer={p} locked={isGated(state, p.id, "oracion")} />
              ))}
            </div>
          </section>
        )}

        {searching && <h2 className="font-heading text-h2">Historias</h2>}

        {!searching && filter === "musica" ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <LumoPortrait pose="lumo-frontal" size={56} />
            <p className="max-w-[26ch] text-body text-[#6B5D4F]">
              Todavía no hay música disponible. Pronto vamos a sumar canciones para dormir.
            </p>
          </div>
        ) : stories.length === 0 && prayers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <LumoPortrait pose="lumo-frontal" size={56} />
            <p className="max-w-[26ch] text-body text-[#6B5D4F]">
              No encontramos nada con esa búsqueda. Prueba con otra palabra.
            </p>
          </div>
        ) : stories.length === 0 && searching ? null : (
          <div className="grid grid-cols-2 gap-3">
            {stories.map((story) => (
              <StoryPoster key={story.id} story={story} size="large" locked={isGated(state, story.id, "historia")} />
            ))}
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
