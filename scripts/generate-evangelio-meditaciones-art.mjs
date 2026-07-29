// Ilustración principal (una por episodio, LUMO-CONTENT-BIBLE.md §17) de las 12 piezas de
// Evangelio del día y las 5 Meditaciones guiadas (lib/content-catalog.ts, colecciones
// "evangelio-diario" y "meditaciones-guiadas", 2026-07-28). Mismo Master Block Pixar-cartoon ya
// aprobado para el resto del catálogo (CLAUDE.md, sistema unificado 2026-07-23). Los pares
// mañana/noche de un mismo pasaje comparten escena pero con iluminación distinta (CLAUDE.md §3.2:
// paleta "esperanza/alegría" cálida de día vs. "misterio/noche" azul profundo de noche).
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
  // Evangelio del día — Mateo 6:26, las aves del cielo
  {
    slug: "evangelio-manana-aves-del-cielo",
    scene:
      "A small brown sparrow perched on a sunlit olive branch, wings slightly open as if about to take flight, warm golden morning sunlight streaming through soft-focus green leaves, a gentle blue sky visible behind, warm amber and honey tones throughout, expression register: wonder and lightness, no human figures needed, the bird itself rendered with the same warmth and expressive large eye as a Pixar character.",
  },
  {
    slug: "evangelio-noche-aves-del-cielo",
    scene:
      "The same small brown sparrow now asleep, tucked into a cozy nest woven into an olive branch, head resting under its wing, a deep indigo night sky with soft stars visible behind soft-focus leaves, gentle silver moonlight as rim light, calm and peaceful mood, expression register: serene rest.",
  },
  // Evangelio del día — Mateo 5:14-16, la luz del mundo
  {
    slug: "evangelio-manana-luz-del-mundo",
    scene:
      "A young child with warm brown skin and a joyful expression cupping both hands together to shelter a small glowing warm-golden light between them, looking down at the light with wonder, soft morning interior setting with a window in soft focus background, warm amber glow illuminating the child's face from below, expression register: wonder and quiet joy.",
  },
  {
    slug: "evangelio-noche-luz-del-mundo",
    scene:
      "The same young child asleep in bed, a small warm-golden lantern glowing softly on the nightstand beside them, casting a warm circle of light against the deep blue night surrounding the room, soft focus window showing a starry sky, expression register: peaceful contentment.",
  },
  // Evangelio del día — Marcos 10:13-16, dejen que los niños vengan a mí
  {
    slug: "evangelio-manana-dejen-que-los-ninos-vengan",
    scene:
      "Jesus depicted as a warm, gentle figure in simple earth-tone robes, kneeling down with arms open wide, warmly welcoming a small group of joyful children running toward him, soft sunlit outdoor setting with olive trees in soft-focus background, warm golden daylight, expression register: joy and warm welcome.",
  },
  {
    slug: "evangelio-noche-dejen-que-los-ninos-vengan",
    scene:
      "Jesus depicted as a warm, gentle figure in simple earth-tone robes, sitting calmly with one hand resting gently on the head of a small sleepy child tucked against his side, soft twilight setting, deep blue dusk sky in soft-focus background, warm golden lantern light as key light, expression register: tender calm.",
  },
  // Evangelio del día — Lucas 6:31, la Regla de Oro
  {
    slug: "evangelio-manana-regla-de-oro",
    scene:
      "Two children of warm, differing skin tones facing each other, one handing the other half of a shared piece of bread with a warm smile, a sunny schoolyard in soft-focus background, warm bright daylight, expression register: joyful kindness.",
  },
  {
    slug: "evangelio-noche-regla-de-oro",
    scene:
      "The same two children now sitting side by side on a porch step at dusk, one wrapping a blanket around the other's shoulders, warm string lights glowing softly in soft-focus background, deep dusk blue sky, warm amber porch light, expression register: quiet gratitude.",
  },
  // Evangelio del día — Juan 13:34, ámense los unos a los otros
  {
    slug: "evangelio-manana-amense-los-unos-a-los-otros",
    scene:
      "A warm family group hug, a parent and two children with arms wrapped around each other, joyful warm morning light streaming through a window in soft-focus background, warm honey and amber color palette, expression register: joyful love.",
  },
  {
    slug: "evangelio-noche-amense-los-unos-a-los-otros",
    scene:
      "The same warm family embracing gently while sitting together on a bed, foreheads touching softly, a small warm lamp glowing on a nightstand in soft-focus background, deep calm blue night tones with warm amber key light, expression register: tender devotion.",
  },
  // Evangelio del día — Mateo 7:7, pidan y se les dará
  {
    slug: "evangelio-manana-pidan-y-se-les-dara",
    scene:
      "A young child standing before a glowing warm wooden door left slightly ajar, warm golden light spilling out from within, the child reaching toward the door with a hopeful, curious expression, soft-focus stone archway background, warm morning light, expression register: hopeful curiosity.",
  },
  {
    slug: "evangelio-noche-pidan-y-se-les-dara",
    scene:
      "The same young child kneeling beside a bed with hands clasped together in a simple prayer pose, a warm golden light glowing gently from just beyond a softly open door in the background, deep blue night tones in the room, warm amber light as the sole key light, expression register: quiet trust.",
  },
  // Meditaciones guiadas
  {
    slug: "meditacion-calma-antes-de-dormir",
    scene:
      "A sleepy young child floating peacefully on a soft, fluffy cloud shaped like a cozy nest, tucked under a warm blanket, eyes gently closed, a deep indigo night sky filled with soft twinkling stars surrounding the cloud, warm golden moonlight as rim light, expression register: deep serene calm.",
  },
  {
    slug: "meditacion-miedo-a-la-oscuridad",
    scene:
      "A young child sitting up gently in bed, cupping a small warm golden glowing light close to their chest like a tiny lantern, a softly lit bedroom around them with gentle shadows (not scary), a window showing a deep blue night sky with a few friendly stars, expression register: quiet reassurance and courage.",
  },
  {
    slug: "meditacion-gratitud-del-dia",
    scene:
      "A young child lying in bed at night, smiling softly with eyes closed, three small warm golden glowing orbs of light floating gently above their chest like little fireflies of gratitude, deep calm blue bedroom tones, warm amber glow from the orbs as the key light, expression register: peaceful contentment.",
  },
  {
    slug: "meditacion-paz-cuando-estoy-nervioso",
    scene:
      "A young child in bed at night releasing a small handful of soft glowing colorful balloons that float gently upward toward a deep indigo starry sky visible through the window, a calm relieved expression on the child's face, warm soft lamp light in the room, expression register: gentle relief and release.",
  },
  {
    slug: "meditacion-descansar-en-el-amor-de-dios",
    scene:
      "A young child asleep in bed, wrapped snugly in a soft glowing warm golden translucent blanket of light that seems to embrace them protectively, deep calm blue night bedroom tones surrounding the warm glow, expression register: deep peaceful security.",
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
        prompt: `scripts/generate-evangelio-meditaciones-art.mjs (sistema unificado CLAUDE.md, 2026-07-28)`,
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
