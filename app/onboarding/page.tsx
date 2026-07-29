"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, HandHeart, Smile, BookOpen, Music, Moon } from "lucide-react";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { ArtAsset } from "@/components/app/art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { StepTransition } from "@/components/onboarding/step-transition";
import { LumoButton } from "@/components/lumo-ui/button";
import { SelectCard, CategoryAccent } from "@/components/lumo-ui/select-card";
import { ImageSelectCard } from "@/components/lumo-ui/image-select-card";
import { LoadingLumo } from "@/components/lumo-ui/loading-lumo";
import { Confetti } from "@/components/lumo-ui/confetti";
import { readOnboarding, writeOnboarding, FocusArea } from "@/lib/onboarding-store";

const TOTAL_STEPS = 6;

const AUDIENCE_OPTIONS: { value: "hija" | "hijo" | "familia"; label: string; accent: CategoryAccent; image: string }[] = [
  { value: "hija", label: "Mi hija", accent: "pink", image: "onboarding-para-quien-hija" },
  { value: "hijo", label: "Mi hijo", accent: "blue", image: "onboarding-para-quien-hijo" },
  { value: "familia", label: "Toda la familia", accent: "green", image: "onboarding-para-quien-familia" },
];

const AGE_OPTIONS: { value: number; label: string; accent: CategoryAccent; image: string }[] = [
  { value: 4, label: "3-5 años", accent: "purple", image: "onboarding-edad-3-5" },
  { value: 7, label: "6-8 años", accent: "blue", image: "onboarding-edad-6-8" },
  { value: 10, label: "9-12 años", accent: "green", image: "onboarding-edad-9-12" },
];

const FOCUS_OPTIONS: { value: FocusArea; label: string; accent: CategoryAccent; icon: React.ReactNode }[] = [
  { value: "valores", label: "Valores", accent: "red", icon: <Heart className="h-6 w-6 text-[#F26B6B]" /> },
  { value: "fe", label: "Fe", accent: "purple", icon: <HandHeart className="h-6 w-6 text-[#9B87F5]" /> },
  { value: "gratitud", label: "Gratitud", accent: "green", icon: <Smile className="h-6 w-6 text-[#6BCB77]" /> },
  { value: "historias", label: "Historias", accent: "purple", icon: <BookOpen className="h-6 w-6 text-[#9B87F5]" /> },
  { value: "musica", label: "Música", accent: "blue", icon: <Music className="h-6 w-6 text-[#5B9BD5]" /> },
  { value: "rutinas", label: "Rutinas para dormir", accent: "purple", icon: <Moon className="h-6 w-6 text-[#9B87F5]" /> },
];

