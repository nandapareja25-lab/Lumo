"use client";

import { SceneMood } from "@/lib/story-catalog";
import { HeroScene } from "./hero-scene";
import { HistoriasScene } from "./historias-scene";
import { OracionScene } from "./oracion-scene";
import { DiarioScene } from "./diario-scene";
import { RutinaScene } from "./rutina-scene";
import { RegistroScene } from "./registro-scene";

const MOOD_COMPONENTS: Record<SceneMood, React.ComponentType> = {
  family: HeroScene,
  book: HistoriasScene,
  prayer: OracionScene,
  diary: DiarioScene,
  night: RutinaScene,
  threshold: RegistroScene,
};

/** Traduce un `mood` del catálogo a una de las 6 escenas ilustradas ya construidas. */
export function MoodScene({ mood }: { mood: SceneMood }) {
  const Component = MOOD_COMPONENTS[mood];
  return <Component />;
}
