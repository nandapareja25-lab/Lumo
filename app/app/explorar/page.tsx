"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { StoryPoster } from "@/components/app/story-poster";
import { PrayerPoster } from "@/components/app/prayer-poster";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { STORIES, StoryTag } from "@/lib/story-catalog";
import { PRAYERS } from "@/lib/prayers";
import { EXPLORE_FILTERS as FILTERS, EXPLORE_CATEGORY_CARDS as CATEGORY_CARDS, ExploreFilterId as FilterId } from "@/lib/explore-categories";
import { AppState, isGated, readApp } from "@/lib/app-data";

/**
 * Solo el catálogo real de lanzamiento — Historias Bíblicas y Oraciones Guiadas, las dos
 * colecciones con contenido producido hoy. Nada de "Próximamente", conteos de episodios ni
 * categorías vacías: cuando exista una tercera colección real, aparece acá sola, sin haber
 * anunciado antes un espacio vacío (decisión explícita del usuario, 2026-07-20).
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

  const stories = useMemo(() => {
    return STORIES.filter((s) => {
      const matchesFilter = filter === "todo" || s.category === filter || s.tags.includes(filter as StoryTag);
      const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.character.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, q]);

  const prayers = useMemo(() => {
    if (!q) return PRAYERS;
    return PRAYERS.filter((p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));
  }, [q]);

  const searching = q.length > 0;

  if (!state) return null;

  return (
    <main className="relative min-h-dvh bg-[#FAF3EE] text-[#2A1F17]">
      <div className="relative z-10 flex flex-col gap-6 pb-4 pt-6">
      <div className="px-4">
        <h1 className="font-heading text-2xl font-medium">Explorar</h1>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7A63]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar historias u oraciones…"
            className="h-11 w-full rounded-full border border-[rgba(42,31,23,0.14)] bg-white pl-10 pr-4 text-sm text-[#2A1F17] outline-none placeholder:text-[#8A7A63]/70 focus-visible:border-[#B8791F]"
          />
        </div>
      </div>

      {!searching && (
        <section className="flex flex-col gap-3">
          <h2 className="px-4 font-heading text-lg font-medium">Oraciones</h2>
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
              className="relative h-28 overflow-hidden rounded-2xl text-left shadow-sm"
            >
              <ArtAsset
                slug={c.slug}
                alt={c.label}
                fallback={<MoodScene mood={c.mood} />}
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-heading text-sm font-semibold text-white">
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
                  ? { background: "linear-gradient(180deg, #F3C878, #F0B860)", color: "#1F1712" }
                  : { background: "rgba(42,31,23,0.05)", color: "#6B5A4A" }
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
            <h2 className="font-heading text-lg font-medium">Oraciones</h2>
            <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
              {prayers.map((p) => (
                <PrayerPoster key={p.id} prayer={p} locked={isGated(state, p.id, "oracion")} />
              ))}
            </div>
          </section>
        )}

        {searching && <h2 className="font-heading text-lg font-medium">Historias</h2>}

        {stories.length === 0 && prayers.length === 0 ? (
          <p className="text-sm text-[#6B5A4A]">No encontramos nada con esa búsqueda.</p>
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
