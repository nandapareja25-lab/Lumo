// Genera la narración real (voz oficial de Lumo) para cada segmento de cada ContentItem del
// catálogo (historias + oraciones), CON marcas de tiempo para subtítulos progresivos tipo
// subtítulo de película (nunca el párrafo completo de una vez). Un mp3 por segmento en
// public/lumo-audio/{id}-{index}.mp3, y un registro en data/content-audio.json
// ({ segments: [{ url, cues: [{text,start,end}] }] }) que /api/content-audio lee en runtime.
//
// Quién genera el audio es un detalle intercambiable (ver scripts/audio-providers/) — este
// script no sabe ni le importa si es ElevenLabs, OpenAI TTS, Google, Azure o Polly. Cambiar de
// proveedor es cambiar AUDIO_PROVIDER en .env.local, nunca este archivo.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { getAudioProvider } from "./audio-providers/index.mjs";

const ROOT = process.cwd();
const envPath = path.join(ROOT, ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const provider = getAudioProvider(env);
console.log(`Proveedor de audio: ${provider.id}`);

// content-catalog.ts es TypeScript (Node no lo ejecuta sin transpilar), así que parseamos el
// archivo fuente directamente en vez de importar el módulo.
const src = readFileSync(path.join(ROOT, "lib/content-catalog.ts"), "utf8");
const itemBlocks = src.split(/\n  \{\n/).slice(1).map((b) => "  {\n" + b);

function extractItems(text) {
  const items = [];
  const idRe = /id:\s*"([^"]+)"/;
  const capRe = /caption:\s*"((?:[^"\\]|\\.)*)"/g;
  for (const block of itemBlocks) {
    const idMatch = block.match(idRe);
    if (!idMatch) continue;
    const id = idMatch[1];
    const captions = [];
    let m;
    capRe.lastIndex = 0;
    while ((m = capRe.exec(block))) {
      captions.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"));
    }
    if (captions.length) items.push({ id, captions });
  }
  return items;
}

const onlyIds = process.argv.slice(2);
const items = extractItems(src).filter((it) => onlyIds.length === 0 || onlyIds.includes(it.id));
console.log(`Encontrados ${items.length} contenidos con segmentos${onlyIds.length ? ` (filtro: ${onlyIds.join(", ")})` : ""}.`);

const audioDir = path.join(ROOT, "public", "lumo-audio");
mkdirSync(audioDir, { recursive: true });

const registryPath = path.join(ROOT, "data", "content-audio.json");
const registry = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, "utf8")) : {};

for (const item of items) {
  const segments = [];
  for (let i = 0; i < item.captions.length; i++) {
    const file = `${item.id}-${i}.mp3`;
    const filePath = path.join(audioDir, file);
    try {
      const { audioBuffer, cues } = await provider.synthesize(item.captions[i]);
      writeFileSync(filePath, audioBuffer);
      segments.push({ url: `/lumo-audio/${file}`, cues });
      console.log(`✓ ${item.id} segmento ${i} (${cues.length} cues)`);
    } catch (e) {
      console.error(`✗ ${item.id} segmento ${i}:`, e.message);
      segments.push({ url: null, cues: [] });
    }
  }
  registry[item.id] = { provider: provider.id, generatedAt: new Date().toISOString(), segments };
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

console.log("Listo.");
