import { NextRequest, NextResponse } from "next/server";
import { getAsset } from "@/lib/landing-assets";
import { LandingSectionSlug } from "@/lib/landing-sections";

/** Lectura pública (sin auth) de una pose ya aprobada — para que las pantallas cliente de Lumo la consuman. */
export async function GET(request: NextRequest) {
  const pose = request.nextUrl.searchParams.get("pose") as LandingSectionSlug | null;
  if (!pose) {
    return NextResponse.json({ error: "Falta ?pose=" }, { status: 400 });
  }
  const asset = await getAsset(pose);
  return NextResponse.json({ url: asset?.url ?? null });
}
