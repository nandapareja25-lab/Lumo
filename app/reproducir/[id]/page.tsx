"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Check, Heart, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { CONTENT, getContent } from "@/lib/content-catalog";
import { EpisodeIllustration } from "@/components/app/episode-illustration";
import {
  AppState,
  clearProgress,
  completeStory,
  getProgress,
  isGated,
  isTrialExpired,
  markPrayerSaid,
  newlyReachedMilestone,
  readApp,
  saveProgress,
} from "@/lib/app-data";
import { getStory } from "@/lib/story-catalog";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { VoiceRecorder } from "@/components/app/voice-recorder";
import type { AudioSegment } from "@/app/api/content-audio/route";
import type { AudioLibrary } from "@/app/api/audio-library/route";

/** Volumen de mezcla — la música nunca compite con la narración (LUMO-CONTENT-BIBLE.md sección 12). */
const MUSIC_VOLUME = 0.15;
const SFX_VOLUME = 0.45;

/**
 * Reproductor compartido de contenido audio-first (historias y oraciones): una sola ilustración
 * principal a pantalla completa (no video, no una ilustración distinta por escena — ver
 * LUMO-CONTENT-BIBLE.md sección 17), con la voz oficial de Lumo (ElevenLabs). Los subtítulos son
 * frases cortas que aparecen y desaparecen en sincronía con el audio, como en una película — nunca
 * el guion completo de golpe.
 *
 * Comparte arquitectura y componentes entre tipos de contenido, pero la experiencia no es idéntica:
 * una historia invita a escuchar un relato (ritmo más vivo, progreso por escenas, cierre con
 * referencia bíblica + diario); una oración invita al recogimiento (ritmo más lento, progreso
 * continuo, cierre en silencio con la acción de "recé esta oración"). Ver `isOracion` más abajo.
 *
 * Lumo es una plataforma audio-first: si el audio real de un contenido todavía no fue producido,
 * NO se inventa narración con voces de navegador — se muestra honestamente como "pendiente de
 * generar", pero con la misma calidad visual que el resto del reproductor (una promesa, no una
 * pantalla rota).
 */
