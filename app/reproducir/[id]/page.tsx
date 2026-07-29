"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Check, Heart, Pause, Play, RotateCcw, RotateCw, SkipForward, X } from "lucide-react";
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
  const isEvangelio = content?.contentType === "evangelio";
  const isMeditacion = content?.contentType === "meditacion";
  const gateType = isOracion ? "oracion" : isEvangelio ? "evangelio" : isMeditacion ? "meditacion" : "historia";
  const kindLabel = isOracion
    ? "Oración guiada"
    : isEvangelio
      ? "Evangelio del día"
      : isMeditacion
        ? "Meditación guiada"
        : "Historia narrada";

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [audioSegments, setAudioSegments] = useState<AudioSegment[] | null | undefined>(undefined);
  const [cueText, setCueText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [tab, setTab] = useState<"narracion" | "leer" | "actividades">("narracion");
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
  const exitHref = isOracion
    ? "/app/orar"
    : isEvangelio || isMeditacion
      ? "/app"
      : `/app/historia/${id}`;

  function formatMinutes(seconds: number) {
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} min`;
  }

  function formatClock(seconds: number) {
    const total = Math.max(0, Math.round(seconds));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // Duración de cada segmento estimada por el último cue (no hay duration explícito en el
  // registro de audio) — alcanza para una barra de progreso continua entre segmentos.
  const segmentDurations = useMemo(
    () => (audioSegments ?? []).map((s) => (s.cues.length ? s.cues[s.cues.length - 1].end : 0)),
    [audioSegments],
  );
  const totalDuration = segmentDurations.reduce((a, b) => a + b, 0);
  const elapsedBeforeSegment = segmentDurations.slice(0, index).reduce((a, b) => a + b, 0);
  const elapsed = elapsedBeforeSegment + currentTime;

  function seek(deltaSeconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const segmentDuration = segmentDurations[index] || audio.duration || 0;
    audio.currentTime = Math.min(Math.max(audio.currentTime + deltaSeconds, 0), segmentDuration);
  }

  function handleMarkPrayerSaid() {
    if (!content) return;
    markPrayerSaid(content.id);
    setPrayerSaid(true);
  }

  if (!content || !scene) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#FDFCF9] px-4 text-center">
        <p className="text-[#5A564F]">No encontramos este contenido.</p>
      </main>
    );
  }

  if (appState === undefined) {
    return <main className="min-h-dvh bg-[#FDFCF9]" />;
  }

  // Onboarding → Home → una historia completa, gratis. Cualquier otra historia, o cualquier
  // oración, requiere Paywall — salvo que ya sea suscriptora o ya la hayan vivido antes.
  if (isGated(appState, content.id, gateType)) {
    return (
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1A1836]">
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
              "linear-gradient(0deg, #1A1836 0%, rgba(16,11,8,0.6) 45%, rgba(16,11,8,0.25) 100%)",
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
          <span className="text-xs font-semibold uppercase tracking-wide text-[#F7C948]">
            {kindLabel}
          </span>
          <h1 className="font-heading text-xl font-medium text-white text-balance">{content.title}</h1>
          <p className="max-w-xs text-sm text-[#C9BBA3] text-balance">
            {isTrialExpired(appState)
              ? "Tu semana gratuita ya terminó. Con Premium puedes seguir eligiendo cualquier historia."
              : "Hoy la historia gratis es otra — con Premium puedes elegir esta ahora mismo, sin esperar."}
          </p>
          <Link
            href="/paywall"
            className="flex h-14 w-full max-w-xs items-center justify-center rounded-full text-base font-semibold text-[#2D2A26]"
            style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)" }}
          >
            Ver planes
          </Link>
        </div>
      </main>
    );
  }

  function handleTimeUpdate() {
    const time = audioRef.current?.currentTime ?? 0;
    setCurrentTime(time);

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
    return <main className="min-h-dvh bg-[#FDFCF9]" />;
  }

  if (!audioReady && !finished) {
    // Sin audio real todavía — es el estado inicial esperado de todo el catálogo, no una excepción
    // ni una pantalla rota. Misma calidad visual que el reproductor: portada, título y duración,
    // más un mensaje que se siente como una promesa ("va a estar") en vez de un aviso de error.
    return (
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1A1836]">
        <EpisodeIllustration
          content={content}
          segmentIndex={0}
          mood={content.segments[0].mood}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1836] via-[#1A1836]/40 to-transparent" />
        <button
          onClick={() => router.push(exitHref)}
          aria-label="Cerrar"
          className="absolute right-4 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative z-10 mt-auto flex flex-col items-center gap-3 px-6 pb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#F7C948]">
            {kindLabel}
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
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 overflow-y-auto bg-[#FDFCF9] px-6 py-14 text-center text-[#2D2A26]">
        <div className="h-3 w-3 rounded-full bg-[#B8912A] shadow-[0_0_18px_5px_rgba(184,121,31,0.35)]" />

        <div>
          <h1 className="font-heading text-2xl font-medium text-balance">{content.title}</h1>
          {content.passages.length > 0 && (
            <p className="mt-2 text-xs text-[#5A564F]">Inspirado en {content.passages.join(" · ")}</p>
          )}
        </div>

        {reflection && (
          <p className="max-w-xs font-heading text-[17px] italic leading-relaxed text-[#2D2A26]/90 text-balance">
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
            background: prayerSaid ? "transparent" : "linear-gradient(180deg, #F7C948, #F5A300)",
            border: prayerSaid ? "1px solid rgba(42,31,23,0.22)" : "none",
            color: prayerSaid ? "#2D2A26" : "#2D2A26",
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

        <Link href="/app/orar" className="text-sm text-[#5A564F] underline underline-offset-4">
          Volver a Orar
        </Link>
      </main>
    );
  }

  if (finished && !celebrationSeen) {
    // Primera pantalla al terminar una historia/cuento: celebración con forma de "logro", no un
    // formulario. Usa solo datos que YA existen en el catálogo (title, description,
    // conversationQuestions) — nada de contenido nuevo tipo "Fun Facts" inventado para la
    // ocasión (2026-07-27). La reflexión y el guardado en el Diario siguen un paso después.
    async function handleShare() {
      const shareData = { title: content!.title, text: `Escuchamos "${content!.title}" en Lumo.` };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch {
          // el usuario canceló el share nativo — no es un error, no hacer nada
        }
      }
    }

    function handleReplay() {
      lastSaveRef.current = 0;
      setIndex(0);
      setFinished(false);
      setCelebrationSeen(false);
      setPlaying(true);
    }

    return (
      <main className="flex min-h-dvh flex-col items-center gap-5 overflow-y-auto bg-[#FDFCF9] px-5 pb-10 pt-14 text-center text-[#2D2A26]">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="rounded-full p-1"
          style={{ boxShadow: "0 0 0 4px #FDFCF9, 0 0 24px 6px rgba(255,215,64,0.45)" }}
        >
          <LumoPortrait pose="lumo-feliz" size={110} />
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <p className="text-caption font-heading font-semibold" style={{ color: "#B8912A" }}>
            ¡Felicitaciones!
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-balance">
            {isOracion ? "Oración completa" : "Historia completa"}
          </h1>
          <p className="mt-1 text-[15px] text-[#5A564F] text-balance">{content.title}</p>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex w-full max-w-sm gap-3"
        >
          <button
            onClick={handleShare}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold"
            style={{ background: "rgba(184,121,31,0.08)", color: "#B8912A" }}
          >
            Compartir
          </button>
          <button
            onClick={() => setCelebrationSeen(true)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #F5B800, #F7C35C)", color: "#2D2A26" }}
          >
            Guardar momento
          </button>
        </motion.div>

        {content.description && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full max-w-sm rounded-2xl bg-white p-4 text-left"
            style={{ boxShadow: "0 12px 30px -14px rgba(28,23,18,0.18)" }}
          >
            <p className="text-caption font-semibold" style={{ color: "#B8912A" }}>
              Lo que compartieron
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#2D2A26]">{content.description}</p>
          </motion.div>
        )}

        {content.conversationQuestions[0] && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="w-full max-w-sm rounded-2xl bg-white p-4 text-left"
            style={{ boxShadow: "0 12px 30px -14px rgba(28,23,18,0.18)" }}
          >
            <p className="text-caption font-semibold" style={{ color: "#B8912A" }}>
              Para conversar
            </p>
            <p className="mt-2 font-heading text-[15px] leading-relaxed text-[#2D2A26]">
              {content.conversationQuestions[0]}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-2 flex w-full max-w-sm gap-3"
        >
          <button
            onClick={handleReplay}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold"
            style={{ borderColor: "#EFEDE8", color: "#5A564F" }}
          >
            Escuchar de nuevo
          </button>
          <button
            onClick={() => router.push("/app")}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold"
            style={{ borderColor: "#EFEDE8", color: "#5A564F" }}
          >
            Inicio
          </button>
        </motion.div>
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
        <main className="flex min-h-dvh flex-col items-center justify-center gap-5 overflow-y-auto bg-[#FDFCF9] px-6 py-14 text-center text-[#2D2A26]">
          <LumoPortrait pose="lumo-feliz" size={milestone ? 150 : 110} />
          <h1 className="font-heading text-2xl font-medium text-balance">
            {milestone ? `¡Hito alcanzado: ${milestone.titulo}!` : "Este momento ya forma parte de su Diario."}
          </h1>
          <p className="max-w-xs text-[15px] text-[#5A564F]">
            {milestone ? milestone.detalle + "." : "Van a poder volver a encontrarlo cuando quieran."}
          </p>

          {related && (
            <Link
              href={`/app/historia/${related.id}`}
              className="mt-2 flex w-full max-w-sm items-center justify-between rounded-2xl border border-[rgba(42,31,23,0.10)] bg-white p-4 text-left"
              style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
            >
              <span>
                <span className="block text-xs text-[#5A564F]">Seguir escuchando</span>
                <span className="font-heading text-base font-medium">{related.title}</span>
              </span>
              <SkipForward className="h-5 w-5 text-[#B8912A]" />
            </Link>
          )}

          <button
            className="mt-2 h-14 w-full max-w-sm rounded-full text-base font-semibold text-[#2D2A26]"
            style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)" }}
            onClick={() => router.push("/app")}
          >
            Volver al inicio
          </button>
        </main>
      );
    }

    return (
      <main className="flex min-h-dvh flex-col items-center gap-5 overflow-y-auto bg-[#FDFCF9] px-6 pb-10 pt-14 text-center text-[#2D2A26]">
        {content.passages.length > 0 ? (
          <>
            <BookOpen className="h-9 w-9 text-[#B8912A]" />
            <div>
              <p className="text-sm text-[#5A564F]">Esta historia está basada en</p>
              <h1 className="mt-1 font-heading text-2xl font-medium text-balance">
                {content.passages.join(" · ")}
              </h1>
              <p className="mt-3 max-w-xs text-sm text-[#5A564F] text-balance">
                Esta historia está basada en las Escrituras. Te invitamos a leer el pasaje completo en familia.
              </p>
            </div>
            {passageLink && (
              <a
                href={passageLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#B8912A] underline underline-offset-4"
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
          <p className="max-w-sm font-heading text-[17px] italic leading-relaxed text-[#2D2A26]/90 text-balance">
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
            className={`border-b pb-2 transition-colors ${momentMode === "voz" ? "border-[#B8912A] text-[#2D2A26]" : "border-transparent text-[#5A564F]"}`}
          >
            Con la voz
          </button>
          <button
            onClick={() => setMomentMode("texto")}
            className={`border-b pb-2 transition-colors ${momentMode === "texto" ? "border-[#B8912A] text-[#2D2A26]" : "border-transparent text-[#5A564F]"}`}
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
              className="w-full rounded-xl border border-[rgba(42,31,23,0.14)] bg-white p-3 text-sm text-[#2D2A26] outline-none placeholder:text-[#5A564F]/70 focus-visible:border-[#B8912A]"
            />
          )}
        </div>

        <button
          disabled={!momentAnswer.trim() && !momentAudio}
          className="mt-2 h-14 w-full max-w-sm rounded-full text-base font-semibold disabled:opacity-40"
          style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", color: "#2D2A26" }}
          onClick={() => {
            const before = readApp().ritualNights;
            completeStory(
              { id: content.id, title: content.title, reflectionQuestion: content.conversationQuestions[0] ?? "" },
              momentAnswer.trim(),
              momentAudio,
            );
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
    <main
      className="relative flex min-h-dvh flex-col items-center gap-5 overflow-y-auto px-5 pb-10 pt-6"
      style={{ background: "var(--night-gradient)" }}
    >
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

      <div className="flex w-full max-w-sm items-center justify-end">
        <button
          onClick={() => {
            audioRef.current?.pause();
            musicRef.current?.pause();
            router.push(exitHref);
          }}
          aria-label="Cerrar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Imagen dentro de una card con esquinas redondeadas — no a pantalla completa. */}
      <div
        className="relative aspect-[4/5] w-full max-w-sm shrink-0 overflow-hidden rounded-[28px]"
        style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5)" }}
      >
        <EpisodeIllustration
          content={content}
          segmentIndex={index}
          mood={scene.mood}
          animated
          className="absolute inset-0"
        />
      </div>

      <div className="w-full max-w-sm text-center text-white">
        <h1 className="font-heading text-h2 leading-snug text-balance">{content.title}</h1>
        {content.passages.length > 0 && (
          <p className="mt-1 text-[13px] text-white/60">{content.passages.join(" · ")}</p>
        )}
      </div>

      <div className="w-full max-w-sm">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#F5B800] transition-[width] duration-300 ease-out"
            style={{ width: totalDuration > 0 ? `${Math.min(100, (elapsed / totalDuration) * 100)}%` : "0%" }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-white/50">
          <span>{formatClock(elapsed)}</span>
          <span>{formatClock(totalDuration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-7">
        <button
          onClick={() => seek(-10)}
          aria-label="Retroceder 10 segundos"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/80"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="flex h-16 w-16 items-center justify-center rounded-full text-[#2D2A26]"
          style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", boxShadow: "var(--shadow-button)" }}
        >
          {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button
          onClick={() => seek(10)}
          aria-label="Avanzar 10 segundos"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/80"
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs — Narración (default), Leer (pasaje/texto real), Actividades (estado vacío honesto). */}
      <div className="flex w-full max-w-sm justify-center gap-6 border-b border-white/10 pb-0 text-sm font-bold">
        {(["narracion", "leer", "actividades"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 pb-2.5 transition-colors ${
              tab === t ? "border-[#F5B800] text-white" : "border-transparent text-white/50"
            }`}
          >
            {t === "narracion" ? "Narración" : t === "leer" ? "Leer" : "Actividades"}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm">
        {tab === "leer" && (
          <div className="rounded-[20px] bg-white/8 p-4 text-[14px] leading-relaxed text-white/85">
            {passageLink && (
              <a href={passageLink} target="_blank" rel="noopener noreferrer" className="mb-3 block font-bold text-[#F5B800] underline underline-offset-4">
                Leer el pasaje completo
              </a>
            )}
            <p className="whitespace-pre-line">{scene.caption}</p>
          </div>
        )}
        {tab === "actividades" && (
          <div className="flex flex-col items-center gap-2 rounded-[20px] bg-white/8 p-6 text-center">
            <LumoPortrait pose="lumo-frontal" size={44} />
            <p className="max-w-[26ch] text-[13px] text-white/70">
              Todavía no hay actividades para esta historia. Muy pronto.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
