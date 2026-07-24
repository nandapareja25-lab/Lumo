"use client";

import { readOnboarding } from "./onboarding-store";
import { STORIES, Story, getStory } from "./story-catalog";
import { getContentByType } from "./content-catalog";

/**
 * Estado de la app interna en localStorage (interino hasta Supabase, Sesión 6).
 * Loop de retención (Hooked, 24-GAMIFICACION.md):
 *   GATILLO: hora de dormir / notificación futura (Sesión 6-7)
 *   ACCIÓN: abrir el ritual de hoy o explorar la biblioteca
 *   RECOMPENSA: la luz de Lumo crece + la respuesta del niño queda guardada para siempre
 *   INVERSIÓN: el diario y las historias completadas se acumulan (efecto dotación sano,
 *              nunca con culpa ni racha que castigue un día perdido)
 */

const KEY = "lumo_app_v2";

export type DiaryEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  storyId: string;
  storyTitle: string;
  question: string;
  answer: string;
  audioUrl: string | null;
};

/** Progreso real de reproducción sin terminar — permite "Continuar donde quedó" y reanudación
 * exacta en el reproductor. Se guarda mientras el contenido está a medias; se borra al
 * terminarlo (ver `clearProgress`, llamado junto con `completeStory`/`markPrayerSaid`). */
export type ContentProgress = {
  contentId: string;
  segmentIndex: number;
  audioTime: number;
  updatedAt: string; // ISO datetime completo, para ordenar "más reciente primero"
};

export const MILESTONES = [
  { noches: 1, titulo: "Primera noche", detalle: "La primera de muchas noches juntos" },
  { noches: 7, titulo: "Primera semana", detalle: "Una semana de fe en familia" },
  { noches: 30, titulo: "Un mes completo", detalle: "El hábito ya está construido" },
  { noches: 90, titulo: "Un trimestre", detalle: "Una temporada entera juntos" },
] as const;

export type AppState = {
  v: 2;
  childName: string;
  childAge: number | null;
  ritualNights: number;
  lastCompletedDate: string | null; // yyyy-mm-dd
  diaryEntries: DiaryEntry[];
  completedStoryIds: string[];
  favoriteStoryIds: string[];
  versesReadDates: string[];
  prayersSaidIds: string[];
  /** Fecha (yyyy-mm-dd) del primer uso real de la app — arranca la ventana de 7 días gratis. */
  trialStartDate: string | null;
  /** Suscripción simulada (sin backend real todavía, Fase 8) — true desde que tocan "empezar" en Paywall. */
  hasAccess: boolean;
  /** Progreso sin terminar por contenido, clave = contentId. Campo agregado 2026-07-24 — los
   * estados guardados antes de esta fecha simplemente no lo tienen, y `readApp` lo completa con
   * `{}` vía el merge con DEFAULT_STATE, sin romper nada existente. */
  progress: Record<string, ContentProgress>;
};

const DEFAULT_STATE: AppState = {
  v: 2,
  childName: "",
  childAge: null,
  ritualNights: 0,
  lastCompletedDate: null,
  diaryEntries: [],
  completedStoryIds: [],
  favoriteStoryIds: [],
  versesReadDates: [],
  prayersSaidIds: [],
  trialStartDate: null,
  hasAccess: false,
  progress: {},
};

export const ACHIEVEMENTS = [
  {
    id: "constante",
    titulo: "Constante",
    detalle: "7 días",
    unlocked: (s: AppState) => new Set(s.diaryEntries.map((e) => e.date)).size >= 7,
  },
  {
    id: "primer-versiculo",
    titulo: "Aprendido",
    detalle: "Primer versículo",
    unlocked: (s: AppState) => s.versesReadDates.length >= 1,
  },
  {
    id: "lector",
    titulo: "Apasionado",
    detalle: "Lector",
    unlocked: (s: AppState) => s.completedStoryIds.length >= 5,
  },
  {
    id: "bondadoso",
    titulo: "Bondadoso",
    detalle: "Corazón",
    unlocked: (s: AppState) => s.prayersSaidIds.length >= 3,
  },
] as const;

/** Fecha de HOY en hora local (nunca UTC) — debe coincidir siempre con el criterio de
 * `daysSince`, que también calcula la medianoche en hora local. Usar `toISOString()` acá
 * causaba un desfasaje real de un día para usuarios en zonas horarias negativas (ej. UTC-3)
 * durante la noche, generando un `daysSince` negativo y un índice inválido en `todaysStory`. */
