// Candidata Golden Master — Circle Portrait de Lumo, variante de fondo claro.
// Única variable que cambia respecto al original: SCENE (fondo) y el ambient fill del
// entorno. Pose, expresión, encuadre, proporciones, luz propia del personaje, materiales y
// nivel de detalle quedan idénticos — ver scripts/generate-character-art.mjs para el original.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";

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

const PROMPT = `
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

Lumo, a small cartoon firefly character,
oversized expressive eyes with double catchlight
(white specular highlight plus warm golden reflection from own bioluminescence),
dark forest-green compact rounded body,
glowing bioluminescent abdomen emitting warm golden light (#FFD740),
short rounded antennae with small golden ball tips,
two pairs of translucent iridescent wings
with subtle blue-green-lavender shimmer,
Lumo's bioluminescent glow casts warm golden color bleeding
on any nearby surfaces and characters,

seamless soft warm cream background (#FAF3EE), neutral and minimal,
no scene elements, no props, gentle warm halo glow radiating from Lumo
blending softly into the light background,

head tilted 15 degrees, one antenna higher than the other,
eyes wide open with wonder, soft gentle smile, leaning slightly forward,

Lumo's bioluminescent abdomen is the primary light source on the character,
warm golden key light from below-center,
soft warm cream ambient fill matching the background,
golden rim light from own glow,
gentle warm color bleeding halo around the character blending into the light backdrop,

circular portrait composition,
head and upper body only,
subject looking slightly toward camera in 3/4 view,
face fills 70% of circle area,
neutral light background,
intimate portrait framing
`.trim();

async function main() {
  console.log("Generando lumo_circle_default (variante fondo claro)...");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: PROMPT,
      size: "1024x1024",
      quality: "high",
      n: 1,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${detail}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("sin b64_json en la respuesta");

  const dir = path.join(ROOT, "public", "lumo-art");
  mkdirSync(dir, { recursive: true });
  const buffer = Buffer.from(b64, "base64");

  const out2x = path.join(dir, "lumo_circle_default-light-candidate_400x400.webp");
  const out1x = path.join(dir, "lumo_circle_default-light-candidate_200x200.webp");

  await sharp(buffer).resize(400, 400, { fit: "cover" }).webp({ quality: 85 }).toFile(out2x);
  await sharp(buffer).resize(200, 200, { fit: "cover" }).webp({ quality: 85 }).toFile(out1x);

  console.log("✓ guardado:");
  console.log(" -", out1x);
  console.log(" -", out2x);
}

main();
