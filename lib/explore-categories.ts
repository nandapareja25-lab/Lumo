import type { SceneMood, StoryTag } from "./story-catalog";

export type ExploreFilterId = "todo" | "antiguo" | "nuevo" | StoryTag;

/** Compartido entre Explorar y Home — una sola fuente de verdad para las categorías reales. */
export const EXPLORE_FILTERS: { id: ExploreFilterId; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "antiguo", label: "Antiguo Testamento" },
  { id: "nuevo", label: "Nuevo Testamento" },
  { id: "personajes", label: "Personajes" },
  { id: "milagros", label: "Milagros de Jesús" },
  { id: "mujeres", label: "Mujeres de la Biblia" },
  { id: "valores", label: "Valores Cristianos" },
];

export const EXPLORE_CATEGORY_CARDS: { id: ExploreFilterId; label: string; slug: string; mood: SceneMood }[] = [
  { id: "antiguo", label: "Antiguo Testamento", slug: "category-antiguo", mood: "night" },
  { id: "nuevo", label: "Nuevo Testamento", slug: "category-nuevo", mood: "threshold" },
  { id: "personajes", label: "Personajes", slug: "category-personajes", mood: "family" },
  { id: "milagros", label: "Milagros de Jesús", slug: "category-milagros", mood: "prayer" },
  { id: "mujeres", label: "Mujeres de la Biblia", slug: "category-mujeres", mood: "book" },
  { id: "valores", label: "Valores Cristianos", slug: "category-valores", mood: "prayer" },
];
