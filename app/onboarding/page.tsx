"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { StepTransition } from "@/components/onboarding/step-transition";
import { WorldBackdrop } from "@/components/app/world-backdrop";
import { readOnboarding, writeOnboarding } from "@/lib/onboarding-store";

const TOTAL_STEPS = 2;

/**
 * Onboarding como entrada al mundo de Lumo, no un formulario de cuenta (decisión del usuario,
 * 2026-07-20). Solo 2 pasos: nombre y llegada — termina justo cuando la familia está lista para
 * empezar, sin fabricar un "primer recuerdo" antes de vivir una historia real. El Diario se
 * llena recién cuando terminen su primera historia de verdad en /reproducir/[id] (ese cierre ya
 * guarda el recuerdo ahí — ver la sesión de Diario). Se eliminaron el paso de "crear cuenta" (sin
 * backend real todavía) y la edad del niño (sin uso hoy en la app).
 */
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [childName, setChildName] = useState("");

  useEffect(() => {
    const saved = readOnboarding();
    if (saved.childName) setChildName(saved.childName);
  }, []);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  return (
    <main className="relative min-h-dvh text-[#F6ECD9]">
      <WorldBackdrop src="/lumo-art/world-home.png" alt="Una casa cálida iluminada en una colina, de noche" />
      <div className="relative z-10 flex min-h-dvh flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-sm">
          <ProgressBar step={step + 1} total={TOTAL_STEPS} />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
          <StepTransition stepKey={String(step)}>
            {step === 0 && (
              <div className="flex flex-col items-center gap-5 text-center">
                <LumoPortrait pose="lumo-volando" size={100} />
                <h1 className="font-heading text-2xl font-medium text-balance">Bienvenidos a Lumo</h1>
                <p className="text-sm text-[#C9BBA3]">¿Cómo se llama su hijo o hija?</p>
                <input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Su nombre"
                  autoFocus
                  className="h-12 w-full rounded-xl border border-[rgba(246,236,217,0.18)] bg-[rgba(246,236,217,0.04)] px-4 text-center text-base text-[#F6ECD9] outline-none placeholder:text-[#C9BBA3]/70 focus-visible:border-[#F3C878]"
                />
                <button
                  disabled={!childName.trim()}
                  className="h-13 w-full rounded-full text-base font-semibold text-[#1F1712] disabled:opacity-40"
                  style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
                  onClick={() => {
                    writeOnboarding({ childName });
                    next();
                  }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 1 && <TodoListoStep childName={childName} />}
          </StepTransition>
        </div>
      </div>
    </main>
  );
}

function TodoListoStep({ childName }: { childName: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <LumoPortrait pose="lumo-feliz" size={100} />
      <h1 className="font-heading text-2xl font-medium text-balance">
        {childName ? `${childName} los está esperando` : "Todo listo para empezar"}
      </h1>
      <p className="text-[15px] text-[#C9BBA3]">
        Esta noche, elijan su primera historia y escúchenla juntos.
      </p>
      <button
        className="h-14 w-full rounded-full text-base font-semibold text-[#1F1712]"
        style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
        onClick={() => router.push("/app")}
      >
        Entrar
      </button>
    </div>
  );
}
