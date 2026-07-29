"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, BookOpen, Music2, Puzzle, HandHeart, Moon, Sparkles } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { PrayerPoster } from "@/components/app/prayer-poster";
import { PRAYERS } from "@/lib/prayers";
import { STORIES, multiEpisodeSeries } from "@/lib/story-catalog";
import { getContent, getContentByType } from "@/lib/content-catalog";
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
  todaysEvangelioId,
  todaysPrayerId,
  todaysStory,
  trialDayNumber,
} from "@/lib/app-data";

/** Fila de "Personajes" — protagonistas reales con Character Card aprobada y retrato ya
 * generado, uno por historia bíblica insignia (APP-REDISENO-INSTRUCCIONES.md §3.4). */
const HOME_CHARACTER_IDS = ["david", "noe", "moises", "jesus", "ester"];

/** Accesos rápidos "¿Qué quieres hacer hoy?" (lumo-design-tokens.json, referencia dashboard) —
 * todos enlazan a rutas reales que ya existen; Música/Actividades no tienen contenido producido
 * todavía, así que Explorar ya las muestra como estado vacío honesto en vez de fabricar nada acá. */
const QUICK_ACTIONS = [
  { href: "/app/explorar", label: "Historias", icon: BookOpen, accent: "blue" as const },
  { href: "/app/explorar?categoria=musica", label: "Música", icon: Music2, accent: "green" as const },
  { href: "/app/explorar", label: "Actividades", icon: Puzzle, accent: "red" as const },
  { href: "/app/orar", label: "Oraciones", icon: HandHeart, accent: "purple" as const },
  { href: "/app/orar", label: "Rutinas", icon: Moon, accent: "purple" as const },
  { href: "/app/mi-camino", label: "Mi progreso", icon: Sparkles, accent: "pink" as const },
];

const ACCENT_HEX: Record<string, string> = {
  blue: "#5B9BD5",
  pink: "#F06BA8",
  green: "#6BCB77",
  purple: "#9B87F5",
  red: "#F26B6B",
};

