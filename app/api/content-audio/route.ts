import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export type AudioCue = { text: string; start: number; end: number };
export type AudioSegment = { url: string | null; cues: AudioCue[] };
type AudioRegistry = Record<string, { provider: string; generatedAt: string; segments: AudioSegment[] }>;

/** Lectura pública (sin auth) del audio narrado (+ marcas de tiempo para subtítulos progresivos) ya generado para un ContentItem, por id. */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta ?id=" }, { status: 400 });
  }
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "content-audio.json"), "utf8");
    const registry: AudioRegistry = JSON.parse(raw);
    return NextResponse.json({ segments: registry[id]?.segments ?? null });
  } catch {
    return NextResponse.json({ segments: null });
  }
}
