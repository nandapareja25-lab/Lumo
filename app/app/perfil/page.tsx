"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LumoPortrait } from "@/components/app/lumo-portrait";
import { PushSettings } from "@/components/app/push-settings";
import { AppState, clearApp, readApp } from "@/lib/app-data";

/**
 * Perfil es la pantalla utilitaria a propósito — información y control, no otra escena
 * emocional (decisión explícita del usuario, 2026-07-20). Solo el color base de Vigilia,
 * sin imagen de mundo: pertenece al mismo universo por la paleta, no por una ilustración.
 */
export default function PerfilPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setState(readApp());
  }, []);

  if (!state) return null;

  return (
    <main className="flex min-h-dvh flex-col gap-6 bg-[#FAF3EE] px-4 pb-6 pt-10 text-[#2A1F17]">
      <h1 className="font-heading text-2xl font-medium">Perfil</h1>

      <div
        className="flex flex-col items-center gap-2 rounded-[22px] border border-[rgba(42,31,23,0.10)] bg-white p-6 text-center"
        style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
      >
        <LumoPortrait pose="lumo-frontal" size={90} />
        <p className="font-heading text-lg font-medium">
          {state.childName || "Su familia"}
          {state.childAge ? `, ${state.childAge} años` : ""}
        </p>
        <p className="max-w-xs text-xs text-[#6B5A4A]">Así personaliza Lumo cada historia y oración para ustedes.</p>
      </div>

      <div
        className="rounded-2xl border border-[rgba(42,31,23,0.10)] bg-white p-5"
        style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
      >
        <p className="text-sm font-semibold">Cristiana</p>
        <p className="text-xs text-[#6B5A4A]">Tradición de fe de su familia</p>
      </div>

      <PushSettings />

      <div
        className="rounded-2xl border border-[rgba(42,31,23,0.10)] bg-white p-5"
        style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
      >
        <p className="text-[13px] leading-relaxed text-[#6B5A4A]">
          El diario de su familia es privado — nunca se vende ni se comparte, y es de ustedes aunque
          decidan no seguir con Lumo.
        </p>
      </div>

      {!confirmingDelete ? (
        <button
          className="h-12 rounded-full border border-[rgba(42,31,23,0.18)] text-sm font-semibold text-[#6B5A4A]"
          onClick={() => setConfirmingDelete(true)}
        >
          Borrar mis datos
        </button>
      ) : (
        <div
          className="rounded-2xl border border-[rgba(42,31,23,0.14)] bg-white p-5 text-center"
          style={{ boxShadow: "0 12px 30px -14px rgba(42,31,23,0.18)" }}
        >
          <p className="mb-4 text-sm text-[#6B5A4A]">
            Esto va a borrar el diario, las oraciones y las historias guardadas en este dispositivo. No
            se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              className="h-11 flex-1 rounded-full border border-[rgba(42,31,23,0.18)] text-sm font-semibold text-[#6B5A4A]"
              onClick={() => setConfirmingDelete(false)}
            >
              Cancelar
            </button>
            <button
              className="h-11 flex-1 rounded-full text-sm font-semibold text-[#1F1712]"
              style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
              onClick={() => {
                clearApp();
                router.push("/");
              }}
            >
              Sí, borrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
