import type { SceneMood, StoryTag } from "./story-catalog";

export type ExploreFilterId = "todo" | "antiguo" | "nuevo" | StoryTag | "series" | "musica" | "cuento";

/** Compartido entre Explorar y Home — una sola fuente de verdad para las categorías reales.
 * "series" filtra por seriesId real (lib/story-catalog.ts, multiEpisodeSeries); "musica" hoy no
 * tiene contenido producido — el pill existe (APP-REDISENO-INSTRUCCIONES.md §5) pero cae a un
 * estado vacío honesto en vez de fabricar canciones que no existen. "cuento" filtra Cuentos con
 * valores (lib/story-catalog.ts CUENTOS) — separado de "valores" a propósito: ese tag es de
 * historias bíblicas con tema de valores, no de los cuentos originales sin origen bíblico. */
export const EXPLORE_FILTERS: { id: ExploreFilterId; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "antiguo", label: "Antiguo Testamento" },
  { id: "nuevo", label: "Nuevo Testamento" },
  { id: "cuento", label: "Cuentos" },
  { id: "series", label: "Series" },
  { id: "musica", label: "Música" },
  { id: "personajes", label: "Personajes" },
  { id: "milagros", label: "Milagros de Jesús" },
  { id: "mujeres", label: "Mujeres de la Biblia" },
  { id: "valores", label: "Valores Cristianos" },
];

export const EXPLORE_CATEGORY_CARDS: { id: ExploreFilterId; label: string; slug: string; mood: SceneMood }[] = [
  { id: "antiguo", label: "Antiguo Testamento", slug: "category-antiguo", mood: "night" },
  { id: "nuevo", label: "Nuevo Testamento", slug: "category-nuevo", mood: "threshold" },
  { id: "cuento", label: "Cuentos con valores", slug: "cuento-perseverancia-la-bicicleta-sin-rueditas", mood: "family" },
  { id: "personajes", label: "Personajes", slug: "category-personajes", mood: "family" },
  { id: "milagros", label: "Milagros de Jesús", slug: "category-milagros", mood: "prayer" },
  { id: "mujeres", label: "Mujeres de la Biblia", slug: "category-mujeres", mood: "book" },
  { id: "valores", label: "Valores Cristianos", slug: "category-valores", mood: "prayer" },
];
