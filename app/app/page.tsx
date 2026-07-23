"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { LumoThread } from "@/components/app/lumo-thread";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { PrayerPoster } from "@/components/app/prayer-poster";
import { StoryPoster } from "@/components/app/story-poster";
import { PRAYERS } from "@/lib/prayers";
import { STORIES } from "@/lib/story-catalog";
import { EXPLORE_CATEGORY_CARDS } from "@/lib/explore-categories";
import { todaysVerse } from "@/lib/verses";
import {
  AppState,
  isGated,
  isRitualDoneToday,
  isTrialExpired,
  markVerseRead,
  readApp,
  todaysStory,
  trialDayNumber,
} from "@/lib/app-data";

/**
 * Home combina el ritual de esta noche (escena única, arriba) con el catálogo completo por
 * secciones debajo — decisión explícita del usuario (2026-07-22) de volver a mostrar todo lo que
 * incluye Lumo directamente acá, en vez de mandar a Explorar. Mismas secciones que Explorar
 * (Oraciones / Categorías / Historias), reutilizando los mismos componentes y datos.
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

  return (
    <main className="relative min-h-dvh bg-[#FAF3EE] text-[#2A1F17]">
      <div className="relative z-10 flex flex-col gap-8 pb-10 pt-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="font-heading text-xl font-medium">
            ¡Hola{childName ? `, ${childName}` : ""}!
          </h1>
          <p className="text-sm text-[#6B5A4A]">Esta noche, un momento para acercarse a Dios en familia.</p>
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
            {expired
              ? "Tu semana gratuita terminó"
              : `Semana gratuita — día ${day} de 7`}
          </p>
          <span className="text-[12px] font-semibold" style={{ color: "#B8791F" }}>
            {expired ? "Ver Premium" : "Ver todas las historias"}
          </span>
        </Link>
      )}

      {/* la escena — un solo momento, una sola acción */}
      <div className="px-5">
        <div
          className="relative h-[440px] w-full overflow-hidden rounded-[28px]"
          style={{ boxShadow: "0 24px 60px -20px rgba(42,31,23,0.35)" }}
        >
          <ArtAsset
            slug={`story-${story.id}`}
            alt={story.title}
            fallback={<MoodScene mood={story.scenes[0].mood} />}
            className="absolute inset-0"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(16,11,8,0.94) 0%, rgba(16,11,8,0.15) 45%, rgba(16,11,8,0) 65%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#F3C878]">
              {doneToday ? "Ya compartieron esto esta noche" : "Esta noche"}
            </span>
            <h2 className="font-heading text-2xl font-medium text-balance text-white">{story.title}</h2>
            <Link
              href={doneToday ? `/app/historia/${story.id}` : `/reproducir/${story.id}`}
              className="flex h-14 w-full max-w-xs items-center justify-center rounded-full text-base font-semibold"
              style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)", color: "#1F1712" }}
            >
              {doneToday ? "Volver a escuchar" : "Empezar"}
            </Link>
          </div>
        </div>
      </div>

      <LumoThread height={50} />

      {/* todo lo que incluye Lumo, por sección — mismas secciones y componentes que Explorar */}
      <section className="flex flex-col gap-3">
        <h2 className="px-4 font-heading text-lg font-medium">Oraciones</h2>
        <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-1">
          {PRAYERS.map((p) => (
            <PrayerPoster key={p.id} prayer={p} locked={isGated(state, p.id, "oracion")} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 px-4">
        {EXPLORE_CATEGORY_CARDS.map((c) => (
          <Link
            key={c.id}
            href={`/app/explorar?categoria=${c.id}`}
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
          </Link>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="px-4 font-heading text-lg font-medium">Historias</h2>
        <div className="grid grid-cols-2 gap-3 px-4">
          {STORIES.map((s) => (
            <StoryPoster key={s.id} story={s} size="large" locked={isGated(state, s.id, "historia")} />
          ))}
        </div>
      </section>

      {/* versículo del día — quieto, sin tarjeta ni botón relleno */}
      <div className="px-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6B5A4A]/80">Versículo del día</p>
        <p className="mt-2 font-heading text-lg italic leading-snug text-balance">&ldquo;{verse.text}&rdquo;</p>
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
      </div>
    </main>
  );
}
