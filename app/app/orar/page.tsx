"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { PRAYERS, PRAYER_CATEGORIES, PrayerCategory } from "@/lib/prayers";
import { AppState, isGated, readApp } from "@/lib/app-data";
import { LumoThread } from "@/components/app/lumo-thread";

type FilterId = "todas" | PrayerCategory;

function formatMinutes(seconds: number) {
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}

/**
 * Orar ya no muestra el texto de la oración inline — es la puerta de entrada a la experiencia
 * audio-first compartida con Historias (/reproducir/[id]).
 */
export default function OrarPage() {
  const [filter, setFilter] = useState<FilterId>("todas");
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(readApp());
  }, []);

  const prayers = useMemo(
    () => PRAYERS.filter((p) => filter === "todas" || p.category === filter),
    [filter],
  );

  if (!state) return null;
  const saidIds = state.prayersSaidIds;

  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <div className="relative z-10 pb-10 pt-6">
      <h1 className="px-4 font-heading text-2xl font-medium">Orar</h1>
      <LumoThread height={50} />

      <div className="scrollbar-none mt-4 flex gap-6 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setFilter("todas")}
          className={`shrink-0 border-b pb-1 text-sm font-semibold transition-colors ${
            filter === "todas" ? "border-[#F5B800] text-foreground" : "border-transparent text-muted-foreground"
          }`}
        >
          Todas
        </button>
        {PRAYER_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`shrink-0 border-b pb-1 text-sm font-semibold transition-colors ${
              filter === c.id ? "border-[#F5B800] text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4">
        {prayers.map((prayer) => {
          const said = saidIds.includes(prayer.id);
          return (
            <Link
              key={prayer.id}
              href={`/reproducir/${prayer.id}`}
              className="flex items-center gap-3 rounded-[24px] bg-card p-4 transition-colors hover:bg-[rgba(0,0,0,0.02)]"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(245,184,0,0.22) 0%, rgba(245,184,0,0.04) 70%)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#F5B800",
                    boxShadow: said ? "0 0 10px 3px rgba(245,184,0,0.5)" : "0 0 6px 1px rgba(245,184,0,0.3)",
                  }}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-[15px] font-medium">{prayer.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{prayer.subtitle}</span>
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground/80">{formatMinutes(prayer.durationSeconds)}</span>
              {isGated(state, prayer.id, "oracion") && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            </Link>
          );
        })}
      </div>
      </div>
    </main>
  );
}
