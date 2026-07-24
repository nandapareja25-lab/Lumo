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
    <main className="relative min-h-dvh bg-[#FAF3EE] text-[#2A1F17]">
      <div className="relative z-10 flex flex-col px-4 pb-6 pt-10">
      <h1 className="font-heading text-h1">Mi camino</h1>
      <p className="mt-1 text-body text-[#6B5A4A]">El camino que han recorrido juntos.</p>

      {!hasStarted ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <LumoPortrait pose="lumo-frontal" size={64} />
          <p className="max-w-[26ch] font-heading text-h2 italic text-[#6B5A4A]">
            Este camino todavía no empezó. Cuando quieran, va a estar aquí esperándolos.
          </p>
          <Link
            href="/app/explorar"
            className="mt-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)", color: "#1F1712" }}
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
                "linear-gradient(180deg, transparent 0%, rgba(243,200,120,0.55) 6%, rgba(243,200,120,0.55) 82%, transparent 100%)",
            }}
          />
          <div className="flex flex-col gap-11">
            {beats.map((beat, i) => (
              <div key={i} className="relative">
                <span
                  className="absolute -left-8 top-1.5 h-[7px] w-[7px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, #F3C878 0%, #E8A33D 65%, rgba(232,163,61,0) 100%)",
                    boxShadow: "0 0 14px 4px rgba(232,163,61,0.4)",
                  }}
                />
                <p className="font-heading text-[17px] leading-relaxed text-balance">{beat}</p>
              </div>
            ))}
          </div>
          {/* el hilo sigue más allá del último momento — sin punto final, sin meta */}
          <span
            className="absolute -left-8 h-[5px] w-[5px] rounded-full"
            style={{ top: "calc(100% + 70px)", background: "rgba(243,200,120,0.3)" }}
          />
        </div>
      )}
      </div>
    </main>
  );
}
