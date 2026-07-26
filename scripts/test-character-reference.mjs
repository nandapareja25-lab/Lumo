// Validación del Riesgo 2 (motor de video, piloto "El frasco que esperaba el domingo"):
// ¿/v1/images/edits realmente ancla la identidad de un personaje a partir de una imagen de
// referencia, o solo la usa como inspiración vaga? Prueba con David (personaje ya aprobado,
// con Golden Master real) en una pose nueva que nunca se generó antes — comparar el resultado
// contra las referencias existentes decide si el mecanismo del motor es viable tal cual, o si
// hace falta ajustar el prompt/mecánica antes de construir el resto del pipeline.
//
// Uso: node scripts/test-character-reference.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { getImageProvider } from "./image-providers/index.mjs";

const ROOT = process.cwd();
const env = Object.fromEntries(
  readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const provider = getImageProvider(env);
const referencePath = path.join(ROOT, "public/lumo-art/david_circle_default_400.webp");

const TESTS = [
  {
    slug: "test-david-sentado-orando-noche",
    prompt:
      "3D cartoon render, Pixar animation studio quality, soft volumetric lighting, no cel-shading, " +
      "heroic cartoon proportions: head is 35-40% of total body height, rounded compact body, " +
      "large expressive eyes with visible white catchlight, warm rim light separating subject from background, " +
      "cinematic color grading, 8k render quality, award-winning children's animation aesthetic, " +
      "the same character David — young shepherd boy, sling bag over shoulder, earth-tone tunic, " +
      "curly brown hair, warm brown skin, sitting cross-legged on the ground at night, hands clasped together, " +
      "eyes closed in quiet prayer, gentle serene expression, deep blue-indigo night ambient light, " +
      "soft moonlight rim light, simple hillside background at night with a few stars (max 3 elements), " +
      "vertical composition, character fills 55% of frame, absolutely no text",
  },
  {
    slug: "test-david-caminando-dia",
    prompt:
      "3D cartoon render, Pixar animation studio quality, soft volumetric lighting, no cel-shading, " +
      "heroic cartoon proportions: head is 35-40% of total body height, rounded compact body, " +
      "large expressive eyes with visible white catchlight, warm rim light separating subject from background, " +
      "cinematic color grading, 8k render quality, award-winning children's animation aesthetic, " +
      "the same character David — young shepherd boy, sling bag over shoulder, earth-tone tunic, " +
      "curly brown hair, warm brown skin, walking confidently mid-stride, three-quarter angle, " +
      "warm daytime sunlight key light, soft sky-blue fill light, golden rim light, " +
      "simple rolling hills background, daylight, max 3 background elements, " +
      "vertical composition, character fills 55% of frame, absolutely no text",
  },
];

const outDir = path.join(ROOT, "production/video-drafts/_risk-validation");
mkdirSync(outDir, { recursive: true });

async function main() {
  console.log(`Proveedor de imagen: ${provider.id}`);
  console.log(`Referencia: ${referencePath}\n`);

  for (const test of TESTS) {
    console.log(`Generando: ${test.slug}...`);
    const { imageBuffer } = await provider.generate({
      prompt: test.prompt,
      referenceImagePaths: [referencePath],
      size: "1024x1536",
    });
    const outPath = path.join(outDir, `${test.slug}.png`);
    writeFileSync(outPath, imageBuffer);
    console.log(`✓ guardado: ${outPath}`);
  }

  console.log("\nListo. Comparar visualmente contra public/lumo-art/david_circle_default_400.webp");
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