/**
 * Onboarding de 6 pasos + pantalla final (2026-07-28, rebrand "Estrella") — bienvenida, para
 * quién, edad, qué desea fortalecer, casi listo, preparando (loading animado), y el resultado.
 * "Para quién" solo cambia copy; "edad" y "qué desea fortalecer" se guardan y el segundo se usa
 * de verdad en todaysStory() (lib/app-data.ts) — nunca se fabrica un dato sin uso real.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [childName, setChildName] = useState("");
  const [audience, setAudience] = useState<"hija" | "hijo" | "familia" | null>(null);
  const [childAge, setChildAge] = useState<number | null>(null);
  const [focusArea, setFocusArea] = useState<FocusArea | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [prepareProgress, setPrepareProgress] = useState(0);

  useEffect(() => {
    const saved = readOnboarding();
    if (saved.childName) setChildName(saved.childName);
    if (saved.audience) setAudience(saved.audience);
    if (saved.childAge) setChildAge(saved.childAge);
    if (saved.focusArea) setFocusArea(saved.focusArea);
  }, []);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Paso "preparando" — loading real de ~1.8s antes de mostrar la pantalla final, con una
  // barra de progreso que avanza en el mismo lapso (no es una carga real de datos, es el ritmo
  // de la transición — por eso el % es simulado pero el tiempo de espera sí es real).
  useEffect(() => {
    if (step !== 4 || !preparing) return;
    setPrepareProgress(0);
    const start = Date.now();
    const DURATION = 1800;
    const interval = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION) * 100);
      setPrepareProgress(pct);
    }, 50);
    const id = setTimeout(() => {
      clearInterval(interval);
      setStep(5);
      setPreparing(false);
    }, DURATION);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, [step, preparing]);

  const childLabel = childName || (audience === "hijo" ? "tu hijo" : audience === "hija" ? "tu hija" : "tu familia");

  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none absolute -left-16 -top-10 h-56 w-56 rounded-full bg-category-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-category-purple/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-category-green/20 blur-3xl" />
      {step === 5 && <Confetti />}

      <div className="relative z-10 flex min-h-dvh flex-col px-5 py-6">
        <div className="mx-auto flex w-full max-w-sm items-center gap-3">
          {step > 0 && step < 5 && (
            <button
              onClick={back}
              aria-label="Volver"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-foreground"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {step < 5 && <ProgressBar step={step + 1} total={TOTAL_STEPS} />}
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
          <StepTransition stepKey={String(step)}>
            {step === 0 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <div
                  className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[28px]"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <ArtAsset
                    slug="onboarding-bienvenida"
                    alt="Un niño sonriendo con un libro brillante de Lumo"
                    fallback={<MoodScene mood="family" />}
                    className="absolute inset-0"
                  />
                </div>
                <h1 className="font-heading text-2xl font-semibold text-balance">
                  ¡Bienvenido a <span style={{ color: "#F5B800" }}>Lumo</span>!
                </h1>
                <p className="text-[15px] text-muted-foreground text-balance">
                  Una aventura para descubrir las historias más increíbles de la Biblia.
                </p>
                <LumoButton className="w-full" onClick={next}>
                  Comenzar
                </LumoButton>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <h1 className="font-heading text-2xl font-semibold text-balance">¿Para quién será Lumo?</h1>
                <div className="flex w-full gap-3">
                  {AUDIENCE_OPTIONS.map((o) => (
                    <ImageSelectCard
                      key={o.value}
                      label={o.label}
                      imageSlug={o.image}
                      accent={o.accent}
                      selected={audience === o.value}
                      onClick={() => setAudience(o.value)}
                    />
                  ))}
                </div>
                <input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Su nombre (opcional)"
                  className="h-12 w-full rounded-xl border border-[rgba(16,32,74,0.14)] bg-white px-4 text-center text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary"
                />
                <LumoButton
                  className="w-full"
                  disabled={!audience}
                  onClick={() => {
                    writeOnboarding({ audience, childName });
                    next();
                  }}
                >
                  Continuar
                </LumoButton>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <h1 className="font-heading text-2xl font-semibold text-balance">¿Qué edad tiene?</h1>
                <p className="text-sm text-muted-foreground">Así adaptamos el tono de las historias.</p>
                <div className="flex w-full gap-3">
                  {AGE_OPTIONS.map((o) => (
                    <ImageSelectCard
                      key={o.value}
                      label={o.label}
                      imageSlug={o.image}
                      accent={o.accent}
                      selected={childAge === o.value}
                      onClick={() => setChildAge(o.value)}
                    />
                  ))}
                </div>
                <LumoButton
                  className="w-full"
                  disabled={!childAge}
                  onClick={() => {
                    writeOnboarding({ childAge });
                    next();
                  }}
                >
                  Continuar
                </LumoButton>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <h1 className="font-heading text-2xl font-semibold text-balance">¿Qué desean fortalecer?</h1>
                <div className="grid w-full grid-cols-2 gap-3">
                  {FOCUS_OPTIONS.map((o) => (
                    <SelectCard
                      key={o.value}
                      label={o.label}
                      icon={o.icon}
                      accent={o.accent}
                      selected={focusArea === o.value}
                      onClick={() => setFocusArea(o.value)}
                    />
                  ))}
                </div>
                <LumoButton
                  className="w-full"
                  disabled={!focusArea}
                  onClick={() => {
                    writeOnboarding({ focusArea });
                    next();
                  }}
                >
                  Continuar
                </LumoButton>
              </div>
            )}

            {step === 4 && !preparing && (
              <div className="flex flex-col items-center gap-5 text-center">
                <div
                  className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-[28px]"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <ArtAsset
                    slug="onboarding-casi-listo"
                    alt="Una familia leyendo el libro de Lumo juntos"
                    fallback={<MoodScene mood="family" />}
                    className="absolute inset-0"
                  />
                </div>
                <h1 className="font-heading text-2xl font-semibold text-balance">Casi listo</h1>
                <p className="text-[15px] text-muted-foreground text-balance">
                  Cada día será una nueva aventura llena de aprendizaje.
                </p>
                <LumoButton
                  className="w-full"
                  onClick={() => {
                    writeOnboarding({ childName });
                    setPreparing(true);
                  }}
                >
                  Continuar
                </LumoButton>
              </div>
            )}

            {step === 4 && preparing && (
              <LoadingLumo
                messages={["Estamos preparando tu experiencia personalizada"]}
                progress={prepareProgress}
                progressLabel="Personalizando la experiencia…"
              />
            )}

            {step === 5 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <LumoPortrait pose="lumo-feliz" size={120} />
                <h1 className="font-heading text-2xl font-semibold text-balance">¡Todo está listo!</h1>
                <p className="text-[15px] text-muted-foreground text-balance">
                  Preparamos una experiencia para {childLabel}. Esta noche, elijan su primera
                  historia y escúchenla juntos.
                </p>
                <LumoButton className="w-full" onClick={() => router.push("/app")}>
                  Entrar a Lumo
                </LumoButton>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-2.5">
                    {["#F06BA8", "#5B9BD5", "#6BCB77", "#9B87F5"].map((c, i) => (
                      <div
                        key={i}
                        className="h-7 w-7 rounded-full border-2 border-white"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    Miles de familias ya aprenden jugando ❤️
                  </p>
                </div>
              </div>
            )}
          </StepTransition>
        </div>
      </div>
    </main>
  );
}
