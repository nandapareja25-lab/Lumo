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
  };
}

export const STORIES: Story[] = CONTENT.filter((c) => c.contentType === "historia").map(toStory);

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
