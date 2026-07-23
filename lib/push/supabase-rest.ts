import type { PushSubscriptionRow, PushPreferences } from "./types";

/**
 * Acceso server-side a Supabase vía REST directo (sin @supabase/supabase-js): la service
 * role key salta RLS, y push_subscriptions/push_log no tienen policies a propósito — solo
 * el servidor puede tocarlas (ver production/notifications/schema.sql).
 */
function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function serviceHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function upsertPushSubscription(row: {
  device_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  preferences?: PushPreferences;
}) {
  const res = await fetch(`${baseUrl()}/rest/v1/push_subscriptions?on_conflict=endpoint`, {
    method: "POST",
    headers: { ...serviceHeaders(), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([row]),
  });
  if (!res.ok) throw new Error(`upsertPushSubscription: ${res.status} ${await res.text()}`);
}

export async function updatePreferencesForDevice(deviceId: string, preferences: PushPreferences) {
  const res = await fetch(
    `${baseUrl()}/rest/v1/push_subscriptions?device_id=eq.${encodeURIComponent(deviceId)}`,
    {
      method: "PATCH",
      headers: serviceHeaders(),
      body: JSON.stringify({ preferences }),
    },
  );
  if (!res.ok) throw new Error(`updatePreferencesForDevice: ${res.status} ${await res.text()}`);
}

export async function allSubscriptions(): Promise<PushSubscriptionRow[]> {
  const res = await fetch(`${baseUrl()}/rest/v1/push_subscriptions?select=*`, {
    headers: serviceHeaders(),
  });
  if (!res.ok) throw new Error(`allSubscriptions: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function deleteSubscriptionsByEndpoint(endpoints: string[]) {
  if (endpoints.length === 0) return;
  const list = endpoints.map((e) => `"${e}"`).join(",");
  const res = await fetch(`${baseUrl()}/rest/v1/push_subscriptions?endpoint=in.(${list})`, {
    method: "DELETE",
    headers: serviceHeaders(),
  });
  if (!res.ok) throw new Error(`deleteSubscriptionsByEndpoint: ${res.status} ${await res.text()}`);
}

export async function insertPushLog(row: { device_id: string; category: string; title: string }) {
  const res = await fetch(`${baseUrl()}/rest/v1/push_log`, {
    method: "POST",
    headers: serviceHeaders(),
    body: JSON.stringify([row]),
  });
  if (!res.ok) throw new Error(`insertPushLog: ${res.status} ${await res.text()}`);
}

/** Última vez (cualquier categoría) que se le envió algo a este dispositivo, para anti-spam. */
export async function lastLogForDevice(deviceId: string): Promise<string | null> {
  const res = await fetch(
    `${baseUrl()}/rest/v1/push_log?device_id=eq.${encodeURIComponent(deviceId)}&select=sent_at&order=sent_at.desc&limit=1`,
    { headers: serviceHeaders() },
  );
  if (!res.ok) throw new Error(`lastLogForDevice: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  return rows[0]?.sent_at ?? null;
}
