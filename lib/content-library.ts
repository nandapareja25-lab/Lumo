/**
 * Taxonomía de la biblioteca de Lumo — Historias Bíblicas, Series, Cuentos con valores,
 * Reflexiones y Afirmaciones (2026-07-23, reemplaza el lenguaje "cristiano/devocional"
 * anterior por uno inclusivo — ver ROADMAP.md). Esto define la ESTRUCTURA; solo una fracción
 * tiene hoy episodios reales producidos (ver lib/content-catalog.ts, CONTENT).
 *
 * Nunca se inventan episodios de mentira: una serie sin `ContentItem` producido simplemente no
 * tiene episodios listados todavía, se muestra como "Próximamente" a nivel de serie.
 */
import type { ContentItem, ContentType } from "./content-catalog";

export type CollectionId =
  | "historias-biblicas"
  | "oraciones-guiadas"
  | "series"
  | "cuentos-con-valores"
  | "reflexiones"
  | "afirmaciones"
  | "series-especiales"
  | "evangelio-diario"
  | "meditaciones-guiadas";

export type Collection = {
  id: CollectionId;
  label: string;
  description: string;
  contentType: ContentType;
  /** Estimación inicial de episodios, NO una promesa de fecha ni un tope — las Series en
   * particular están diseñadas para crecimiento continuo (ver `Series.seasons`). */
  targetRange: string;
};

export const COLLECTIONS: Collection[] = [
  {
    id: "historias-biblicas",
    label: "Historias Bíblicas",
    description: "Relatos con origen bíblico, narrados como grandes historias para toda la familia.",
    contentType: "historia",
    targetRange: "20 iniciales",
  },
  {
    id: "oraciones-guiadas",
    label: "Oraciones Guiadas",
    description: "Experiencias de audio guiadas por Lumo para cada momento del día.",
    contentType: "oracion",
    targetRange: "8 (ya producidas)",
  },
  {
    id: "series",
    label: "Series",
    description:
      "Recorridos con continuidad — un episodio por día. El corazón del catálogo: crecen sin límite, organizadas en temporadas.",
    contentType: "historia",
    targetRange: "45 iniciales, crecimiento continuo",
  },
  {
    id: "cuentos-con-valores",
    label: "Cuentos con valores",
    description: "Historias originales (no bíblicas) sobre perdón, generosidad, valentía y más.",
    contentType: "cuento",
    targetRange: "15 iniciales",
  },
  {
    id: "reflexiones",
    label: "Reflexiones",
    description: "Pausas breves de 2-3 minutos sobre un valor para la vida diaria.",
    contentType: "devocional",
    targetRange: "10 iniciales",
  },
  {
    id: "afirmaciones",
    label: "Afirmaciones",
    description: "Frases breves y positivas para repetir en familia, agrupadas por tema.",
    contentType: "afirmacion",
    targetRange: "10 iniciales",
  },
  {
    id: "evangelio-diario",
    label: "Evangelio del día",
    description:
      "Devocional corto atado a un pasaje del Evangelio, con reflexión breve conectada a la vida cotidiana. " +
      "Dos variantes por día — mañana (arranque/energía) y noche (cierre/calma) — no la misma pieza en ambos momentos.",
    contentType: "evangelio",
    targetRange: "sin producir todavía",
  },
  {
    id: "meditaciones-guiadas",
    label: "Meditaciones",
    description:
      "Meditaciones guiadas de 8-12 minutos para relajarse antes de dormir — ritmo lento, pausas, " +
      "respiración e imaginería sensorial, con la presencia de Dios como fondo de calma, no como lección.",
    contentType: "meditacion",
    targetRange: "sin producir todavía",
  },
  {
    id: "series-especiales",
    label: "Series Especiales",
    description: "Contenido de temporada: Adviento, Semana Santa y planes familiares de varios días.",
    contentType: "especial",
    targetRange: "variable (por temporada)",
    /**
     * REGLA (2026-07-22, decisión del usuario, sin implementar todavía — no hay ningún episodio
     * de esta colección producido aún): el contenido de temporada (Adviento, Navidad, Semana
     * Santa, Pascua) solo debe aparecer en Home/Explorar durante su temporada real de calendario
     * — nunca todo el año junto al contenido evergreen (historias/oraciones). Cuando se produzca
     * el primer episodio de esta colección, la arquitectura de Explorar/Home tiene que filtrar
     * por fecha desde el día uno, no agregarlo después.
     */
  },
];

