"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { LumoThread } from "@/components/app/lumo-thread";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { PrayerPoster } from "@/components/app/prayer-poster";
import { PRAYERS } from "@/lib/prayers";
import { STORIES, multiEpisodeSeries } from "@/lib/story-catalog";
import { getContent } from "@/lib/content-catalog";
import { SERIES } from "@/lib/content-library";
import { CHARACTER_REGISTRY } from "@/lib/character-registry";
import { EXPLORE_CATEGORY_CARDS } from "@/lib/explore-categories";
import { todaysVerse } from "@/lib/verses";
import {
  AppState,
  isGated,
  isRitualDoneToday,
  isTrialExpired,
  markVerseRead,
  readApp,
  recentInProgress,
  todaysPrayerId,
  todaysStory,
  trialDayNumber,
} from "@/lib/app-data";

/** Fila de "Personajes" — protagonistas reales con Character Card aprobada y retrato ya
 * generado, uno por historia bíblica insignia (APP-REDISENO-INSTRUCCIONES.md §3.4). */
const HOME_CHARACTER_IDS = ["david", "noe", "moises", "jesus", "ester"];

/**
 * Inicio responde una sola pregunta: "¿qué podemos compartir hoy?" — no es un segundo Explorar.
 * Reestructurado 2026-07-24 (decisión del usuario: Inicio y Explorar se sentían idénticos).
 * Solo secciones con datos reales del día — nunca se fabrica una sección con contenido de
 * mentira (ej. "Reflexión del día" no se muestra todavía: no hay contenido real de esa
 * colección producido, ver `lib/content-library.ts`). El catálogo completo vive solo en Explorar.
 */
