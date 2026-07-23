import { NextRequest, NextResponse } from "next/server";
import { sendCategoryNotification } from "@/lib/push/notification-manager";
import type { NotificationCategory } from "@/lib/push/types";

/**
 * Ruta interna — usada por scripts de producción (nuevo episodio, nueva ilustración de
 * oración) y por el cron diario, nunca por el cliente. Protegida con un secreto propio,
 * no con el ADMIN_PASSWORD (distintos propósitos).
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-push-secret");
  if (!secret || secret !== process.env.PUSH_INTERNAL_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { category, title, body, url } = (await req.json()) as {
    category: NotificationCategory;
    title?: string;
    body?: string;
    url?: string;
  };

  if (!category) return NextResponse.json({ error: "Falta category" }, { status: 400 });

  const result = await sendCategoryNotification(category, { title, body, url });
  return NextResponse.json(result);
}
