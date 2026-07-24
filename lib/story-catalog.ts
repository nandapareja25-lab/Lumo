/**
 * Vista de compatibilidad sobre lib/content-catalog.ts (fuente única de verdad).
 * Mantiene la forma `Story` que ya consumen las pantallas actuales; cuando esas pantallas
 * se actualicen a la fase audio-first (Explorar/Home/Diario/Mi camino), pueden migrar a
 * `ContentItem` directamente y este archivo se podrá borrar.
 */
import { CONTENT, ContentItem, SceneMood as ContentSceneMood } from "./content-catalog";

export type SceneMood = ContentSceneMood;

export type StoryScene = {
  caption: string;
  mood: SceneMood;
};

export type StoryTag = "personajes" | "milagros" | "mujeres" | "valores";

export type Story = {
  id: string;
  title: string;
  subtitle: string;
  character: string;
  category: "antiguo" | "nuevo";
  faithTradition: "cristiana";
  tags: StoryTag[];
  scenes: StoryScene[];
  reflectionQuestion: string;
  /** Presente solo si pertenece a una serie de varios episodios (colección "series"). */
  seriesId?: string;
  episodeNumber?: number;
};

function toStory(c: ContentItem): Story {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    character: c.characters[0] ?? "",
    category: c.category === "antiguo" ? "antiguo" : "nuevo",
    faithTradition: "cristiana",
    tags: c.tags,
    scenes: c.segments.map((s) => ({ caption: s.caption, mood: s.mood })),
    reflectionQuestion: c.conversationQuestions[0] ?? "",
    seriesId: c.collectionId === "series" ? c.seriesId : undefined,
    episodeNumber: c.episodeNumber,
  };
}

export const STORIES: Story[] = CONTENT.filter((c) => c.contentType === "historia").map(toStory);

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}

/** Series con más de un episodio real publicado — la única fuente que le importa a la UI
 * de "Series" (una seriesId con un solo episodio hoy es indistinguible de una historia suelta). */
export function multiEpisodeSeries(): { seriesId: string; episodes: Story[] }[] {
  const bySeries = new Map<string, Story[]>();
  for (const s of STORIES) {
    if (!s.seriesId) continue;
    const list = bySeries.get(s.seriesId) ?? [];
    list.push(s);
    bySeries.set(s.seriesId, list);
  }
  return Array.from(bySeries.entries())
    .filter(([, episodes]) => episodes.length > 1)
    .map(([seriesId, episodes]) => ({
      seriesId,
      episodes: episodes.sort((a, b) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0)),
    }))
    .sort((a, b) => b.episodes.length - a.episodes.length);
}
