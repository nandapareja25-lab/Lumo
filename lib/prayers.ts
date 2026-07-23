/**
 * Vista de compatibilidad sobre lib/content-catalog.ts (fuente única de verdad).
 * Las 8 oraciones guiadas viven como ContentItem (contentType: "oracion") con guion completo
 * (intro/reflexión/oración/cierre) para la fase audio-first. Orar ya no muestra el texto plano
 * inline — cada tarjeta lleva al reproductor compartido (/reproducir/[id]); esta vista solo
 * aplana los campos que la lista necesita para mostrarse y filtrar (título, subtítulo,
 * duración, ilustración).
 */
import { CONTENT, ContentItem } from "./content-catalog";

export type PrayerCategory = "agradecimiento" | "peticion" | "perdon";

export type Prayer = {
  id: string;
  title: string;
  subtitle: string;
  category: PrayerCategory;
  durationSeconds: number;
  illustrationSlug: string;
};

/** Solo categorías con al menos una oración real hoy — nunca se anuncia una categoría vacía. */
export const PRAYER_CATEGORIES: { id: PrayerCategory; label: string }[] = [
  { id: "agradecimiento", label: "Agradecimiento" },
  { id: "peticion", label: "Petición" },
];

const LEGACY_CATEGORY: Record<string, PrayerCategory> = {
  "antes-de-dormir": "peticion",
  "dar-gracias": "agradecimiento",
  "cuando-tengo-miedo": "peticion",
  "cuando-estoy-triste": "peticion",
  "antes-de-un-examen": "peticion",
  "por-mi-familia": "agradecimiento",
  "antes-de-comer": "agradecimiento",
  "antes-de-comenzar-el-dia": "peticion",
};

function toPrayer(c: ContentItem): Prayer {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    category: LEGACY_CATEGORY[c.id] ?? "peticion",
    durationSeconds: c.durationSeconds,
    illustrationSlug: c.illustrationSlug,
  };
}

export const PRAYERS: Prayer[] = CONTENT.filter((c) => c.contentType === "oracion").map(toPrayer);
