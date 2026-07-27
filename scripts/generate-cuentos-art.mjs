// Genera la ilustración principal (una por episodio, LUMO-CONTENT-BIBLE.md §17) de los 15
// Cuentos con valores — el único gap de ilustración que quedaba en el catálogo (guion + audio
// real ya existían, ver data/content-audio.json). Mismo Master Block que las historias bíblicas
// ya aprobadas (CLAUDE.md, sistema unificado 2026-07-23) para no mezclar dos estilos dentro de
// la misma experiencia de "Historias". Guarda en public/lumo-art/{id}.png y registra en
// data/landing-assets.json bajo el mismo slug que ya usa illustrationSlug en content-catalog.ts.
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

// Un ítem por cuento — el momento de mayor peso emocional de cada historia (CLAUDE.md §7.2),
// con el descriptor icónico de cada personaje para pasar el silhouette test (§2.3) sin
// necesitar una Character Card completa (son personajes originales de una sola aparición, no
// recurrentes en la app como Jesús/Lumo/etc.).
const ITEMS = [
  {
    slug: "cuento-honestidad-vaso-roto",
    scene:
      "A young boy with a messy cowlick and a striped shirt kneeling beside his grandmother, holding out the broken pieces of a hand-painted ceramic cup wrapped in a cloth, his face showing brave vulnerability; his grandmother — silver hair in a bun, warm cardigan — kneeling down with a soft understanding smile, reaching to hug him. Warm living room with a wooden cabinet in soft focus background. Warm afternoon light, amber and cream tones. Expression register: determination softening into relief.",
  },
  {
    slug: "cuento-generosidad-la-ultima-galleta",
    scene:
      "A girl with two braids offering a single oatmeal cookie on her open palm to a new neighbor girl standing shyly in a doorway, while her younger brother watches with a warm smile beside her. Golden late-afternoon light through a doorway, simple porch step and a glimpse of a moving-boxes-filled house in soft focus background. Expression register: joy and warmth.",
  },
  {
    slug: "cuento-paciencia-la-semilla-que-tardaba",
    scene:
      "A boy in pajamas crouching in wonder over a small terracotta pot where a tiny green sunflower sprout has just emerged, morning sunlight streaming across a simple backyard patio, an elderly neighbor's garden with tall rosebushes softly visible in the background. Expression register: wonder/curiosity.",
  },
  {
    slug: "cuento-perdon-el-barrilete-enredado",
    scene:
      "A boy and a girl sitting together on a living room floor, carefully mending a torn sky-blue kite with tape between them, both looking at each other with warm forgiving smiles, sunlight through a window. Simple living room in soft focus background. Expression register: joy after resolved tension.",
  },
  {
    slug: "cuento-valentia-la-cueva-oscura",
    scene:
      "A boy and his older cousin girl standing just inside a small cave entrance, flashlight beam illuminating a rubber ball resting against a rock, both wide-eyed with a mix of courage and wonder, soft moonlight silhouette of hills visible through the cave opening behind them. Night, cool blue-indigo ambient light with warm flashlight glow as key light. Expression register: determination and wonder.",
  },
  {
    slug: "cuento-gratitud-el-dia-que-no-vio-el-sol",
    scene:
      "A young boy crouched close to a lemon tree trunk in a rainy backyard, delighted to discover a small snail leaving a silvery trail, raindrops visible around him, soft grey daylight with warm undertones. Simple wet patio in soft focus background. Expression register: curiosity and quiet joy.",
  },
  {
    slug: "cuento-humildad-el-mejor-dibujante",
    scene:
      "A girl and a quiet boy sitting side by side at a school desk, both looking with genuine admiration at a colorful abstract drawing full of impossible shapes and colors spread on the table between them, warm classroom light. Expression register: curiosity and warmth.",
  },
  {
    slug: "cuento-perseverancia-la-bicicleta-sin-rueditas",
    scene:
      "A boy riding a sky-blue bicycle without training wheels down a gentle grassy hill, hair flying, huge triumphant open-mouthed smile, arms confident on the handlebars, his father running behind out of breath with joy. Warm golden daylight, simple park hill in soft focus background. Expression register: joy/triumph.",
  },
  {
    slug: "cuento-amabilidad-el-nuevo-de-la-clase",
    scene:
      "A girl with two braids extending her hand warmly toward a shy new boy standing alone near a school wall, other children blurred playing tag in the background, warm daylight school patio. Expression register: warmth and kindness.",
  },
  {
    slug: "cuento-trabajo-en-equipo-el-puente-de-piedras",
    scene:
      "Four children of mixed ages standing together on a small stone bridge they just finished building across a narrow creek, holding hands up in celebration, golden late-afternoon light reflecting on the water, simple creek banks in soft focus background. Expression register: joy/triumph.",
  },
  {
    slug: "cuento-respeto-las-reglas-del-arenero",
    scene:
      "Three children of different ages — an older boy, a girl, and a small toddler boy — sitting together building a sandcastle with four towers in a sunny sandbox, all smiling and collaborating, simple playground in soft focus background. Warm daylight. Expression register: joy.",
  },
  {
    slug: "cuento-autocontrol-el-frasco-de-mermelada",
    scene:
      "A grandmother ceremoniously unveiling a glass jar of golden peach jam at a table full of warm breakfast toast and steaming cups, a young boy watching with wide delighted eyes, warm Sunday morning light through a kitchen window. Expression register: joy and pride.",
  },
  {
    slug: "cuento-empatia-el-companero-triste",
    scene:
      "A girl with two braids sitting close beside a sad boy on a concrete school step, her hand gently near his shoulder, both looking at a small drawing of a brown dog they are making together, soft afternoon light, empty schoolyard in soft focus background. Expression register: quiet empathy.",
  },
  {
    slug: "cuento-responsabilidad-el-perro-que-dependia-de-mi",
    scene:
      "A boy in pajamas sitting on the floor at night, gently refilling a water bowl for a small brown puppy with one floppy ear who drinks eagerly, warm lamp light glowing beside them, simple living room in soft focus background. Night, warm lamp key light with cool ambient fill. Expression register: quiet tenderness.",
  },
  {
    slug: "cuento-esperanza-el-arbol-caido",
    scene:
      "A girl and her grandfather kneeling together planting a small oak sapling in freshly turned soil right beside a fallen tree trunk, soft hopeful morning light after a storm, simple backyard with the fallen tree in soft focus background. Expression register: quiet hope.",
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

  return { slug, url: `/lumo-art/${filename}`, fullPrompt };
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
        prompt: `scripts/generate-cuentos-art.mjs (sistema unificado CLAUDE.md, 2026-07-27)`,
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