/** Una temporada dentro de una Serie — le da al usuario la sensación de "serie real" y permite
 * agregar temporadas nuevas a futuro sin romper el orden ya vivido. */
export type Season = {
  number: number;
  label: string;
};

export type Series = {
  id: string;
  collectionId: CollectionId;
  label: string;
  testament?: "antiguo" | "nuevo";
  /** Estimación inicial de episodios — NO un tope. Las Series están diseñadas para crecer:
   * agregar un episodio nuevo es simplemente `episodeNumber = max + 1`, nunca reordenar. */
  targetEpisodes: number;
  order: number;
  /** Solo para Series con estructura de temporadas (ver CLAUDE.md/decisión 2026-07-23). Una
   * Serie sin `seasons` sigue siendo de crecimiento abierto, solo que sin agrupación formal. */
  seasons?: Season[];
};

export const SERIES: Series[] = [
  // Historias Bíblicas — 12 personajes en el lanzamiento inicial (20 episodios)
  { id: "creacion", collectionId: "historias-biblicas", label: "Creación", testament: "antiguo", targetEpisodes: 1, order: 1 },
  { id: "noe", collectionId: "historias-biblicas", label: "Noé", testament: "antiguo", targetEpisodes: 1, order: 2 },
  { id: "abraham", collectionId: "historias-biblicas", label: "Abraham", testament: "antiguo", targetEpisodes: 1, order: 3 },
  { id: "jose", collectionId: "historias-biblicas", label: "José", testament: "antiguo", targetEpisodes: 3, order: 4 },
  { id: "moises", collectionId: "historias-biblicas", label: "Moisés", testament: "antiguo", targetEpisodes: 3, order: 5 },
  { id: "david", collectionId: "historias-biblicas", label: "David", testament: "antiguo", targetEpisodes: 3, order: 6 },
  { id: "daniel", collectionId: "historias-biblicas", label: "Daniel", testament: "antiguo", targetEpisodes: 2, order: 7 },
  { id: "ester", collectionId: "historias-biblicas", label: "Ester", testament: "antiguo", targetEpisodes: 1, order: 8 },
  { id: "josue", collectionId: "historias-biblicas", label: "Josué", testament: "antiguo", targetEpisodes: 1, order: 9 },
  { id: "rut", collectionId: "historias-biblicas", label: "Rut", testament: "antiguo", targetEpisodes: 1, order: 10 },
  { id: "elias", collectionId: "historias-biblicas", label: "Elías", testament: "antiguo", targetEpisodes: 2, order: 11 },
  { id: "salomon", collectionId: "historias-biblicas", label: "Salomón", testament: "antiguo", targetEpisodes: 1, order: 12 },

  // Series — el corazón del catálogo, crecimiento continuo (45 episodios iniciales)
  {
    id: "la-vida-de-jesus",
    collectionId: "series",
    label: "La vida de Jesús",
    testament: "nuevo",
    targetEpisodes: 6,
    order: 1,
    seasons: [
      { number: 1, label: "Nacimiento e infancia" },
      { number: 2, label: "Comienzo del ministerio" },
      { number: 3, label: "Milagros" },
      { number: 4, label: "Parábolas" },
      { number: 5, label: "Última semana" },
      { number: 6, label: "Resurrección y esperanza" },
    ],
  },
  { id: "parabolas", collectionId: "series", label: "Parábolas", testament: "nuevo", targetEpisodes: 4, order: 2 },
  { id: "milagros-de-jesus", collectionId: "series", label: "Milagros", testament: "nuevo", targetEpisodes: 4, order: 3 },
  {
    id: "aventuras-de-pablo",
    collectionId: "series",
    label: "Aventuras de Pablo",
    testament: "nuevo",
    targetEpisodes: 3,
    order: 4,
    seasons: [
      { number: 1, label: "Camino a Damasco" },
      { number: 2, label: "Primeros viajes" },
      { number: 3, label: "Cartas y prisión" },
    ],
  },
  {
    id: "mujeres-de-la-biblia",
    collectionId: "series",
    label: "Mujeres de la Biblia",
    targetEpisodes: 3,
    order: 5,
    seasons: [
      { number: 1, label: "Mujeres del Antiguo Testamento" },
      { number: 2, label: "Mujeres del Nuevo Testamento" },
    ],
  },
  { id: "los-discipulos", collectionId: "series", label: "Los discípulos", testament: "nuevo", targetEpisodes: 3, order: 6 },
  { id: "frutos-del-espiritu", collectionId: "series", label: "Frutos del Espíritu", targetEpisodes: 9, order: 7 },
  {
    id: "grandes-lideres",
    collectionId: "series",
    label: "Grandes líderes",
    targetEpisodes: 3,
    order: 8,
    seasons: [
      { number: 1, label: "Jueces y libertadores" },
      { number: 2, label: "Reyes sabios" },
    ],
  },
  {
    id: "reyes-de-israel",
    collectionId: "series",
    label: "Reyes de Israel",
    testament: "antiguo",
    targetEpisodes: 3,
    order: 9,
    seasons: [
      { number: 1, label: "El reino unido" },
      { number: 2, label: "El reino dividido" },
    ],
  },
  {
    id: "profetas",
    collectionId: "series",
    label: "Profetas",
    testament: "antiguo",
    targetEpisodes: 3,
    order: 10,
    seasons: [
      { number: 1, label: "Profetas mayores" },
      { number: 2, label: "Profetas menores" },
    ],
  },
  { id: "viajes-por-la-biblia", collectionId: "series", label: "Viajes por la Biblia", targetEpisodes: 2, order: 11 },
  { id: "descubriendo-los-valores", collectionId: "series", label: "Descubriendo los valores", targetEpisodes: 2, order: 12 },

  // Cuentos con valores — historias originales, no bíblicas (15 episodios)
  { id: "cuento-perdon", collectionId: "cuentos-con-valores", label: "Perdón", targetEpisodes: 2, order: 1 },
  { id: "cuento-generosidad", collectionId: "cuentos-con-valores", label: "Generosidad", targetEpisodes: 2, order: 2 },
  { id: "cuento-obediencia", collectionId: "cuentos-con-valores", label: "Obediencia", targetEpisodes: 1, order: 3 },
  { id: "cuento-valentia", collectionId: "cuentos-con-valores", label: "Valentía", targetEpisodes: 2, order: 4 },
  { id: "cuento-humildad", collectionId: "cuentos-con-valores", label: "Humildad", targetEpisodes: 2, order: 5 },
  { id: "cuento-amistad", collectionId: "cuentos-con-valores", label: "Amistad", targetEpisodes: 2, order: 6 },
  { id: "cuento-esperanza", collectionId: "cuentos-con-valores", label: "Esperanza", targetEpisodes: 2, order: 7 },
  { id: "cuento-amor", collectionId: "cuentos-con-valores", label: "Amor", targetEpisodes: 2, order: 8 },

  // Reflexiones — pausas breves de 2-3 minutos (10 episodios en el lanzamiento)
  { id: "reflexion-amor", collectionId: "reflexiones", label: "Amor", targetEpisodes: 1, order: 1 },
  { id: "reflexion-fe", collectionId: "reflexiones", label: "Fe", targetEpisodes: 1, order: 2 },
  { id: "reflexion-esperanza", collectionId: "reflexiones", label: "Esperanza", targetEpisodes: 1, order: 3 },
  { id: "reflexion-gratitud", collectionId: "reflexiones", label: "Gratitud", targetEpisodes: 1, order: 4 },
  { id: "reflexion-generosidad", collectionId: "reflexiones", label: "Generosidad", targetEpisodes: 1, order: 5 },
  { id: "reflexion-perdon", collectionId: "reflexiones", label: "Perdón", targetEpisodes: 1, order: 6 },
  { id: "reflexion-humildad", collectionId: "reflexiones", label: "Humildad", targetEpisodes: 1, order: 7 },
  { id: "reflexion-valentia", collectionId: "reflexiones", label: "Valentía", targetEpisodes: 1, order: 8 },
  { id: "reflexion-paciencia", collectionId: "reflexiones", label: "Paciencia", targetEpisodes: 1, order: 9 },
  { id: "reflexion-bondad", collectionId: "reflexiones", label: "Bondad", targetEpisodes: 1, order: 10 },

  // Afirmaciones — agrupadas por tema, no por identidad religiosa (10 en el lanzamiento)
  { id: "afirmaciones-amor-pertenencia", collectionId: "afirmaciones", label: "Amor y pertenencia", targetEpisodes: 3, order: 1 },
  { id: "afirmaciones-paz-seguridad", collectionId: "afirmaciones", label: "Paz y seguridad", targetEpisodes: 3, order: 2 },
  { id: "afirmaciones-confianza-proposito", collectionId: "afirmaciones", label: "Confianza y propósito", targetEpisodes: 2, order: 3 },
  { id: "afirmaciones-esperanza-valentia", collectionId: "afirmaciones", label: "Esperanza y valentía", targetEpisodes: 2, order: 4 },

  // Series Especiales
  { id: "adviento", collectionId: "series-especiales", label: "Adviento", targetEpisodes: 4, order: 1 },
  { id: "navidad", collectionId: "series-especiales", label: "Navidad", targetEpisodes: 2, order: 2 },
  { id: "semana-santa", collectionId: "series-especiales", label: "Semana Santa", targetEpisodes: 5, order: 3 },
  { id: "pascua", collectionId: "series-especiales", label: "Pascua", targetEpisodes: 2, order: 4 },
  { id: "plan-7-dias", collectionId: "series-especiales", label: "Plan de 7 días", targetEpisodes: 7, order: 5 },
  { id: "plan-30-dias", collectionId: "series-especiales", label: "Plan de 30 días", targetEpisodes: 30, order: 6 },
  { id: "retos-familiares", collectionId: "series-especiales", label: "Retos familiares", targetEpisodes: 6, order: 7 },
];

