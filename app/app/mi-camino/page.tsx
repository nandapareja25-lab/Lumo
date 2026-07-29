"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppState, readApp } from "@/lib/app-data";
import { LumoPortrait } from "@/components/app/lumo-portrait";

/**
 * Mi Camino ya no es un dashboard de progreso — no responde "¿cómo va la familia?" sino
 * "¿qué camino hemos recorrido juntos?". Es una curaduría de unos pocos momentos reales,
 * narrados como una historia (no un log de fechas), a lo largo del mismo hilo de luz de la
 * Landing — que nunca termina en un punto final: se pierde hacia abajo, tenue, sin metas ni
 * "siguiente logro". Solo continuidad. Ver BRAND-DNA.md.
 */
export default function MiCaminoPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(readApp());
  }, []);

  if (!state) return null;

  const nights = state.ritualNights;
  const hasPrayed = state.prayersSaidIds.length > 0;
  // diaryEntries se guardan más nuevo primero — el último del array es el primer momento real.
  const firstEntry = state.diaryEntries.length > 0 ? state.diaryEntries[state.diaryEntries.length - 1] : null;
  const hasStarted = nights > 0 || state.diaryEntries.length > 0 || hasPrayed;

  const beats: string[] = [];
  if (hasStarted) beats.push("Empezaron este camino juntos.");
  if (firstEntry) {
    beats.push(`Compartieron su primera historia — “${firstEntry.storyTitle}” — y guardaron ese momento en su Diario.`);
  }
  if (hasPrayed) beats.push("Las oraciones empezaron a formar parte de sus noches.");
  if (nights >= 90) beats.push("Ya es una temporada entera caminando juntos.");
  else if (nights >= 30) beats.push("Llevan un mes construyendo este momento, noche tras noche.");
  else if (nights >= 7) beats.push("Ya llevan una semana caminando juntos.");
  if (hasStarted) beats.push("Hoy siguen caminando juntos.");

  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <div className="px-4 pb-3 pt-6">
        <h1 className="font-heading text-h1">Mi camino</h1>
        <p className="mt-1 text-body text-muted-foreground">El camino que han recorrido juntos.</p>
      </div>
      <div className="relative z-10 flex flex-col gap-5 px-4 pb-6 pt-4">

      {hasStarted && (
        <>
          <div
            className="flex items-center gap-3 rounded-[24px] p-5"
            style={{ background: "linear-gradient(160deg, #FFF4D6, #FFFDF7)", boxShadow: "var(--shadow-card)" }}
          >
            <LumoPortrait pose="lumo-feliz" size={56} />
            <p className="font-heading text-[15px] font-bold leading-snug text-balance">
              ¡Excelente! Sigue así, estás creciendo en tu fe 💛
            </p>
          </div>

          {/* Solo números reales — la app hoy guarda un total acumulado, no un historial día por
              día, así que no se fabrica una racha semanal con checks que no se puede respaldar. */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[20px] bg-card p-4 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="font-heading text-2xl font-extrabold" style={{ color: "#F5B800" }}>{state.completedStoryIds.length}</p>
              <p className="text-[11px] font-bold text-muted-foreground">Historias</p>
            </div>
            <div className="rounded-[20px] bg-card p-4 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="font-heading text-2xl font-extrabold" style={{ color: "#9B87F5" }}>{state.prayersSaidIds.length}</p>
              <p className="text-[11px] font-bold text-muted-foreground">Oraciones</p>
            </div>
            <div className="rounded-[20px] bg-card p-4 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="font-heading text-2xl font-extrabold" style={{ color: "#F26B6B" }}>{nights}</p>
              <p className="text-[11px] font-bold text-muted-foreground">Noches juntos</p>
            </div>
          </div>
        </>
      )}

      {!hasStarted ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <LumoPortrait pose="lumo-frontal" size={64} />
          <p className="max-w-[26ch] font-heading text-h2 italic text-muted-foreground">
            Este camino todavía no empezó. Cuando quieran, va a estar aquí esperándolos.
          </p>
          <Link
            href="/app/explorar"
            className="mt-2 rounded-full px-5 py-2.5 text-sm font-bold text-[#2D2A26]"
            style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", boxShadow: "var(--shadow-button)" }}
          >
            Explorar historias
          </Link>
        </div>
      ) : (
        <div className="relative mt-14 pl-8">
          <div
            className="absolute left-[3px] top-1 w-px"
            style={{
              height: "calc(100% + 160px)",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(245,184,0,0.4) 6%, rgba(245,184,0,0.4) 82%, transparent 100%)",
            }}
          />
          <div className="flex flex-col gap-11">
            {beats.map((beat, i) => (
              <div key={i} className="relative">
                <span
                  className="absolute -left-8 top-1.5 h-[7px] w-[7px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, #F7C948 0%, #F5A300 65%, rgba(245,163,0,0) 100%)",
                    boxShadow: "0 0 14px 4px rgba(245,184,0,0.35)",
                  }}
                />
                <p className="font-heading text-[17px] leading-relaxed text-balance">{beat}</p>
              </div>
            ))}
          </div>
          {/* el hilo sigue más allá del último momento — sin punto final, sin meta */}
          <span
            className="absolute -left-8 h-[5px] w-[5px] rounded-full"
            style={{ top: "calc(100% + 70px)", background: "rgba(245,184,0,0.3)" }}
          />
        </div>
      )}
      </div>
    </main>
  );
}