/**
 * Inicio responde una sola pregunta: "¿qué podemos compartir hoy?" — no es un segundo Explorar.
 * Solo secciones con datos reales del día — nunca se fabrica una sección con contenido de
 * mentira. El catálogo completo vive solo en Explorar.
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

  // Evangelio del día — gancho breve y gratuito, sin candado (ver isGated en lib/app-data.ts).
  const evangelios = getContentByType("evangelio");
  const evangelio = evangelios.length > 0 ? getContent(todaysEvangelioId(state)) : undefined;

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
    <main className="relative min-h-dvh bg-background text-foreground">
      <div className="flex items-center justify-between bg-background px-4 pb-3 pt-6">
        <div>
          <h1 className="font-heading text-h1">
            ¡Hola{childName ? `, ${childName}` : ""}! 👋
          </h1>
          <p className="text-body text-muted-foreground">¿Qué alegría tenerte en Lumo</p>
        </div>
        <div className="rounded-full" style={{ boxShadow: "0 0 0 3px #FDFCF9, var(--shadow-mascot)" }}>
          <LumoPortrait pose="lumo-frontal" size={44} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-8 pb-10 pt-2">
        {!state.hasAccess && (
          <Link
            href="/paywall"
            className="mx-4 flex items-center justify-between rounded-[24px] bg-card px-4 py-3"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-[13px] font-bold">
              {expired ? "Tu semana gratuita terminó" : `Semana gratuita — día ${day} de 7`}
            </p>
            <span className="text-[12px] font-bold" style={{ color: "#F5B800" }}>
              {expired ? "Ver Premium" : "Ver todas las historias"}
            </span>
          </Link>
        )}

        {/* Historia del día — hero grande, esquinas muy redondeadas, scrim propio para legibilidad. */}
        <div className="relative mx-4 h-[440px] overflow-hidden rounded-[28px]" style={{ boxShadow: "var(--shadow-card)" }}>
          <ArtAsset
            slug={`story-${story.id}`}
            alt={story.title}
            fallback={<MoodScene mood={story.scenes[0].mood} />}
            className="absolute inset-0"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(10,8,6,0.55) 58%, rgba(10,8,6,0.92) 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col items-center gap-4 p-6 pb-8 text-center">
            <span className="text-caption text-[#F5B800]">
              {doneToday ? "Ya compartieron esto esta noche" : "Esta noche"}
            </span>
            <h2 className="font-heading text-display text-balance text-white">{story.title}</h2>
            <Link
              href={doneToday ? `/app/historia/${story.id}` : `/reproducir/${story.id}`}
              className="flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full text-base font-bold text-[#2D2A26]"
              style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", boxShadow: "var(--shadow-button)" }}
            >
              {doneToday ? "Volver a escuchar" : "Empezar"}
            </Link>
          </div>
        </div>

        {/* Versículo del día — card clara con acento amarillo, sin fondo oscuro. */}
        <div className="mx-4 rounded-[24px] bg-card px-[22px] py-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-caption font-bold" style={{ color: "#F5B800" }}>
            Versículo del día
          </p>
          <p className="mt-2.5 font-heading text-h2 italic leading-snug text-balance">&ldquo;{verse.text}&rdquo;</p>
          <p className="mt-1 text-xs text-muted-foreground">{verse.reference}</p>

          {showReflection ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-[#EFEDE8] pt-3">
              <p className="text-sm leading-relaxed text-[#5A564F]">{verse.meaning}</p>
              <p className="text-sm font-bold">{verse.thinkAbout}</p>
            </div>
          ) : (
            <button
              className="mt-3 text-sm font-bold underline underline-offset-4"
              style={{ color: "#5B9BD5" }}
              onClick={() => {
                markVerseRead();
                setShowReflection(true);
              }}
            >
              Leer reflexión
            </button>
          )}
        </div>

        {/* ¿Qué quieres hacer hoy? — accesos rápidos en grid 2x3, ícono redondo pastel */}
        <section className="flex flex-col gap-3">
          <h2 className="px-4 font-heading text-h2">¿Qué quieres hacer hoy?</h2>
          <div className="grid grid-cols-3 gap-3 px-4">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon, accent }) => (
              <Link key={label} href={href} className="flex flex-col items-center gap-2 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: `${ACCENT_HEX[accent]}40` }}
                >
                  <Icon className="h-7 w-7" style={{ color: ACCENT_HEX[accent] }} />
                </div>
                <span className="text-[12px] font-bold text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </section>

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
                  className="image-text-overlay relative h-[170px] w-[130px] shrink-0 overflow-hidden rounded-[20px]"
                  style={{ boxShadow: "var(--shadow-card)" }}
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
          <div className="scrollbar-none flex gap-5 overflow-x-auto px-4 pb-1">
            {characters.map((c) => (
              <Link
                key={c.id}
                href={c.firstEpisode ? `/app/historia/${c.firstEpisode}` : "/app/explorar"}
                className="flex w-20 shrink-0 flex-col items-center gap-2"
              >
                <div
                  className="h-20 w-20 rounded-full p-[3px]"
                  style={{ background: `linear-gradient(135deg, ${c.paleta.acento}, #F5A300)`, boxShadow: "var(--shadow-mascot)" }}
                >
                  <div className="h-full w-full overflow-hidden rounded-full bg-white">
                    <Image
                      src={`/${c.referenciasAprobadas[0].replace(/^public\//, "")}`}
                      alt={c.nombre}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-center text-[11.5px] font-bold text-muted-foreground">{c.nombre.split(" (")[0]}</span>
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
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 scale-[0.96] rounded-[20px] bg-[#EFEDE8] opacity-60" />
                  <div className="absolute inset-0 translate-x-1 translate-y-1 scale-[0.98] rounded-[20px] bg-[#EFEDE8] opacity-80" />
                  <div className="absolute inset-0 z-10 overflow-hidden rounded-[20px]" style={{ boxShadow: "var(--shadow-card)" }}>
                    <div className="image-text-overlay relative h-full w-full">
                      <ArtAsset
                        slug={`story-${series.episodes[0].id}`}
                        alt={seriesLabel ?? "Serie"}
                        fallback={<MoodScene mood="threshold" />}
                        className="absolute inset-0"
                      />
                      <span className="overlay-content absolute right-2 top-2 rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-bold" style={{ color: "#F5A300" }}>
                        {series.episodes.length} EPISODIOS
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-heading text-[13px] font-bold leading-tight">{seriesLabel}</h3>
                <span className="text-[11px] text-muted-foreground">
                  Episodio {seriesNextPosition} de {series.episodes.length}
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* Evangelio del día — pasaje breve del día, con variante de tono según la hora (mañana/noche) */}
        {evangelio && (
          <section className="mx-4 flex flex-col gap-2 rounded-[24px] bg-card px-[22px] py-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-caption font-bold" style={{ color: "#F5B800" }}>
              Evangelio del día
            </p>
            <h3 className="font-heading text-h2 leading-snug text-balance">{evangelio.title}</h3>
            <p className="text-sm text-muted-foreground text-balance">{evangelio.subtitle}</p>
            <Link
              href={`/reproducir/${evangelio.id}`}
              className="mt-2 inline-flex h-11 w-full max-w-[200px] items-center justify-center rounded-full text-sm font-bold text-[#2D2A26]"
              style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", boxShadow: "var(--shadow-button)" }}
            >
              Escuchar
            </Link>
          </section>
        )}

        {/* Oración del día — si hoy corresponde una */}
        {prayer && (
          <section className="flex flex-col gap-3">
            <h2 className="px-4 font-heading text-h2">Oración del día</h2>
            <div className="px-4">
              <PrayerPoster prayer={prayer} locked={isGated(state, prayer.id, "oracion")} />
            </div>
          </section>
        )}

        {/* Historia de la semana — card morada con glow, corta el ritmo antes del grid final */}
        {recommended && (
          <section className="px-4">
            <div className="relative overflow-hidden rounded-[24px] p-[26px] text-white" style={{ background: "linear-gradient(160deg, #9B87F5, #7A63E8)" }}>
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)" }}
              />
              <span className="relative text-caption text-white/80">Historia de la semana</span>
              <h3 className="relative mt-2 font-heading text-[19px] font-bold">{recommended.title}</h3>
              <p className="relative mb-4 mt-2 max-w-[220px] text-[13.5px] leading-relaxed text-white/80">
                {recommended.subtitle}
              </p>
              <Link
                href={`/app/historia/${recommended.id}`}
                className="relative inline-block rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold"
                style={{ color: "#9B87F5" }}
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
                  className="image-text-overlay relative h-[170px] overflow-hidden rounded-[20px]"
                  style={{ boxShadow: "var(--shadow-card)" }}
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
            className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full border text-base font-bold"
            style={{ borderColor: "#EFEDE8", color: "#2D2A26" }}
          >
            Explorar todo el contenido
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
