#!/usr/bin/env node
/**
 * Dispara una notificación push real por categoría, contra /api/push/send de la app
 * desplegada. Uso desde el pipeline de producción (Deploy Team / Content Team) al integrar
 * un episodio nuevo o una ilustración de oración:
 *
 *   node scripts/notify-push.mjs series
 *   node scripts/notify-push.mjs oraciones --title "..." --body "..." --url "/reproducir/x"
 *
 * Requiere LUMO_APP_URL (dominio real de producción, ej. https://lumo.vercel.app) y
 * PUSH_INTERNAL_SECRET en el entorno — el mismo secreto que usa app/api/push/send/route.ts.
 */
import "dotenv/config";

const [category, ...rest] = process.argv.slice(2);
if (!category) {
  console.error("Uso: node scripts/notify-push.mjs <categoria> [--title ...] [--body ...] [--url ...]");
  process.exit(1);
}

function flag(name) {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? undefined : rest[i + 1];
}

const appUrl = process.env.LUMO_APP_URL;
const secret = process.env.PUSH_INTERNAL_SECRET;
if (!appUrl || !secret) {
  console.error("Faltan LUMO_APP_URL o PUSH_INTERNAL_SECRET en el entorno (.env.local).");
  process.exit(1);
}

const res = await fetch(`${appUrl}/api/push/send`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-push-secret": secret },
  body: JSON.stringify({
    category,
    title: flag("title"),
    body: flag("body"),
    url: flag("url"),
  }),
});

const data = await res.json();
console.log(res.status, data);