export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    setState(readApp());
  }, []);

  if (!state) return null;

  const story = todaysStory();
  const doneToday = isRitualDoneToday(state);
  const childName = state.childName || "";
  const verse = todaysVerse(state.ritualNights);
  const expired = isTrialExpired(state);
  const day = trialDayNumber(state);

  const prayerId = todaysPrayerId(state);
  const prayer = PRAYERS.find((p) => p.id === prayerId);

  // Recomendación: la primera historia real que todavía no vivieron, distinta a la de hoy.
  const recommended = STORIES.find((s) => s.id !== story.id && !state.completedStoryIds.includes(s.id));

  // Seguí tu camino — hasta 5 contenidos reales a medias, más reciente primero.
  const continuingList = recentInProgress(state, 5)
    .map((p) => getContent(p.contentId))
    .filter((c) => c !== undefined);

  // Series — solo la(s) que ya tienen más de un episodio real publicado.
  const series = multiEpisodeSeries()[0];
  const seriesLabel = series ? SERIES.find((s) => s.id === series.seriesId)?.label ?? series.seriesId : null;
  const seriesNextIndex = series?.episodes.findIndex((e) => !state.completedStoryIds.includes(e.id)) ?? -1;
  const seriesNextEpisode = series && (seriesNextIndex >= 0 ? series.episodes[seriesNextIndex] : series.episodes[0]);
  const seriesNextPosition = seriesNextIndex >= 0 ? seriesNextIndex + 1 : 1;

  // Personajes — protagonistas con Character Card aprobada y al menos un episodio real.
  const characters = HOME_CHARACTER_IDS.map((id) => CHARACTER_REGISTRY.find((c) => c.id === id))
    .filter((c) => c !== undefined)
    .map((c) => ({ ...c, firstEpisode: c.episodios.find((ep) => STORIES.some((s) => s.id === ep)) }));

  // Más para explorar — dos categorías reales que hoy no aparecen en ninguna otra sección del Home.
  const moreCards = EXPLORE_CATEGORY_CARDS.filter((c) => c.id === "valores" || c.id === "mujeres");

  return (
    <main className="relative min-h-dvh bg-[#FBF5EC] text-[#1C1712]">
      <div className="bg-[#132018] px-4 pb-5 pt-6 text-[#F2ECDF]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-h1">
              ¡Hola{childName ? `, ${childName}` : ""}!
            </h1>
            <p className="text-body text-[rgba(242,236,223,0.66)]">¿Qué podemos compartir hoy?</p>
          </div>
          <div
            className="rounded-full"
            style={{ boxShadow: "0 0 0 2px #132018, 0 0 14px 3px rgba(255,215,64,0.55)" }}
          >
            <LumoPortrait pose="lumo-frontal" size={40} />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-8 pb-10 pt-8">
        {!state.hasAccess && (
          <Link
            href="/paywall"
            className="mx-4 flex items-center justify-between rounded-2xl border px-4 py-3"
            style={{ borderColor: "rgba(184,121,31,0.25)", background: "rgba(184,121,31,0.06)" }}
          >
            <p className="text-[13px] font-medium">
              {expired ? "Tu semana gratuita terminó" : `Semana gratuita — día ${day} de 7`}
            </p>
            <span className="text-[12px] font-semibold" style={{ color: "#B8791F" }}>
              {expired ? "Ver Premium" : "Ver todas las historias"}
            </span>
          </Link>
        )}

        {/* Historia del día — el ritual, full-bleed edge-to-edge (sin card ni margen) */}
        <div className="image-text-overlay relative h-[480px] w-full">
          <ArtAsset
            slug={`story-${story.id}`}
            alt={story.title}
            fallback={<MoodScene mood={story.scenes[0].mood} />}
            className="absolute inset-0"
          />
          <div className="overlay-content absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-6 pb-8 text-center">
            <span className="text-caption text-[#F3C878]">
              {doneToday ? "Ya compartieron esto esta noche" : "Esta noche"}
            </span>
            <h2 className="font-heading text-display text-balance text-white">{story.title}</h2>
            <Link
              href={doneToday ? `/app/historia/${story.id}` : `/reproducir/${story.id}`}
              className="flex h-14 w-full max-w-xs items-center justify-center rounded-full text-base font-semibold"
              style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)", color: "#1F1712" }}
            >
              {doneToday ? "Volver a escuchar" : "Empezar"}
            </Link>
          </div>
        </div>

        {/* Versículo del día — card oscura, separada del hero (APP-REDISENO-INSTRUCCIONES.md §3.2) */}
        <div className="mx-4 rounded-[20px] bg-[#1C2E23] px-[22px] py-6 text-[#F2ECDF]">
          <p className="text-caption text-[#FFD740]">Versículo del día</p>
          <p className="mt-2.5 font-heading text-h2 italic leading-snug text-balance">&ldquo;{verse.text}&rdquo;</p>
          <p className="mt-1 text-xs text-[rgba(242,236,223,0.66)]">{verse.reference}</p>

          {showReflection ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-[rgba(242,236,223,0.14)] pt-3">
              <p className="text-sm leading-relaxed text-[rgba(242,236,223,0.8)]">{verse.meaning}</p>
              <p className="text-sm font-medium">{verse.thinkAbout}</p>
            </div>
          ) : (
            <button
              className="mt-3 text-sm font-semibold text-[#FFD740] underline underline-offset-4"
              onClick={() => {
                markVerseRead();
                setShowReflection(true);
              }}
            >
              Leer reflexión
            </button>
          )}
        </div>

        {/* Seguí tu camino — contenido real a medias, scroll horizontal de cards portrait */}
        {continuingList.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between px-4">
              <h2 className="font-heading text-h2">Seguí tu camino</h2>
            </div>
            <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-1">
              {continuingList.map((c) => (
                <Link
                  key={c.id}
                  href={`/reproducir/${c.id}`}
                  className="image-text-overlay relative h-[170px] w-[130px] shrink-0 overflow-hidden rounded-2xl"
                >
                  <ArtAsset
                    slug={c.illustrationSlug}
                    alt={c.title}
                    fallback={<MoodScene mood={c.segments[0].mood} />}
                    className="absolute inset-0"
                  />
                  <div className="overlay-content absolute inset-x-0 bottom-0 p-2.5">
                    <h3 className="font-heading text-[12.5px] leading-tight text-white text-balance">{c.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Personajes — círculos con anillo del color de acento de cada uno (CLAUDE.md §5.2) */}
        <section className="flex flex-col gap-3">
          <h2 className="px-4 font-heading text-h2">Personajes</h2>
          <div className="scrollbar-none flex gap-4 overflow-x-auto px-4 pb-1">
            {characters.map((c) => (
              <Link
                key={c.id}
                href={c.firstEpisode ? `/app/historia/${c.firstEpisode}` : "/app/explorar"}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5"
              >
                <div
                  className="h-16 w-16 rounded-full p-[2.5px]"
                  style={{ background: `linear-gradient(135deg, ${c.paleta.acento}, #B9860F)` }}
                >
                  <div className="h-full w-full overflow-hidden rounded-full bg-[#1C2E23]">
                    <Image
                      src={`/${c.referenciasAprobadas[0].replace(/^public\//, "")}`}
                      alt={c.nombre}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-center text-[10.5px] font-bold text-[#6B5D4F]">{c.nombre.split(" (")[0]}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Series — pila de cards para comunicar "esto tiene más partes" de un vistazo */}
        {series && seriesNextEpisode && (
          <section className="flex flex-col gap-3">
            <h2 className="px-4 font-heading text-h2">Series</h2>
            <div className="px-4">
              <Link href={`/app/historia/${seriesNextEpisode.id}`} className="inline-block w-[140px]">
                <div className="relative mb-2.5 h-[150px]">
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 scale-[0.96] rounded-2xl bg-[#1C2E23] opacity-60" />
                  <div className="absolute inset-0 translate-x-1 translate-y-1 scale-[0.98] rounded-2xl bg-[#1C2E23] opacity-80" />
                  <div className="absolute inset-0 z-10 overflow-hidden rounded-2xl">
                    <div className="image-text-overlay relative h-full w-full">
                      <ArtAsset
                        slug={`story-${series.episodes[0].id}`}
                        alt={seriesLabel ?? "Serie"}
                        fallback={<MoodScene mood="threshold" />}
                        className="absolute inset-0"
                      />
                      <span className="overlay-content absolute right-2 top-2 rounded-full bg-[rgba(19,32,24,0.8)] px-2.5 py-1 text-[9px] font-bold text-[#FFD740]">
                        {series.episodes.length} EPISODIOS
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-heading text-[13px] font-semibold leading-tight">{seriesLabel}</h3>
                <span className="text-[11px] text-[#A3927F]">
                  Episodio {seriesNextPosition} de {series.episodes.length}
                </span>
              </Link>
            </div>
          </section>
        )}

        <LumoThread height={40} />

        {/* Oración del día — si hoy corresponde una */}
        {prayer && (
          <section className="flex flex-col gap-3">
            <h2 className="px-4 font-heading text-h2">Oración del día</h2>
            <div className="px-4">
              <PrayerPoster prayer={prayer} locked={isGated(state, prayer.id, "oracion")} />
            </div>
          </section>
        )}

        {/* Historia de la semana — card oscura con glow, corta el ritmo antes del grid final */}
        {recommended && (
          <section className="px-4">
            <div className="relative overflow-hidden rounded-[22px] bg-[#132018] p-[26px] text-[#F2ECDF]">
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,215,64,0.25), transparent 70%)" }}
              />
              <span className="relative text-caption text-[#FFD740]">Historia de la semana</span>
              <h3 className="relative mt-2 font-heading text-[19px]">{recommended.title}</h3>
              <p className="relative mb-4 mt-2 max-w-[220px] text-[13.5px] leading-relaxed text-[rgba(242,236,223,0.66)]">
                {recommended.subtitle}
              </p>
              <Link
                href={`/app/historia/${recommended.id}`}
                className="relative inline-block rounded-full border-[1.5px] border-[#FFD740] px-5 py-2.5 text-[13.5px] font-semibold text-[#FFD740]"
              >
                Descubrir
              </Link>
            </div>
          </section>
        )}

        {/* Más para explorar — mezcla de categorías reales, sin repetir lo ya mostrado arriba */}
        {moreCards.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="px-4 font-heading text-h2">Más para explorar</h2>
            <div className="grid grid-cols-2 gap-3.5 px-4">
              {moreCards.map((c) => (
                <Link
                  key={c.id}
                  href={`/app/explorar?categoria=${c.id}`}
                  className="image-text-overlay relative h-[170px] overflow-hidden rounded-2xl"
                >
                  <ArtAsset
                    slug={c.slug}
                    alt={c.label}
                    fallback={<MoodScene mood={c.mood} />}
                    className="absolute inset-0"
                  />
                  <span className="overlay-content absolute bottom-3 left-3 right-3 font-heading text-[14.5px] text-white">
                    {c.label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="px-4">
          <Link
            href="/app/explorar"
            className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full border text-base font-semibold"
            style={{ borderColor: "rgba(28,23,18,0.18)", color: "#1C1712" }}
          >
            Explorar todo el contenido
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
