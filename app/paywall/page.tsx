"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { readOnboarding } from "@/lib/onboarding-store";
import { isTrialExpired, readApp, trialDayNumber, unlockAccess } from "@/lib/app-data";

const BENEFICIOS = [
  "Eliges cualquier historia, no solo la del día",
  "Categorías, favoritos y novedades cada semana",
  "Todas las oraciones, no solo la de hoy",
];

/**
 * Ya no vende un trial con tarjeta desde acá — la semana gratuita (Historia del Día) ya arrancó
 * sola desde el primer uso (decisión del usuario, 2026-07-22). Este paywall solo explica qué
 * desbloquea Premium: elegir, no solo recibir. Lienzo claro, igual que el resto de la app — esta
 * pantalla es texto y decisión, no una ilustración a pantalla completa (2026-07-22).
 */
export default function PaywallPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"anual" | "mensual">("anual");
  const [starting, setStarting] = useState(false);
  const childName = readOnboarding().childName;
  const state = readApp();
  const expired = isTrialExpired(state);
  const day = trialDayNumber(state);

  function handleStart() {
    setStarting(true);
    unlockAccess();
    setTimeout(() => router.push("/app"), 500);
  }

  return (
    <main className="relative min-h-dvh bg-[#FAF3EE] text-[#2A1F17]">
      <div className="relative z-10 px-4 py-6">
        <button
          onClick={() => router.push("/app")}
          aria-label="Cerrar"
          className="absolute right-4 top-6 flex h-11 w-11 items-center justify-center rounded-full text-[#6B5A4A] hover:bg-[rgba(42,31,23,0.05)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex w-full max-w-sm flex-col gap-7 pt-16">
          <div className="text-center">
            <h1 className="mb-2 font-heading text-2xl font-medium text-balance">
              {expired
                ? "Tu semana gratuita terminó"
                : childName
                  ? `Elige la historia perfecta para ${childName}`
                  : "Elige la historia perfecta para cada momento"}
            </h1>
            <p className="text-sm text-[#6B5A4A]">
              {expired
                ? "Desbloquea una historia para cada momento — no solo la del día."
                : `Hoy es el día ${day} de 7 con una historia gratis distinta cada noche. Con Premium, en vez de esperar la del día, eliges cualquier historia — para ese miedo, esa alegría, ese momento particular.`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setPlan("anual")}
              className="flex items-center justify-between rounded-2xl border p-4 text-left transition-colors"
              style={{
                borderColor: plan === "anual" ? "#B8791F" : "rgba(42,31,23,0.12)",
                background: plan === "anual" ? "rgba(184,121,31,0.06)" : "#FFFFFF",
              }}
            >
              <div>
                <p className="font-heading text-lg font-medium">$3.33/mes</p>
                <p className="text-xs text-[#6B5A4A]">Facturado $39.99/año · plan anual</p>
              </div>
              <span
                className="h-5 w-5 shrink-0 rounded-full border-2"
                style={{
                  borderColor: plan === "anual" ? "#B8791F" : "rgba(42,31,23,0.22)",
                  background: plan === "anual" ? "#B8791F" : "transparent",
                }}
              />
            </button>

            <button
              onClick={() => setPlan("mensual")}
              className="flex items-center justify-between rounded-2xl border p-4 text-left transition-colors"
              style={{
                borderColor: plan === "mensual" ? "#B8791F" : "rgba(42,31,23,0.12)",
                background: plan === "mensual" ? "rgba(184,121,31,0.06)" : "#FFFFFF",
              }}
            >
              <div>
                <p className="font-heading text-lg font-medium">$4.99/mes</p>
                <p className="text-xs text-[#6B5A4A]">Facturado mes a mes</p>
              </div>
              <span
                className="h-5 w-5 shrink-0 rounded-full border-2"
                style={{
                  borderColor: plan === "mensual" ? "#B8791F" : "rgba(42,31,23,0.22)",
                  background: plan === "mensual" ? "#B8791F" : "transparent",
                }}
              />
            </button>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: "rgba(42,31,23,0.10)", background: "#FFFFFF" }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#6B5A4A]">Con Premium</p>
            <ul className="flex flex-col gap-3">
              {BENEFICIOS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#B8791F" }}
                  >
                    <Check className="h-2.5 w-2.5" style={{ color: "#FFFFFF" }} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              disabled={starting}
              className="h-14 w-full rounded-full text-base font-semibold text-[#1F1712] disabled:opacity-70"
              style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
              onClick={handleStart}
            >
              {starting ? "Un momento…" : "Desbloquear Premium"}
            </button>
            <button onClick={() => router.push("/app")} className="text-center text-sm text-[#6B5A4A]">
              Ahora no
            </button>
          </div>

          <p className="pb-6 text-center text-xs text-[#6B5A4A]">Pago seguro · cancelan cuando quieran</p>
        </div>
      </div>
    </main>
  );
}
