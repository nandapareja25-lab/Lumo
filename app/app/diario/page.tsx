"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { AppState, readApp } from "@/lib/app-data";
import { LumoThread } from "@/components/app/lumo-thread";
import { LumoPortrait } from "@/components/app/lumo-portrait";

function MemoryAudio({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className="flex items-center gap-3 rounded-[16px] bg-card p-3">
      <button
        type="button"
        onClick={() => {
          if (playing) audioRef.current?.pause();
          else audioRef.current?.play();
          setPlaying((p) => !p);
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#1F1712]"
        style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", boxShadow: "var(--shadow-button)" }}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <span className="text-sm text-muted-foreground">Una nota de voz de ese momento</span>
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} className="hidden" />
    </div>
  );
}

/**
 * El álbum de la familia, no un historial de respuestas — cada entrada es un recuerdo guardado
 * (BRAND-DNA.md: "Lumo no vende contenido. Lumo protege un momento."), sin importar si nació de
 * una historia, una oración o cualquier otro momento futuro.
 */
export default function DiarioPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(readApp());
  }, []);

  if (!state) return null;

  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <div className="relative z-10 px-4 pb-10 pt-10">
      <h1 className="font-heading text-h1">Diario</h1>
      <p className="mt-1 text-body text-muted-foreground">Los momentos que han compartido en familia.</p>
      <LumoThread height={50} />

      {state.diaryEntries.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-[24px] bg-card p-8 text-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <LumoPortrait pose="lumo-frontal" size={56} />
          <p className="max-w-xs text-body text-muted-foreground">
            Aquí van a ir quedando los momentos que compartan en familia — una historia, una reflexión, un recuerdo.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {state.diaryEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[24px] bg-card p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-heading text-[15px] font-medium">{entry.storyTitle}</p>
                <p className="shrink-0 text-xs text-muted-foreground/80">
                  {new Date(entry.date).toLocaleDateString("es", { day: "numeric", month: "short" })}
                </p>
              </div>
              <p className="mb-3 font-heading text-sm italic text-muted-foreground">{entry.question}</p>
              {entry.audioUrl ? (
                <MemoryAudio src={entry.audioUrl} />
              ) : (
                <p className="rounded-xl border-l-2 border-[#F5B800]/60 bg-[rgba(0,0,0,0.03)] py-2 pl-4 font-heading text-[15px] italic leading-relaxed text-foreground/90">
                  “{entry.answer}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </main>
  );
}
