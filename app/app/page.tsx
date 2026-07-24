"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { LumoThread } from "@/components/app/lumo-thread";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { PrayerPoster } from "@/components/app/prayer-poster";
import { PRAYERS } from "@/lib/prayers";
import { STORIES } from "@/lib/story-catalog";
import { getContent } from "@/lib/content-catalog";
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

  // Continuar donde quedó — el contenido a medias más reciente, si existe.
  const continuing = recentInProgress(state, 1)
    .map((p) => getContent(p.contentId))
    .find((c) => c !== undefined);

  return (
    <main className="relative min-h-dvh bg-[#FAF3EE] text-[#2A1F17]">
      <div className="relative z-10 flex flex-col gap-8 pb-10 pt-6">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="font-heading text-h1">
              ¡Hola{childName ? `, ${childName}` : ""}!
            </h1>
            <p className="text-body text-[#A89288]">¿Qué podemos compartir hoy?</p>
          </div>
          <LumoPortrait pose="lumo-frontal" size={36} />
        </div>

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

        {/* Continuar donde quedó — solo si hay un contenido real a medias */}
        {continuing && (
          <section className="flex flex-col gap-2 px-4">
            <h2 className="font-heading text-h2">Continuar donde quedó</h2>
            <Link
              href={`/reproducir/${continuing.id}`}
              className="image-text-overlay relative h-32 w-full overflow-hidden rounded-2xl shadow-sm"
            >
              <ArtAsset
                slug={continuing.illustrationSlug}
                alt={continuing.title}
                fallback={<MoodScene mood={continuing.segments[0].mood} />}
                className="absolute inset-0"
              />
              <div className="overlay-content absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-heading text-h2 text-white text-balance">
                  {continuing.title}
                </h3>
              </div>
            </Link>
          </section>
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

        <LumoThread height={40} />

        {/* Versículo del día — quieto, sin tarjeta ni botón relleno */}
        <div className="px-4">
          <p className="text-caption text-[#A89288]">Versículo del día</p>
          <p className="mt-2 font-heading text-h2 italic leading-snug text-balance">&ldquo;{verse.text}&rdquo;</p>
          <p className="mt-1 text-xs text-[#6B5A4A]">{verse.reference}</p>

          {showReflection ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-[rgba(42,31,23,0.14)] pt-3">
              <p className="text-sm leading-relaxed text-[#6B5A4A]">{verse.meaning}</p>
              <p className="text-sm font-medium">{verse.thinkAbout}</p>
            </div>
          ) : (
            <button
              className="mt-3 text-sm font-semibold text-[#F3C878] underline underline-offset-4"
              onClick={() => {
                markVerseRead();
                setShowReflection(true);
              }}
            >
              Leer reflexión
            </button>
          )}
        </div>

        {/* Oración del día — si hoy corresponde una */}
        {prayer && (
          <section className="flex flex-col gap-3">
            <h2 className="px-4 font-heading text-h2">Oración del día</h2>
            <div className="px-4">
              <PrayerPoster prayer={prayer} locked={isGated(state, prayer.id, "oracion")} />
            </div>
          </section>
        )}

        {/* Una recomendación — la próxima historia real que no vivieron todavía */}
        {recommended && (
          <section className="flex flex-col gap-2 px-4">
            <h2 className="font-heading text-h2">Para seguir descubriendo</h2>
            <Link
              href={`/app/historia/${recommended.id}`}
              className="image-text-overlay relative h-40 w-full overflow-hidden rounded-2xl shadow-sm"
            >
              <ArtAsset
                slug={`story-${recommended.id}`}
                alt={recommended.title}
                fallback={<MoodScene mood={recommended.scenes[0].mood} />}
                className="absolute inset-0"
              />
              <div className="overlay-content absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-heading text-h2 text-white text-balance">
                  {recommended.title}
                </h3>
                <p className="mt-0.5 text-body text-white/80 text-balance">{recommended.subtitle}</p>
              </div>
            </Link>
          </section>
        )}

        <div className="px-4">
          <Link
            href="/app/explorar"
            className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full border text-base font-semibold"
            style={{ borderColor: "rgba(42,31,23,0.18)", color: "#2A1F17" }}
          >
            Explorar todo el contenido
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
