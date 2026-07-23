import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export type AudioLibrary = {
  music: Record<string, { url: string; prompt: string; durationMs: number }>;
  sfx: Record<string, { url: string; prompt: string; durationSeconds: number }>;
};

/** Lectura pública (sin auth) de la biblioteca reutilizable de música/SFX por mood o nombre. */
export async function GET() {
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "audio-library.json"), "utf8");
    const library: AudioLibrary = JSON.parse(raw);
    return NextResponse.json(library);
  } catch {
    return NextResponse.json({ music: {}, sfx: {} });
  }
}
