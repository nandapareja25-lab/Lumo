// Regenera las 3 poses oficiales de Lumo (lumo-frontal, lumo-feliz, lumo-volando) con el nuevo
// diseño de estrella sonriente (rebrand "Estrella", 2026-07-28, ver characters/lumo.md).
// Reemplaza el diseño anterior de luciérnaga — mismo nombre, misma voz, solo cambia la
// apariencia ilustrada. Mismo set de 3 poses de siempre, sin agregar nuevas.
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

// Mismo Master Block que el resto de las ilustraciones de personajes de la app (CLAUDE.md,
// sistema unificado — ver scripts/generate-historias-biblicas-2.mjs) + la descripción específica
// de Lumo (characters/lumo.md) encima, para que la mascota se sienta del mismo universo visual
// que David/Moisés/etc. y no un estilo aparte (pedido explícito del usuario, 2026-07-28).
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

const CHARACTER_BLOCK = `
${MASTER_BLOCK}

a smiling yellow star character, cartoon star mascot,
rounded five-pointed star body (never sharp/geometric points, always soft and rounded),
warm honey-yellow body color (#F6C945), soft warm golden glow halo always visible around the character,
dark navy blue iris (#10204A), rosy pink blush on cheeks,
short rounded arms and legs with no defined fingers (soft mitten-like),
no sharp edges anywhere, no realistic star-shape proportions,
`.trim();

const ITEMS = [
  {
    slug: "lumo-frontal",
    scene:
      "Full body, standing facing forward, arms relaxed at the sides, gentle warm smile, neutral welcoming pose, seamless soft warm cream background (#FFFDF7), soft ambient light, no other elements in the scene.",
  },
  {
    slug: "lumo-feliz",
    scene:
      "Full body, both arms raised up joyfully in celebration, wide open eyes shaped like happy arcs, huge joyful smile, slight bounce in the pose as if jumping with excitement, seamless soft warm cream background (#FFFDF7), soft ambient light, no other elements in the scene.",
  },
  {
    slug: "lumo-volando",
    scene:
      "Full body, leaning forward as if floating/flying through the air, arms trailing back gently, a soft warm golden trail of light behind it suggesting motion, joyful expression, seamless soft warm cream background (#FFFDF7), soft ambient light, no other elements in the scene.",
  },
];

async function generateOne({ slug, scene }) {
  const fullPrompt = `${CHARACTER_BLOCK}\n\n${scene}`;
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
  const filename = `${slug}-${Date.now()}.png`;
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
        prompt: `scripts/generate-lumo-star.mjs (rebrand Estrella, 2026-07-28)`,
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
