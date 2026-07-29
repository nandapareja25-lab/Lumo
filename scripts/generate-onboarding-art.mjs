// Ilustraciones del onboarding (rebrand "Estrella" v2, 2026-07-28) — pasos que la referencia
// del usuario muestra con arte real (bienvenida, para quién x3, edad x3, casi listo). Usa el
// MISMO Master Block que el resto de las ilustraciones de personajes de la app (CLAUDE.md,
// sistema unificado — ver scripts/generate-historias-biblicas-2.mjs), para que las imágenes
// nuevas se sientan del mismo universo visual que las historias/cuentos ya existentes, no un
// estilo aparte (pedido explícito del usuario, 2026-07-28).
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

const STYLE = `
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
    slug: "onboarding-bienvenida",
    scene:
      "A happy child sitting cross-legged, smiling warmly, holding a glowing open book (blank glowing pages, no text), a rainbow arching in the soft pastel sky background, fluffy white clouds, a cute smiling yellow star mascot with a face floating nearby, warm golden light, joyful welcoming mood.",
  },
  {
    slug: "onboarding-para-quien-hija",
    scene:
      "A cheerful young girl with wavy brown hair and a headband, resting her chin on her hand, smiling sweetly, solid warm pink background, simple and clean composition, portrait framing.",
  },
  {
    slug: "onboarding-para-quien-hijo",
    scene:
      "A cheerful young boy with short brown curly hair wearing a hoodie, big smile, waving, solid warm blue background, simple and clean composition, portrait framing.",
  },
  {
    slug: "onboarding-para-quien-familia",
    scene:
      "A happy family of four (father, mother, young boy, young girl) smiling together, arms around each other, solid warm green background, simple and clean composition, portrait framing.",
  },
  {
    slug: "onboarding-edad-3-5",
    scene:
      "A tiny toddler sitting and hugging a small fluffy white lamb, both smiling, solid warm purple/lavender background, simple and clean composition, portrait framing.",
  },
  {
    slug: "onboarding-edad-6-8",
    scene:
      "A young boy wearing a small backpack and a baseball cap, holding an open book and smiling, solid warm blue background, simple and clean composition, portrait framing.",
  },
  {
    slug: "onboarding-edad-9-12",
    scene:
      "A young girl with long hair reading an open book with a gentle smile, solid warm green background, simple and clean composition, portrait framing.",
  },
  {
    slug: "onboarding-casi-listo",
    scene:
      "A family (father, mother, young child) sitting together on a cozy couch reading a glowing open book together, warm living room, a cute smiling yellow star mascot floating happily above them, warm golden light, tender heartwarming mood.",
  },
];

async function generateOne({ slug, scene }) {
  const fullPrompt = `${STYLE}\n\n${scene}`;
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
        prompt: `scripts/generate-onboarding-art.mjs (rebrand Estrella v2, 2026-07-28)`,
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
