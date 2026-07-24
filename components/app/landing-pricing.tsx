"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Plan = "anual" | "mensual";

const REGISTRO_HREF = "/onboarding";

/**
 * Sección Oferta con ambos planes seleccionables — el anual queda destacado por defecto
 * ("Más popular") pero el mensual nunca queda oculto (decisión explícita del usuario).
 * El CTA y el precio destacado cambian según el plan elegido. Landing v2 (2026-07-24):
 * repintado para la sección --forest oscura (antes era para fondo claro).
 */
export function LandingPricing() {
  const [plan, setPlan] = useState<Plan>("anual");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      <button
        onClick={() => setPlan("mensual")}
        className="flex items-center justify-between rounded-2xl border p-4 text-left transition-colors"
        style={{
          borderColor: plan === "mensual" ? "#FFD740" : "rgba(255,255,255,0.12)",
          background: plan === "mensual" ? "rgba(255,215,64,0.08)" : "rgba(255,255,255,0.03)",
        }}
      >
        <div>
          <p className="font-heading text-lg font-semibold text-[#F2ECDF]">$4.99/mes</p>
          <p className="text-xs text-[rgba(242,236,223,0.66)]">Plan mensual · sin compromiso anual</p>
        </div>
        <span
          className="h-5 w-5 shrink-0 rounded-full border-2"
          style={{
            borderColor: plan === "mensual" ? "#FFD740" : "rgba(242,236,223,0.3)",
            background: plan === "mensual" ? "#FFD740" : "transparent",
          }}
        />
      </button>

      <div
        className="relative rounded-2xl border-2 p-4 transition-colors"
        style={{
          borderColor: plan === "anual" ? "#FFD740" : "rgba(255,255,255,0.12)",
          background: plan === "anual" ? "rgba(255,215,64,0.09)" : "rgba(255,255,255,0.03)",
        }}
      >
        <span
          className="absolute -top-3 left-4 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#3A2705]"
          style={{ background: "linear-gradient(135deg, #FFD740, #F7C35C)" }}
        >
          Más popular
        </span>
        <button onClick={() => setPlan("anual")} className="flex w-full items-center justify-between text-left">
          <div>
            <p className="font-heading text-lg font-semibold text-[#F2ECDF]">$3.33/mes</p>
            <p className="text-xs text-[rgba(242,236,223,0.66)]">Plan anual · facturado $39.99/año</p>
          </div>
          <span
            className="h-5 w-5 shrink-0 rounded-full border-2"
            style={{
              borderColor: plan === "anual" ? "#FFD740" : "rgba(242,236,223,0.3)",
              background: plan === "anual" ? "#FFD740" : "transparent",
            }}
          />
        </button>
        <ul className="mt-3 flex flex-col gap-1.5 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          {["Ahorro frente al mensual", "Acceso completo", "Mejor valor"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-[rgba(242,236,223,0.75)]">
              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#FFD740" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={REGISTRO_HREF}
        className="mt-2 flex h-14 w-full items-center justify-center rounded-full text-base font-semibold text-[#3A2705]"
        style={{ background: "linear-gradient(135deg, #FFD740, #F7C35C)" }}
      >
        Empezar gratis — plan {plan === "anual" ? "anual" : "mensual"}
      </Link>
      <p className="text-center text-xs text-[rgba(242,236,223,0.66)]">7 días de prueba del plan Pro · cancela cuando quieras</p>
    </div>
  );
}
