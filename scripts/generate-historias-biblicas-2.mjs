// Ilustración principal (una por episodio) de las 14 Historias Bíblicas nuevas que completan
// el lote inicial de 20 (ver content-library.ts, colección "historias-biblicas"). Mismo Master
// Block Pixar-cartoon ya aprobado para el resto del catálogo (CLAUDE.md, sistema unificado
// 2026-07-23) — un momento por historia, elegido por peso emocional/narrativo.
//
// Nota sobre "creacion-la-luz-y-la-vida": Adán y Eva se describen acá de forma autocontenida,
// sin usar characters/adan.md ni characters/eva.md ni los prompts de scripts/_prompts/P1-001_*
// — ese material es un proyecto aparte (formato de libro ilustrado 3:2) que el usuario pidió
// no tocar (2026-07-27). Esta ilustración es independiente, en el formato vertical estándar del
// resto de la app.
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
    slug: "creacion-la-luz-y-la-vida",
    scene:
      "The first man and first woman, warm dark and warm mid-tone skin respectively, both with simple natural coverings of large leaves, standing together in a lush garden at the exact moment of their creation, a soft warm divine light descending from above onto them both, expressions of pure wonder and awe looking upward, lush green garden with a gentle river in soft focus background, warm golden hour light, sacred and intimate mood.",
  },
  {
    slug: "abraham-la-promesa-de-las-estrellas",
    scene:
      "An elderly man with a long grey beard and simple earth-tone robes standing outside a tent at night, head tilted far back, looking up in awe at a sky completely filled with bright stars, arms slightly open in wonder, desert hills silhouetted in soft focus background, deep indigo night sky, warm campfire glow as key light from below, expression register: wonder.",
  },
  {
    slug: "jose-el-sonador",
    scene:
      "A young man with a torn multicolored tunic sitting alone at the bottom of a dry stone well, looking up toward a small circle of light far above, dignified sorrow on his face rather than fear, rough stone walls surrounding him in soft focus, warm dusty golden light filtering down from above, expression register: quiet determination amid sadness.",
  },
  {
    slug: "jose-en-egipto",
    scene:
      "A young man in fine Egyptian robes standing confidently before an ornate throne, speaking with calm authority, a distracted Pharaoh figure listening intently from the throne in soft focus background, warm golden palace light, tall stone columns softly blurred behind, expression register: quiet confidence and wisdom.",
  },
  {
    slug: "moises-canasta-en-el-rio",
    scene:
      "An elegant Egyptian princess kneeling at a riverbank among tall green reeds, gently lifting a small woven basket from the water, a swaddled baby visible inside looking up at her, soft compassionate expression on her face, the Nile river and reeds softly blurred in the background, warm morning sunlight, expression register: wonder and tenderness.",
  },
  {
    slug: "moises-la-zarza-que-ardia",
    scene:
      "A middle-aged shepherd man kneeling barefoot before a glowing bush engulfed in warm golden flames that do not consume it, one hand shielding his eyes from the brightness, sandals removed and set beside him, rocky desert mountainside in soft focus background, dramatic warm golden light from the burning bush as the sole key light, deep blue dusk sky, expression register: awe and reverence.",
  },
  {
    slug: "david-el-pastor-elegido",
    scene:
      "An elderly bearded prophet pouring oil from a horn onto the head of a young shepherd boy with a sling bag over his shoulder, both kneeling, the boy's older brothers watching in the soft-focus background, warm interior light of a simple home, golden hour glow, expression register: quiet wonder and humility.",
  },
  {
    slug: "david-y-jonatan-amigos-leales",
    scene:
      "Two young men embracing warmly in an open field at dusk, one wearing simple shepherd clothing with a sling bag, the other in a prince's fine tunic, both with emotional expressions of farewell and loyalty, tall grass and distant hills in soft focus background, warm dusk golden light, expression register: tender loyalty.",
  },
  {
    slug: "daniel-el-horno-de-fuego",
    scene:
      "Three young men standing calmly together inside a glowing furnace, surrounded by warm golden flames that do not touch them, their clothing and expressions completely serene and untouched by the fire, a fourth radiant glowing figure standing protectively beside them, stone furnace walls in soft focus background, dramatic warm golden light, expression register: serene courage.",
  },
  {
    slug: "josue-los-muros-de-jerico",
    scene:
      "A wide view of ancient stone city walls crumbling and falling outward in a great cloud of dust, a crowd of people below with arms raised in triumph, a leader figure with arms raised standing at the front, warm golden late-morning light, dramatic sense of scale, expression register: triumphant awe.",
  },
  {
    slug: "rut-la-lealtad-de-rut",
    scene:
      "A young woman embracing an elderly woman warmly on a dusty road, both with travel bundles beside them, tender determined expression on the young woman's face, simple road leading toward a distant town in soft focus background, warm late afternoon golden light, expression register: loyal tenderness.",
  },
  {
    slug: "elias-la-vasija-que-nunca-se-vacio",
    scene:
      "A humble woman in simple worn clothing pouring flour from a small clay vessel that glows faintly with warm golden light, a bearded traveler prophet watching gratefully nearby, a small child peeking from behind her skirts, simple sunbaked clay house interior in soft focus background, warm hearth light, expression register: quiet wonder and generosity.",
  },
  {
    slug: "elias-el-fuego-del-carmelo",
    scene:
      "A bearded prophet standing with arms raised beside a stone altar as a dramatic column of warm golden fire descends from the sky consuming it, a crowd of people falling to their knees in the soft-focus background, dramatic warm golden light against a deep blue sky, expression register: serene triumphant faith.",
  },
  {
    slug: "salomon-la-sabiduria-del-rey",
    scene:
      "A young king seated on an ornate throne, calm and thoughtful expression, two women standing before him in emotional distress, one reaching forward protectively, a small baby held gently between them, warm palace light, tall columns in soft focus background, expression register: wise compassion.",
  },
];

async function generateOne({ slug, scene }) {
  const fullPrompt = `${MASTER_BLOCK}\n\n${scene}`;
  console.log(`Generando ${slug}...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: fullPrompt, size: "1024x1536", quality: "high", n: 1 }),
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
        prompt: `scripts/generate-historias-biblicas-2.mjs (sistema unificado CLAUDE.md, 2026-07-27)`,
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