function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysSince(dateISO: string): number {
  const start = new Date(`${dateISO}T00:00:00`).getTime();
  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.floor((nowMidnight - start) / 86_400_000);
}

function ensureTrialStart(state: AppState): AppState {
  if (state.trialStartDate) return state;
  return { ...state, trialStartDate: todayISO() };
}

/** Día 1 a 7: semana gratuita. Día 8 en adelante: la semana ya terminó. */
export function trialDayNumber(state: AppState): number {
  if (!state.trialStartDate) return 1;
  return daysSince(state.trialStartDate) + 1;
}

export function isTrialExpired(state: AppState): boolean {
  return trialDayNumber(state) > 7;
}

function migrateFromOnboarding(state: AppState): AppState {
  const onboarding = readOnboarding();
  let next = state;

  // El onboarding actual (2 pasos: nombre → llegada) guarda el nombre en su propio store, no en
  // AppState directamente — siempre hay que copiarlo acá, sin depender de que exista una entrada
  // de diario (eso era del onboarding viejo de 6 pasos, ya no se fabrica un recuerdo de mentira).
  if (!next.childName && onboarding.childName) {
    next = { ...next, childName: onboarding.childName, childAge: onboarding.childAge };
  }

  // Compatibilidad con sesiones viejas del onboarding de 6 pasos, que sí fabricaban un primer
  // recuerdo de Diario durante el onboarding mismo.
  if (next.diaryEntries.length === 0 && (onboarding.diaryEntry || onboarding.diaryAudio)) {
    const story = STORIES[0];
    next = {
      ...next,
      ritualNights: 1,
      lastCompletedDate: todayISO(),
      completedStoryIds: [story.id],
      diaryEntries: [
        {
          id: "onboarding-1",
          date: todayISO(),
          storyId: story.id,
          storyTitle: story.title,
          question: story.reflectionQuestion,
          answer: onboarding.diaryEntry,
          audioUrl: onboarding.diaryAudio ?? null,
        },
      ],
    };
  }

  return next;
}

