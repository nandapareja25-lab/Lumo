"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONTENT } from "@/lib/content-catalog";
import { SERIES, seriesInCollection } from "@/lib/content-library";

/**
 * Panel interno "En producción" — gateado por /admin (mismo ADMIN_PASSWORD, ver middleware
 * en proxy.ts). Lista TODO el contenido del catálogo agrupado por colección/serie/temporada,
 * con link directo al reproductor real (/reproducir/[id]) — así se revisa como lo va a ver
 * un usuario, no leyendo JSON. Incluye un botón para activar acceso completo (hasAccess=true)
 * en este navegador, ya que hoy no existe backend de cuentas real (decisión 2026-07-23).
 */
export default function ProximamentePage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("lumo_app_v2");
      const parsed = raw ? JSON.parse(raw) : null;
      setUnlocked(Boolean(parsed?.hasAccess));
    } catch {
      setUnlocked(false);
    }
  }, []);

  function activarAccesoCompleto() {
    const raw = window.localStorage.getItem("lumo_app_v2");
    const parsed = raw ? JSON.parse(raw) : {};
    const next = { ...parsed, v: 2, hasAccess: true };
    window.localStorage.setItem("lumo_app_v2", JSON.stringify(next));
    setUnlocked(true);
  }

  const seriesGroups = seriesInCollection("series");

  return (
    <main className="min-h-dvh bg-[#FAF3EE] px-4 py-6 text-[#2A1F17]">
      <h1 className="mb-1 font-heading text-2xl font-medium">En producción</h1>
      <p className="mb-5 text-sm text-[#6B5A4A]">
        Todo el contenido del catálogo, incluido lo que todavía no está anunciado en la app
        pública. Los enlaces abren el reproductor real.
      </p>

      <div
        className="mb-6 flex items-center justify-between rounded-2xl border p-4"
        style={{ borderColor: "rgba(42,31,23,0.12)", background: "#FFFFFF" }}
      >
        <div>
          <p className="text-sm font-semibold">Acceso completo en este navegador</p>
          <p className="text-xs text-[#6B5A4A]">
            {unlocked ? "Activado — nada está bloqueado." : "Sin activar — vas a ver los candados de la semana gratuita."}
          </p>
        </div>
        <button
          onClick={activarAccesoCompleto}
          disabled={unlocked}
          className="rounded-full px-4 py-2 text-sm font-semibold text-[#1F1712] disabled:opacity-50"
          style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
        >
          {unlocked ? "Activado" : "Activar acceso completo"}
        </button>
      </div>

      {seriesGroups.map((serie) => {
        const episodes = CONTENT.filter((c) => c.seriesId === serie.id).sort(
          (a, b) => (a.season ?? 0) - (b.season ?? 0) || (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0),
        );
        if (episodes.length === 0) return null;

        return (
          <section key={serie.id} className="mb-6">
            <h2 className="mb-2 font-heading text-lg font-medium">
              {serie.label} <span className="text-sm font-normal text-[#6B5A4A]">({episodes.length} episodio{episodes.length !== 1 ? "s" : ""})</span>
            </h2>
            <div className="flex flex-col gap-2">
              {episodes.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/reproducir/${ep.id}`}
                  className="flex items-center justify-between rounded-xl border p-3"
                  style={{ borderColor: "rgba(42,31,23,0.10)", background: "#FFFFFF" }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#B8791F]">
                      {ep.season ? `T${ep.season} · ` : ""}Ep. {ep.episodeNumber}
                    </p>
                    <p className="font-heading text-[15px]">{ep.title}</p>
                    <p className="text-xs text-[#6B5A4A]">{ep.subtitle}</p>
                  </div>
                  <span className="text-xs text-[#B8791F]">Abrir →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {seriesGroups.every((s) => CONTENT.filter((c) => c.seriesId === s.id).length === 0) && (
        <p className="text-sm text-[#6B5A4A]">Todavía no hay episodios de Series producidos.</p>
      )}
    </main>
  );
}