export default function ReproducirPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const content = getContent(id);
  const isOracion = content?.contentType === "oracion";

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [audioSegments, setAudioSegments] = useState<AudioSegment[] | null | undefined>(undefined);
  const [cueText, setCueText] = useState("");
  const [finished, setFinished] = useState(false);
  const [audioLibrary, setAudioLibrary] = useState<AudioLibrary | null>(null);
  const [prayerSaid, setPrayerSaid] = useState(false);
  const [momentMode, setMomentMode] = useState<"voz" | "texto">("voz");
  const [momentAnswer, setMomentAnswer] = useState("");
  const [momentAudio, setMomentAudio] = useState<string | null>(null);
  const [momentSaved, setMomentSaved] = useState<ReturnType<typeof newlyReachedMilestone> | "done" | null>(null);
  const [celebrationSeen, setCelebrationSeen] = useState(false);
  const [appState, setAppState] = useState<AppState | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);
  // Segundo desde donde reanudar, una sola vez, al cargar el segmento donde habían quedado.
  const resumeTimeRef = useRef<number | null>(null);
  const lastSaveRef = useRef(0);

  const scene = content?.segments[index];
  const isLast = content ? index === content.segments.length - 1 : false;

  useEffect(() => {
    if (!content) return;
    const state = readApp();
    setPrayerSaid(state.prayersSaidIds.includes(content.id));
    setAppState(state);
    const progress = getProgress(state, content.id);
    if (progress && progress.segmentIndex < content.segments.length) {
      setIndex(progress.segmentIndex);
      resumeTimeRef.current = progress.audioTime;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content?.id]);


  useEffect(() => {
    let active = true;
    fetch(`/api/content-audio?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setAudioSegments(data.segments ?? null);
      })
      .catch(() => active && setAudioSegments(null));
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    fetch(`/api/audio-library`)
      .then((r) => r.json())
      .then((data) => active && setAudioLibrary(data))
      .catch(() => active && setAudioLibrary({ music: {}, sfx: {} }));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      musicRef.current?.pause();
    };
  }, []);

  const audioReady =
    content != null &&
    audioSegments != null &&
    audioSegments.length === content.segments.length &&
    audioSegments.every((s) => s.url);

  // Música ambiental por mood — biblioteca reutilizable, en volumen bajo, se acomoda al mood de
  // la escena actual (LUMO-CONTENT-BIBLE.md sección 12).
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    if (!scene || finished || !audioReady) {
      music.pause();
      return;
    }
    const track = audioLibrary?.music[scene.mood];
    if (!track) {
      music.pause();
      return;
    }
    if (!music.src.endsWith(track.url)) {
      music.src = track.url;
      music.loop = true;
      music.volume = MUSIC_VOLUME;
    }
    if (playing) music.play().catch(() => {});
    else music.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, playing, audioLibrary, finished]);

  // Efecto de sonido puntual del segmento actual — una sola vez, con moderación (sección 13).
  useEffect(() => {
    const sfxPlayer = sfxRef.current;
    if (!sfxPlayer || !scene?.sfx || !playing || finished || !audioReady) return;
    const clip = audioLibrary?.sfx[scene.sfx];
    if (!clip) return;
    sfxPlayer.src = clip.url;
    sfxPlayer.volume = SFX_VOLUME;
    sfxPlayer.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing, audioLibrary, finished]);

  useEffect(() => {
    if (!scene || finished || !audioReady) return;
    audioRef.current?.pause();
    setCueText("");

    if (!playing) return;

    const realSegment = audioSegments![index];
    if (realSegment.url && audioRef.current) {
      audioRef.current.src = realSegment.url;
      setCueText(realSegment.cues[0]?.text ?? "");
      if (resumeTimeRef.current != null) {
        audioRef.current.currentTime = resumeTimeRef.current;
        resumeTimeRef.current = null;
      }
      audioRef.current.play().catch(() => {});
    }
  }, [index, playing, audioSegments, finished, audioReady, scene]);

  const passageLink = useMemo(() => {
    if (!content?.passages.length) return null;
    const query = encodeURIComponent(content.passages.join("; "));
    return `https://www.biblegateway.com/passage/?search=${query}&version=NVI`;
  }, [content]);

  const related = useMemo(() => {
    if (!content) return undefined;
    const sameSeries = CONTENT.find(
      (c) => c.id !== content.id && c.contentType === content.contentType && c.seriesId === content.seriesId,
    );
    if (sameSeries) return sameSeries;
    return CONTENT.find(
      (c) => c.id !== content.id && c.contentType === content.contentType && c.tags.some((t) => content.tags.includes(t)),
    );
  }, [content]);

  const reflection = content?.segments.find((s) => s.role === "guia-cierre")?.caption;

  // A dónde vuelve el usuario al cerrar — cada tipo de contenido tiene su propia pantalla de origen.
  const exitHref = isOracion ? "/app/orar" : `/app/historia/${id}`;

  function formatMinutes(seconds: number) {
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} min`;
  }

  function handleMarkPrayerSaid() {
    if (!content) return;
    markPrayerSaid(content.id);
    setPrayerSaid(true);
  }

  if (!content || !scene) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#FAF3EE] px-4 text-center">
        <p className="text-[#6B5A4A]">No encontramos este contenido.</p>
      </main>
    );
  }

  if (appState === undefined) {
    return <main className="min-h-dvh bg-[#FAF3EE]" />;
  }

  // Onboarding → Home → una historia completa, gratis. Cualquier otra historia, o cualquier
  // oración, requiere Paywall — salvo que ya sea suscriptora o ya la hayan vivido antes.
  if (isGated(appState, content.id, isOracion ? "oracion" : "historia")) {
    return (
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#100B08]">
        <EpisodeIllustration
          content={content}
          segmentIndex={0}
          mood={content.segments[0].mood}
          className="absolute inset-0"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, #100B08 0%, rgba(16,11,8,0.6) 45%, rgba(16,11,8,0.25) 100%)",
          }}
        />
        <button
          onClick={() => router.push(exitHref)}
          aria-label="Cerrar"
          className="absolute right-4 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative z-10 mt-auto flex flex-col items-center gap-3 px-6 pb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#F3C878]">
            {isOracion ? "Oración guiada" : "Historia narrada"}
          </span>
          <h1 className="font-heading text-xl font-medium text-white text-balance">{content.title}</h1>
          <p className="max-w-xs text-sm text-[#C9BBA3] text-balance">
            {isTrialExpired(appState)
              ? "Tu semana gratuita ya terminó. Con Premium puedes seguir eligiendo cualquier historia."
              : "Hoy la historia gratis es otra — con Premium puedes elegir esta ahora mismo, sin esperar."}
          </p>
          <Link
            href="/paywall"
            className="flex h-14 w-full max-w-xs items-center justify-center rounded-full text-base font-semibold text-[#1F1712]"
            style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
          >
            Ver planes
          </Link>
        </div>
      </main>
    );
  }

  function handleTimeUpdate() {
    const time = audioRef.current?.currentTime ?? 0;

    // Progreso real — guardado cada ~4s, no en cada tick de timeupdate (evita escrituras
    // excesivas a localStorage). Se borra al terminar de verdad (ver goNext/onEnded más abajo).
    if (content && time - lastSaveRef.current >= 4) {
      lastSaveRef.current = time;
      saveProgress(content.id, index, time);
    }

    const cues = audioSegments?.[index]?.cues;
    if (!cues?.length) return;
    // En silencios entre frases (pausas naturales o "...") el tiempo no cae dentro de ningún
    // cue — en ese caso mantenemos visible el último cue que ya empezó, en vez de saltar al
    // final del segmento, para que el subtítulo nunca "pierda la secuencia".
    const active =
      cues.find((c) => time >= c.start && time <= c.end) ??
      [...cues].reverse().find((c) => time >= c.start) ??
      cues[0];
    setCueText(active.text);
  }

  function goNext() {
    if (isLast) {
      audioRef.current?.pause();
      setFinished(true);
      if (content) clearProgress(content.id);
      return;
    }
    lastSaveRef.current = 0;
    setIndex((i) => Math.min(i + 1, content!.segments.length - 1));
  }

  function goPrev() {
    lastSaveRef.current = 0;
    setIndex((i) => Math.max(i - 1, 0));
  }

  // Todavía cargando el registro de audio — evita mostrar "pendiente" por un instante falso.
  if (audioSegments === undefined) {
    return <main className="min-h-dvh bg-[#FAF3EE]" />;
  }

  if (!audioReady && !finished) {
    // Sin audio real todavía — es el estado inicial esperado de todo el catálogo, no una excepción
    // ni una pantalla rota. Misma calidad visual que el reproductor: portada, título y duración,
    // más un mensaje que se siente como una promesa ("va a estar") en vez de un aviso de error.
    return (
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#100B08]">
        <EpisodeIllustration
          content={content}
          segmentIndex={0}
          mood={content.segments[0].mood}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100B08] via-[#100B08]/40 to-transparent" />
        <button
          onClick={() => router.push(exitHref)}
          aria-label="Cerrar"
          className="absolute right-4 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative z-10 mt-auto flex flex-col items-center gap-3 px-6 pb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#F3C878]">
            {isOracion ? "Oración guiada" : "Historia narrada"}
          </span>
          <h1 className="font-heading text-xl font-medium text-white text-balance">{content.title}</h1>
          <span className="rounded-full border border-[rgba(246,236,217,0.2)] bg-black/20 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            {formatMinutes(content.durationSeconds)}
          </span>
          <p className="max-w-xs text-sm text-[#C9BBA3] text-balance">
            {isOracion
              ? "Esta oración está en camino. Muy pronto van a poder orarla juntos, con la voz de Lumo."
              : "La narración con la voz de Lumo está en producción. Vuelve pronto para escucharla."}
          </p>
        </div>
      </main>
    );
  }

  if (finished && isOracion) {
    // Cierre de una oración: recogimiento, no celebración. Sin referencia bíblica grande ni CTA de
    // diario (eso es propio de las historias) — solo un momento de silencio, la pregunta para
    // conversar y la posibilidad de marcar que la rezaron hoy.
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 overflow-y-auto bg-[#FAF3EE] px-6 py-14 text-center text-[#2A1F17]">
        <div className="h-3 w-3 rounded-full bg-[#B8791F] shadow-[0_0_18px_5px_rgba(184,121,31,0.35)]" />

        <div>
          <h1 className="font-heading text-2xl font-medium text-balance">{content.title}</h1>
          {content.passages.length > 0 && (
            <p className="mt-2 text-xs text-[#6B5A4A]">Inspirado en {content.passages.join(" · ")}</p>
          )}
        </div>

        {reflection && (
          <p className="max-w-xs font-heading text-[17px] italic leading-relaxed text-[#2A1F17]/90 text-balance">
            {reflection.split("\n\n")[0]}
          </p>
        )}

        {content.conversationQuestions[0] && (
          <div
            className="w-full max-w-sm rounded-2xl border border-[rgba(42,31,23,0.10)] bg-white p-4"
            style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
          >
            <p className="font-heading text-base font-medium text-balance">{content.conversationQuestions[0]}</p>
          </div>
        )}

        <button
          onClick={handleMarkPrayerSaid}
          disabled={prayerSaid}
          className="mt-2 flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full text-base font-semibold transition-colors disabled:opacity-90"
          style={{
            background: prayerSaid ? "transparent" : "linear-gradient(180deg, #F3C878, #F0B860)",
            border: prayerSaid ? "1px solid rgba(42,31,23,0.22)" : "none",
            color: prayerSaid ? "#2A1F17" : "#1F1712",
          }}
        >
          {prayerSaid ? (
            <>
              <Check className="h-4 w-4" /> Ya la recé hoy
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" /> Recé esta oración
            </>
          )}
        </button>

        <Link href="/app/orar" className="text-sm text-[#6B5A4A] underline underline-offset-4">
          Volver a Orar
        </Link>
      </main>
    );
  }

  if (finished && !celebrationSeen) {
    // Primera pantalla al terminar una historia/cuento: celebración pura, sin ninguna tarea
    // todavía (ni pasaje, ni pregunta, ni formulario) — el usuario reportó que caer directo en
    // "escriban su respuesta" apenas termina la escena se sentía como una tarea, no como un
    // cierre cálido (2026-07-27). La reflexión y el guardado en el Diario siguen existiendo,
    // un paso después de este.
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 overflow-y-auto bg-[#FAF3EE] px-6 py-14 text-center text-[#2A1F17]">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <LumoPortrait pose="lumo-feliz" size={140} />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h1 className="font-heading text-2xl font-medium text-balance">
            ¡Qué lindo momento compartieron!
          </h1>
          <p className="mt-2 max-w-xs text-[15px] text-[#6B5A4A] text-balance">
            {content.title}
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 h-14 w-full max-w-sm rounded-full text-base font-semibold"
          style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)", color: "#1F1712" }}
          onClick={() => setCelebrationSeen(true)}
        >
          Continuar
        </motion.button>
      </main>
    );
  }

  if (finished) {
    // Cierre de historia fusionado con la captura del diario — sin navegar a otra pantalla
    // (misma idea que el cierre de Orar). La secuencia es una sola experiencia continua:
    // celebración → pasaje → reflexión → guardar este momento → cierre. El usuario nunca "va al
    // Diario"; guarda un momento, y ese momento aparece ahí después.
    if (momentSaved) {
      const milestone = momentSaved === "done" ? null : momentSaved;
      return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-5 overflow-y-auto bg-[#FAF3EE] px-6 py-14 text-center text-[#2A1F17]">
          <LumoPortrait pose="lumo-feliz" size={milestone ? 150 : 110} />
          <h1 className="font-heading text-2xl font-medium text-balance">
            {milestone ? `¡Hito alcanzado: ${milestone.titulo}!` : "Este momento ya forma parte de su Diario."}
          </h1>
          <p className="max-w-xs text-[15px] text-[#6B5A4A]">
            {milestone ? milestone.detalle + "." : "Van a poder volver a encontrarlo cuando quieran."}
          </p>

          {related && (
            <Link
              href={`/app/historia/${related.id}`}
              className="mt-2 flex w-full max-w-sm items-center justify-between rounded-2xl border border-[rgba(42,31,23,0.10)] bg-white p-4 text-left"
              style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
            >
              <span>
                <span className="block text-xs text-[#6B5A4A]">Seguir escuchando</span>
                <span className="font-heading text-base font-medium">{related.title}</span>
              </span>
              <SkipForward className="h-5 w-5 text-[#B8791F]" />
            </Link>
          )}

          <button
            className="mt-2 h-14 w-full max-w-sm rounded-full text-base font-semibold text-[#1F1712]"
            style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
            onClick={() => router.push("/app")}
          >
            Volver al inicio
          </button>
        </main>
      );
    }

    return (
      <main className="flex min-h-dvh flex-col items-center gap-5 overflow-y-auto bg-[#FAF3EE] px-6 pb-10 pt-14 text-center text-[#2A1F17]">
        {content.passages.length > 0 ? (
          <>
            <BookOpen className="h-9 w-9 text-[#B8791F]" />
            <div>
              <p className="text-sm text-[#6B5A4A]">Esta historia está basada en</p>
              <h1 className="mt-1 font-heading text-2xl font-medium text-balance">
                {content.passages.join(" · ")}
              </h1>
              <p className="mt-3 max-w-xs text-sm text-[#6B5A4A] text-balance">
                Esta historia está basada en las Escrituras. Te invitamos a leer el pasaje completo en familia.
              </p>
            </div>
            {passageLink && (
              <a
                href={passageLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#B8791F] underline underline-offset-4"
              >
                Leer el pasaje completo
              </a>
            )}
          </>
        ) : (
          // Cuentos con valores (sin origen bíblico) no tienen passages — no se inventa una
          // referencia que no existe, se pasa directo a la reflexión.
          <h1 className="mt-1 font-heading text-2xl font-medium text-balance">{content.title}</h1>
        )}

        {reflection && (
          <p className="max-w-sm font-heading text-[17px] italic leading-relaxed text-[#2A1F17]/90 text-balance">
            {reflection.split("\n\n")[0]}
          </p>
        )}

        {content.conversationQuestions[0] && (
          <div
            className="w-full max-w-sm rounded-2xl border border-[rgba(42,31,23,0.10)] bg-white p-4"
            style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
          >
            <p className="font-heading text-base font-medium text-balance">
              {content.conversationQuestions[0]}
            </p>
          </div>
        )}

        <div className="flex w-full max-w-sm gap-6 border-b border-[rgba(42,31,23,0.10)] pb-0 text-sm font-semibold">
          <button
            onClick={() => setMomentMode("voz")}
            className={`border-b pb-2 transition-colors ${momentMode === "voz" ? "border-[#B8791F] text-[#2A1F17]" : "border-transparent text-[#6B5A4A]"}`}
          >
            Con la voz
          </button>
          <button
            onClick={() => setMomentMode("texto")}
            className={`border-b pb-2 transition-colors ${momentMode === "texto" ? "border-[#B8791F] text-[#2A1F17]" : "border-transparent text-[#6B5A4A]"}`}
          >
            Escribiendo
          </button>
        </div>

        <div className="w-full max-w-sm">
          {momentMode === "voz" ? (
            <VoiceRecorder value={momentAudio} onChange={setMomentAudio} />
          ) : (
            <textarea
              value={momentAnswer}
              onChange={(e) => setMomentAnswer(e.target.value)}
              rows={4}
              placeholder="Escriban su respuesta…"
              autoFocus
              className="w-full rounded-xl border border-[rgba(42,31,23,0.14)] bg-white p-3 text-sm text-[#2A1F17] outline-none placeholder:text-[#6B5A4A]/70 focus-visible:border-[#B8791F]"
            />
          )}
        </div>

        <button
          disabled={!momentAnswer.trim() && !momentAudio}
          className="mt-2 h-14 w-full max-w-sm rounded-full text-base font-semibold disabled:opacity-40"
          style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)", color: "#1F1712" }}
          onClick={() => {
            const story = getStory(id);
            if (!story) return;
            const before = readApp().ritualNights;
            completeStory(story, momentAnswer.trim(), momentAudio);
            const milestone = newlyReachedMilestone(before, before + 1);
            setMomentSaved(milestone ?? "done");
          }}
        >
          Guardar este momento
        </button>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#100B08]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (!isLast) {
            lastSaveRef.current = 0;
            setIndex((i) => i + 1);
          } else {
            setFinished(true);
            if (content) clearProgress(content.id);
          }
        }}
      />
      <audio ref={musicRef} />
      <audio ref={sfxRef} />

      <EpisodeIllustration
        content={content}
        segmentIndex={index}
        mood={scene.mood}
        animated
        className="absolute inset-0"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/40" />

      <button
        onClick={() => {
          audioRef.current?.pause();
          musicRef.current?.pause();
          router.push(exitHref);
        }}
        aria-label="Cerrar"
        className="absolute right-4 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
      >
        <X className="h-5 w-5" />
      </button>

      {isOracion ? (
        // Progreso continuo, no por escenas — una oración es un solo momento que fluye, no una
        // sucesión de escenas que "marcar" una por una.
        <div className="absolute left-4 right-4 top-6 z-10 h-[3px] overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-[#F3C878] transition-[width] duration-500 ease-out"
            style={{ width: `${((index + 1) / content.segments.length) * 100}%` }}
          />
        </div>
      ) : (
        <div className="absolute left-4 right-4 top-6 z-10 flex justify-center gap-1.5">
          {content.segments.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= index ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 px-6 pb-10">
        <AnimatePresence mode="wait">
          {cueText && (
            <motion.p
              key={cueText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isOracion ? 0.45 : 0.2 }}
              className={
                isOracion
                  ? "text-center font-heading text-xl italic leading-relaxed text-white text-balance"
                  : "text-center text-lg font-medium leading-snug text-white text-balance"
              }
            >
              {cueText}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Escena anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="flex h-16 w-16 items-center justify-center rounded-full text-foreground"
            style={isOracion ? { background: "linear-gradient(180deg, #F3C878, #F0B860)" } : { background: "#fff" }}
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button
            onClick={goNext}
            aria-label="Siguiente escena"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/80"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
