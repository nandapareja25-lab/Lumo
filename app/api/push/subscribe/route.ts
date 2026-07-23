import { NextRequest, NextResponse } from "next/server";
import { upsertPushSubscription, updatePreferencesForDevice } from "@/lib/push/supabase-rest";
import { DEFAULT_PREFERENCES } from "@/lib/push/types";

export async function POST(req: NextRequest) {
  const { deviceId, endpoint, keys, preferences } = await req.json();
  if (!deviceId || !endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }
  await upsertPushSubscription({
    device_id: deviceId,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    preferences: preferences ?? DEFAULT_PREFERENCES,
  });
  return NextResponse.json({ ok: true });
}

/** Actualiza solo las preferencias por categoría de un dispositivo ya suscrito. */
export async function PATCH(req: NextRequest) {
  const { deviceId, preferences } = await req.json();
  if (!deviceId || !preferences) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }
  await updatePreferencesForDevice(deviceId, preferences);
  return NextResponse.json({ ok: true });
}