/** Colecciones curadas: NO tienen producción propia, apuntan a episodios ya existentes en
 * otras series/colecciones. "Los héroes de la fe" y "Antiguo/Nuevo Testamento" se resuelven
 * así — evita recontar la misma historia dos veces (decisión del usuario, 2026-07-23). */
export type CuratedCollection = {
  id: string;
  label: string;
  description: string;
  /** IDs de contenido (ContentItem.id) que arma esta colección, en el orden a mostrar. */
  contentIds: string[];
};

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: "heroes-de-la-fe",
    label: "Los héroes de la fe",
    description: "Un recorrido curado por las historias de quienes confiaron, aunque no podían ver todo el camino.",
    contentIds: ["noe-arca", "david-goliat", "moises-mar-rojo", "daniel-leones", "ester-reina"],
  },
  {
    id: "antiguo-testamento",
    label: "Antiguo Testamento",
    description: "Todo el contenido de Historias Bíblicas y Series ambientado antes de Jesús, en un solo lugar.",
    contentIds: [], // se arma en runtime filtrando category === "antiguo", no por lista fija
  },
  {
    id: "nuevo-testamento",
    label: "Nuevo Testamento",
    description: "Todo el contenido de Historias Bíblicas y Series ambientado en la vida de Jesús y la iglesia primitiva.",
    contentIds: [], // se arma en runtime filtrando category === "nuevo", no por lista fija
  },
];

export function getCollection(id: CollectionId): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function getSeries(id: string): Series | undefined {
  return SERIES.find((s) => s.id === id);
}

export function seriesInCollection(collectionId: CollectionId): Series[] {
  return SERIES.filter((s) => s.collectionId === collectionId).sort((a, b) => a.order - b.order);
}

/** Episodios reales ya producidos para una serie (puede ser 0 → la serie se muestra "Próximamente"). */
export function producedEpisodes(seriesId: string, content: ContentItem[]): ContentItem[] {
  return content
    .filter((c) => c.seriesId === seriesId)
    .sort((a, b) => (a.season ?? 0) - (b.season ?? 0) || (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0));
}

export function collectionTargetTotal(collectionId: CollectionId): number {
  return seriesInCollection(collectionId).reduce((sum, s) => sum + s.targetEpisodes, 0);
}
