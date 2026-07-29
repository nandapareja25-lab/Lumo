// Ilustraciones nuevas para la reconstrucción completa de la landing (2026-07-28) — mismo
// Master Block que el resto del catálogo de personajes (CLAUDE.md).
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const ROOT = process.cwd();
const raw = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
for (const line of raw.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Falta OPENAI_API_KEY en .env.local");
  process.exit(1);
}

const MASTER_BLOCK = `
3D cartoon render, Pixar animation studio quality,
soft volumetric lighting, no cel-shading, no flat illustration, no 2D cartoon,
subsurface scattering on organic surfaces,
heroic cartoon proportions: head is 35-40% of total body height,
rounded compact body, no sharp angular shapes,
all characters have large expressive eyes with visible white catchlight,
warm rim light separating every subject from the background,
background is subordinate to subject: maximum 3 contextual elements,
background slightly out of focus, most saturated color belongs to subject not background,
8k render quality, high detail facial features,
cinematic color grading, soft shadows, no hard edges,
photorealistic texture quality within cartoon proportions,
award-winning children's animation aesthetic,
absolutely no text, no titles, no letters, no words, no typography, no captions anywhere in the image — pure illustration only,
`.trim();

const ITEMS = [
  {
    slug: "landing-familia-tablet",
    scene:
      "A warm happy family of three (father, young son, young daughter) sitting together closely on a cozy couch, all smiling and looking down together at a glowing device/book between them, warm cream living room background softly out of focus, warm golden light, tender joyful togetherness mood.",
  },
  {
    slug: "landing-nino-orando-noche",
    scene:
      "A young girl kneeling by her bed at night with hands clasped together in prayer, eyes gently closed, peaceful smile, a smiling yellow star mascot character (rounded five-pointed star body, warm honey-yellow color, soft golden glow halo, dark navy blue eyes with catchlight) floating beside her, small glowing musical notes floating softly around, deep indigo night bedroom background with a window showing stars, warm golden rim light on both, serene magical bedtime mood.",
  },
  {
    slug: "landing-avatar-mama",
    scene:
      "A warm friendly young mother with wavy brown hair, gentle smile, portrait framing from shoulders up, solid soft cream background, simple and clean composition.",
  },
];

async function generateOne({ slug, scene }) {
  const fullPrompt = `${MASTER_BLOCK}\n\n${scene}`;
  console.log(`Generando ${slug}...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: fullPrompt, size: "1024x1024", quality: "high", n: 1 }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${slug}: ${res.status} ${detail}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${slug}: sin b64_json en la respuesta`);

  const dir = path.join(ROOT, "public", "lumo-art");
  mkdirSync(dir, { recursive: true });
  const filename = `${slug}.png`;
  writeFileSync(path.join(dir, filename), Buffer.from(b64, "base64"));

  return { slug, url: `/lumo-art/${filename}` };
}

async function main() {
  const dataPath = path.join(ROOT, "data", "landing-assets.json");
  const assets = JSON.parse(readFileSync(dataPath, "utf-8"));

  const only = process.argv.slice(2);
  const items = only.length > 0 ? ITEMS.filter((i) => only.includes(i.slug)) : ITEMS;

  for (const item of items) {
    try {
      const result = await generateOne(item);
      assets[result.slug] = {
        url: result.url,
        prompt: `scripts/generate-landing-v3-art.mjs (rebrand Estrella v3, 2026-07-28)`,
        approvedAt: new Date().toISOString(),
      };
      writeFileSync(dataPath, JSON.stringify(assets, null, 2));
      console.log(`✓ ${item.slug} guardado y registrado`);
    } catch (err) {
      console.error(`✗ ${item.slug} falló:`, err.message);
    }
  }

  console.log("Listo.");
}

main();
