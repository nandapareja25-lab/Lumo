export type NotificationCategory =
  | "historias"
  | "series"
  | "versiculo-del-dia"
  | "reflexion-del-dia"
  | "oraciones"
  | "contenido-nuevo";

export const CATEGORIES: { id: NotificationCategory; label: string; description: string }[] = [
  {
    id: "historias",
    label: "Historias",
    description: "Un aviso a la hora que ustedes elijan para compartir la historia del día.",
  },
  {
    id: "series",
    label: "Series",
    description: "Cuando haya un episodio nuevo de una serie que ya siguen.",
  },
  {
    id: "versiculo-del-dia",
    label: "Versículo del día",
    description: "Una palabra breve para acompañar el día.",
  },
  {
    id: "reflexion-del-dia",
    label: "Reflexión del día",
    description: "Un momento breve para compartir en familia.",
  },
  {
    id: "oraciones",
    label: "Oraciones",
    description: "Cuando una oración reciba una ilustración nueva.",
  },
  {
    id: "contenido-nuevo",
    label: "Contenido nuevo",
    description: "Cuentos con valores, reflexiones y afirmaciones recién publicados.",
  },
];

export type PushPreferences = Record<NotificationCategory, boolean>;

export const DEFAULT_PREFERENCES: PushPreferences = {
  historias: true,
  series: true,
  "versiculo-del-dia": true,
  "reflexion-del-dia": true,
  oraciones: true,
  "contenido-nuevo": true,
};

export type PushSubscriptionRow = {
  id: string;
  device_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  preferences: PushPreferences;
  created_at: string;
};