export function readApp(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const state = parsed?.v === 2 ? { ...DEFAULT_STATE, ...parsed } : DEFAULT_STATE;
    const migrated = ensureTrialStart(migrateFromOnboarding(state));
    if (migrated !== state) writeApp(migrated);
    return migrated;
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeApp(patch: Partial<AppState>): AppState {
  const next = { ...readApp(), ...patch };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function isRitualDoneToday(state: AppState): boolean {
  return state.lastCompletedDate === todayISO();
}

/**
 * La Historia del Día — rota una vez por día calendario (no por cuántas veces completaron el
 * ritual), para que sea la misma para toda la familia ese día, se use o no. Es la única historia
 * (junto con la Oración del Día) que queda fuera del candado durante la semana gratuita.
 */
/** Módulo seguro — nunca negativo, aunque `daysSince` reciba una fecha guardada antes del
 * fix de zona horaria y devuelva un valor negativo. */
function safeIndex(dayIndex: number, length: number): number {
  return ((dayIndex % length) + length) % length;
}

export function todaysStory(): Story {
  const state = readApp();
  const dayIndex = state.trialStartDate ? daysSince(state.trialStartDate) : 0;
  return STORIES[safeIndex(dayIndex, STORIES.length)];
}

/** La Oración del Día — mismo criterio de rotación diaria que `todaysStory`. */
export function todaysPrayerId(state: AppState): string {
  const prayers = getContentByType("oracion");
  const dayIndex = state.trialStartDate ? daysSince(state.trialStartDate) : 0;
  return prayers[safeIndex(dayIndex, prayers.length)].id;
}

export function completeStory(
  story: Story,
  answer: string,
  audioUrl: string | null = null,
): AppState {
  const state = readApp();
  const entry: DiaryEntry = {
    id: `${todayISO()}-${state.diaryEntries.length}`,
    date: todayISO(),
    storyId: story.id,
    storyTitle: story.title,
    question: story.reflectionQuestion,
    answer,
    audioUrl,
  };
  const wasToday = isRitualDoneToday(state);
  return writeApp({
    ritualNights: wasToday ? state.ritualNights : state.ritualNights + 1,
    lastCompletedDate: todayISO(),
    diaryEntries: [entry, ...state.diaryEntries],
    completedStoryIds: state.completedStoryIds.includes(story.id)
      ? state.completedStoryIds
      : [...state.completedStoryIds, story.id],
    progress: withoutKey(state.progress, story.id),
  });
}

/** Se activa al tocar "empezar" en Paywall — simulado hasta que exista cobro real (Fase 8). */
export function unlockAccess(): AppState {
  return writeApp({ hasAccess: true });
}

/**
 * Modelo de acceso (decisión del usuario, 2026-07-22): durante los primeros 7 días, la familia
 * tiene el catálogo completo VISIBLE pero bloqueado — solo la Historia del Día y la Oración del
 * Día están destrancadas, cambian cada día calendario. Al terminar la semana, incluso la Historia
 * del Día queda bloqueada y aparece Paywall. `hasAccess` (suscriptora) siempre desbloquea todo.
 */
export function isGated(state: AppState, contentId: string, contentType: "historia" | "oracion"): boolean {
  if (state.hasAccess) return false;
  if (isTrialExpired(state)) return true;
  if (contentType === "historia") {
    return todaysStory().id !== contentId;
  }
  return todaysPrayerId(state) !== contentId;
}

export function toggleFavorite(storyId: string): AppState {
  const state = readApp();
  const isFav = state.favoriteStoryIds.includes(storyId);
  return writeApp({
    favoriteStoryIds: isFav
      ? state.favoriteStoryIds.filter((id) => id !== storyId)
      : [...state.favoriteStoryIds, storyId],
  });
}

export function isStoryCompleted(storyId: string): boolean {
  return readApp().completedStoryIds.includes(storyId);
}

/** Devuelve el hito recién alcanzado con este ritual (o null) — para celebrarlo, nunca para castigar. */
export function newlyReachedMilestone(previousNights: number, currentNights: number) {
  return MILESTONES.find((m) => m.noches > previousNights && m.noches <= currentNights) ?? null;
}

export function markVerseRead(): AppState {
  const state = readApp();
  const today = todayISO();
  if (state.versesReadDates.includes(today)) return state;
  return writeApp({ versesReadDates: [...state.versesReadDates, today] });
}

export function markPrayerSaid(prayerId: string): AppState {
  const state = readApp();
  if (state.prayersSaidIds.includes(prayerId)) return state;
  return writeApp({ prayersSaidIds: [...state.prayersSaidIds, prayerId], progress: withoutKey(state.progress, prayerId) });
}

function withoutKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  if (!(key in record)) return record;
  const next = { ...record };
  delete next[key];
  return next;
}

/** Guarda en qué segundo/escena quedó un contenido sin terminar — llamar mientras se reproduce,
 * no hace falta throttlear desde afuera (writeApp ya es una sola escritura a localStorage). */
export function saveProgress(contentId: string, segmentIndex: number, audioTime: number): void {
  const state = readApp();
  writeApp({
    progress: {
      ...state.progress,
      [contentId]: { contentId, segmentIndex, audioTime, updatedAt: new Date().toISOString() },
    },
  });
}

export function getProgress(state: AppState, contentId: string): ContentProgress | undefined {
  return state.progress[contentId];
}

/** Se llama al terminar de verdad un contenido (historia u oración) — ya no es "a medias". */
export function clearProgress(contentId: string): void {
  const state = readApp();
  writeApp({ progress: withoutKey(state.progress, contentId) });
}

/** Contenidos a medias, más reciente primero — para "Continuar donde quedó" / historial reciente. */
export function recentInProgress(state: AppState, limit = 3): ContentProgress[] {
  return Object.values(state.progress)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

/**
 * Últimos 7 días (Lun-Dom de la semana actual) con si hubo ritual ese día — NUNCA se "rompe":
 * un día sin marcar solo queda vacío, la racha total (`ritualNights`) sigue sumando siempre.
 */
export function weekDots(state: AppState): { label: string; done: boolean; isToday: boolean }[] {
  const labels = ["L", "M", "M", "J", "V", "S", "D"];
  const completedDates = new Set(state.diaryEntries.map((e) => e.date));
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // lunes=0
  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIndex);

  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { label, done: completedDates.has(iso), isToday: i === todayIndex };
  });
}

export function clearApp() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem("lumo_onboarding_v1");
}

export { getStory };
