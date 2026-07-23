"use client";

/**
 * Estado del onboarding en localStorage — versionado (26-AUTH-MODERNO.md §"anónimo→cuenta").
 * Se guarda tras CADA respuesta. Cuando exista Supabase (Sesión 6), este mismo shape se migra
 * al servidor en el primer login — nunca se pisa en silencio si el servidor ya tiene datos.
 */

const KEY = "lumo_onboarding_v1";

export type OnboardingState = {
  v: 1;
  childName: string;
  childAge: number | null;
  faithTradition: "cristiana" | null;
  diaryEntry: string;
  diaryAudio: string | null;
  email: string;
  trialStarted: boolean;
};

const DEFAULT_STATE: OnboardingState = {
  v: 1,
  childName: "",
  childAge: null,
  faithTradition: null,
  diaryEntry: "",
  diaryAudio: null,
  email: "",
  trialStarted: false,
};

export function readOnboarding(): OnboardingState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeOnboarding(patch: Partial<OnboardingState>): OnboardingState {
  const next = { ...readOnboarding(), ...patch };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}
