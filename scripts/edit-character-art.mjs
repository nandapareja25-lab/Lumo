// Edición dirigida sobre la candidata Golden Master de fondo claro — mantiene expresión,
// encuadre, proporciones y materiales; ajusta solo fondo/alas/color bleeding pedidos.
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

const EDIT_PROMPT = `
Keep the exact same character, expression, pose, framing, proportions, and materials.
Only make these changes:
- replace the circular vignette/halo behind the character with a warm, very subtle ambient
  gradient background, low contrast, no hard circular edge
- slightly increase the iridescence and definition of the translucent wings (more visible
  blue-green-lavender shimmer and wing vein detail)
- increase warm golden color bleeding from the glowing abdomen onto the chin, torso, and arms
- keep the background low contrast so the character remains the clear subject
Do not change anything else about the character or composition.
`.trim();

async function main() {
  const srcPath = path.join(ROOT, "public", "lumo-art", "lumo_circle_default-light-candidate_400x400.webp");
  const tmpPng = path.join(ROOT, "public", "lumo-art", "_tmp-edit-source.png");
  await sharp(srcPath).resize(1024, 1024).png().toFile(tmpPng);

  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", EDIT_PROMPT);
  form.append("size", "1024x1024");
  form.append("quality", "high");
  const fileBuffer = readFileSync(tmpPng);
  form.append("image", new Blob([fileBuffer], { type: "image/png" }), "source.png");

  console.log("Editando lumo_circle_default-light-candidate...");
  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${detail}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("sin b64_json en la respuesta");

  const buffer = Buffer.from(b64, "base64");
  const dir = path.join(ROOT, "public", "lumo-art");
  const out2x = path.join(dir, "lumo_circle_default-light-candidate-v2_400x400.webp");
  const out1x = path.join(dir, "lumo_circle_default-light-candidate-v2_200x200.webp");

  await sharp(buffer).resize(400, 400, { fit: "cover" }).webp({ quality: 85 }).toFile(out2x);
  await sharp(buffer).resize(200, 200, { fit: "cover" }).webp({ quality: 85 }).toFile(out1x);

  console.log("✓ guardado:");
  console.log(" -", out1x);
  console.log(" -", out2x);
}

main();
