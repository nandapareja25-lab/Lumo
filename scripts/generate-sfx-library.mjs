// Genera efectos de sonido REUTILIZABLES (LUMO-CONTENT-BIBLE.md sección 13) — no por episodio.
// Empieza con el pequeño set que necesita "El buen samaritano"; se amplía a medida que otras
// historias lo necesiten, nunca se regenera lo que ya existe. Guarda en /public/lumo-sfx/{name}.mp3
// y registra en data/audio-library.json.
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

const SFX = {
  "pasos-camino-rocoso": { prompt: "Footsteps walking slowly on a rocky desert dirt path, outdoors, warm and natural, no music", duration: 3 },
  "viento-desierto": { prompt: "Gentle desert wind ambience, soft and warm, no music, subtle background texture", duration: 4 },
  "burro-resoplido": { prompt: "A donkey's soft snort and gentle hoofsteps, warm and friendly, no music", duration: 3 },
  "tela-vendaje": { prompt: "Soft cloth fabric rustling and tearing gently, close-up, no music", duration: 2 },
  "monedas": { prompt: "A couple of coins clinking together softly in a hand, warm and gentle, no music", duration: 2 },
};

async function generateOne(name, { prompt, duration }) {
  console.log(`Generando SFX: ${name}...`);
  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: prompt, duration_seconds: duration }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${name}: ${res.status} ${detail.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const dir = path.join(ROOT, "public", "lumo-sfx");
  mkdirSync(dir, { recursive: true });
  const filename = `${name}.mp3`;
  writeFileSync(path.join(dir, filename), buf);
  return { name, url: `/lumo-sfx/${filename}`, prompt };
}

async function main() {
  const registryPath = path.join(ROOT, "data", "audio-library.json");
  const registry = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, "utf-8")) : { music: {}, sfx: {} };

  const onlyNames = process.argv.slice(2);
  const entries = Object.entries(SFX).filter(([n]) => onlyNames.length === 0 || onlyNames.includes(n));

  for (const [name, spec] of entries) {
    try {
      const result = await generateOne(name, spec);
      registry.sfx[name] = { url: result.url, prompt: spec.prompt, durationSeconds: spec.duration, generatedAt: new Date().toISOString() };
      writeFileSync(registryPath, JSON.stringify(registry, null, 2));
      console.log(`✓ SFX ${name} guardado`);
    } catch (err) {
      console.error(`✗ SFX ${name} falló:`, err.message);
    }
  }
  console.log("Listo.");
}

main();
