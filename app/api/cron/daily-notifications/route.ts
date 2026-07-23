import { NextRequest, NextResponse } from "next/server";
import { sendCategoryNotification } from "@/lib/push/notification-manager";

/**
 * Disparado por vercel.json (`crons`) una vez al día. Vercel agrega automáticamente
 * `Authorization: Bearer $CRON_SECRET` — si no coincide, no es un llamado real de Vercel.
 * Cubre las 3 categorías de "todos los días si está activada": historias (recordatorio de
 * horario, hoy con un solo horario fijo para todos — ver limitación en
 * production/notifications/FASE0-PROPUESTA.md), versículo del día y reflexión del día.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const historias = await sendCategoryNotification("historias");
  const versiculo = await sendCategoryNotification("versiculo-del-dia");
  const reflexion = await sendCategoryNotification("reflexion-del-dia");

  return NextResponse.json({ historias, versiculo, reflexion });
}
