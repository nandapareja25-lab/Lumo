import webpush from "web-push";
import type { NotificationCategory } from "./types";
import {
  allSubscriptions,
  deleteSubscriptionsByEndpoint,
  insertPushLog,
  lastLogForDevice,
} from "./supabase-rest";

/**
 * Notification Manager — punto único de envío. Reglas de Lumo aplicadas acá, no en cada
 * lugar que dispara una notificación:
 * - Antispam: no más de 1 notificación por dispositivo cada MIN_GAP_HOURS, sin importar
 *   la categoría (LUMO-FILOSOFIA.md §4-5: nunca sentirse como insistencia).
 * - Variantes: 2 textos por categoría, rotan por día del año — evita que sea siempre
 *   idéntico sin necesitar historial por dispositivo.
 * - Nunca se envía si la familia desactivó esa categoría en preferences.
 */

const MIN_GAP_HOURS = 12;

type Variant = { title: string; body: string };

const VARIANTS: Record<NotificationCategory, Variant[]> = {
  historias: [
    {
      title: "Un buen momento para compartir una historia",
      body: "Cuando ustedes lo deseen, la historia de hoy estará lista para acompañarlos.",
    },
    {
      title: "La historia de hoy está lista",
      body: "Un momento tranquilo para compartir en familia, cuando gusten.",
    },
  ],
  series: [
    { title: "Nuevo episodio disponible", body: "Ya pueden continuar la serie que están siguiendo." },
    { title: "Un nuevo capítulo los espera", body: "Continúen la historia cuando lo deseen." },
  ],
  "versiculo-del-dia": [
    { title: "El versículo de hoy está listo", body: "Una palabra para acompañar este día." },
    { title: "Una palabra para hoy", body: "El versículo del día ya está disponible." },
  ],
  "reflexion-del-dia": [
    { title: "La reflexión de hoy ya está disponible", body: "Un momento breve para compartir en familia." },
    { title: "Un momento para reflexionar juntos", body: "La reflexión de hoy está lista." },
  ],
  oraciones: [
    { title: "Una oración con ilustración nueva", body: "Una nueva forma de vivir este momento juntos." },
    { title: "Nueva ilustración disponible", body: "Una de sus oraciones tiene una imagen nueva." },
  ],
  "contenido-nuevo": [
    { title: "Contenido nuevo en Lumo", body: "Hay algo nuevo para descubrir en familia." },
    { title: "Recién publicado en Lumo", body: "Un nuevo cuento o reflexión ya está disponible." },
  ],
};

function pickVariant(category: NotificationCategory): Variant {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  const list = VARIANTS[category];
  return list[dayOfYear % list.length];
}

export type SendResult = { sent: number; skippedAntispam: number; skippedOptOut: number; removed: number };

export async function sendCategoryNotification(
  category: NotificationCategory,
  overrides?: { title?: string; body?: string; url?: string },
): Promise<SendResult> {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) throw new Error("Faltan las claves VAPID en el entorno");
  webpush.setVapidDetails("mailto:hola@lumoapp.com", vapidPublic, vapidPrivate);

  const variant = pickVariant(category);
  const title = overrides?.title ?? variant.title;
  const body = overrides?.body ?? variant.body;
  const url = overrides?.url ?? "/app";

  const subs = await allSubscriptions();
  const result: SendResult = { sent: 0, skippedAntispam: 0, skippedOptOut: 0, removed: 0 };
  const staleEndpoints: string[] = [];

  for (const sub of subs) {
    if (!sub.preferences?.[category]) {
      result.skippedOptOut++;
      continue;
    }

    const lastSent = await lastLogForDevice(sub.device_id);
    if (lastSent) {
      const hoursSince = (Date.now() - new Date(lastSent).getTime()) / 3_600_000;
      if (hoursSince < MIN_GAP_HOURS) {
        result.skippedAntispam++;
        continue;
      }
    }

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url }),
      );
      result.sent++;
      await insertPushLog({ device_id: sub.device_id, category, title });
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) staleEndpoints.push(sub.endpoint);
    }
  }

  if (staleEndpoints.length > 0) {
    await deleteSubscriptionsByEndpoint(staleEndpoints);
    result.removed = staleEndpoints.length;
  }

  return result;
}
