// Genera la biblioteca de música ambiental REUTILIZABLE (LUMO-CONTENT-BIBLE.md sección 12) — una
// pista por mood (los 6 ya usados en toda la app para ilustraciones/escenas), no una composición
// nueva por episodio. Guarda en /public/lumo-music/{mood}.mp3 y registra en data/audio-library.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const ROOT = process.cwd();

function loadEnvLocal() {
  const raw = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
  }
}
loadEnvLocal();

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Falta ELEVENLABS_API_KEY en .env.local");
  process.exit(1);
}

// Prompt base compartido (identidad sonora de marca) + variación específica por mood.
const BASE = "Instrumental ambient background music for a warm, gentle Christian family storytelling app for children. No lyrics, no vocals, no percussion drums, loopable, cinematic but understated — must sit quietly behind spoken narration, never compete with a voice.";

const MOODS = {
  family: `${BASE} Mood: cozy, warm, safe, gentle strings and soft piano, hopeful and tender, like a family gathered together.`,
  book: `${BASE} Mood: curious, light, wonder-filled, gentle woodwinds and soft strings, a storytelling once-upon-a-time feeling.`,
  prayer: `${BASE} Mood: soft, reverent, intimate, slow piano and warm strings, tender and still.`,
  diary: `${BASE} Mood: reflective, calm, introspective, sparse soft piano, quiet and personal.`,
  night: `${BASE} Mood: hushed, mysterious but safe (never scary), slow low strings, gentle tension without fear.`,
  threshold: `${BASE} Mood: a moment of decision or crossing over, subtle uplifting build, hopeful strings, quiet anticipation.`,
};

const TRACK_LENGTH_MS = 30000; // 30s, loopable

async function generateOne(mood, prompt) {
  console.log(`Generando música: ${mood}...`);
  const res = await fetch("https://api.elevenlabs.io/v1/music", {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, music_length_ms: TRACK_LENGTH_MS }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${mood}: ${res.status} ${detail.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const dir = path.join(ROOT, "public", "lumo-music");
  mkdirSync(dir, { recursive: true });
  const filename = `${mood}.mp3`;
  writeFileSync(path.join(dir, filename), buf);
  return { mood, url: `/lumo-music/${filename}`, prompt };
}

async function main() {
  const registryPath = path.join(ROOT, "data", "audio-library.json");
  const registry = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, "utf-8")) : { music: {}, sfx: {} };

  const onlyMoods = process.argv.slice(2);
  const entries = Object.entries(MOODS).filter(([m]) => onlyMoods.length === 0 || onlyMoods.includes(m));

  for (const [mood, prompt] of entries) {
    try {
      const result = await generateOne(mood, prompt);
      registry.music[mood] = { url: result.url, prompt, durationMs: TRACK_LENGTH_MS, generatedAt: new Date().toISOString() };
      writeFileSync(registryPath, JSON.stringify(registry, null, 2));
      console.log(`✓ música ${mood} guardada`);
    } catch (err) {
      console.error(`✗ música ${mood} falló:`, err.message);
    }
  }
  console.log("Listo.");
}

main();
