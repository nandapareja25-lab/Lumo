// Regenera una de las 5 imágenes de familia de la landing, sobrescribiendo el mismo archivo
// (mismo nombre, mismo path en public/lumo-art) — nunca agrega un archivo nuevo al lado.
// Uso: node scripts/generate-familia-art.mjs <slug> <orientation>
//   orientation: landscape | portrait | square
import { readFileSync, writeFileSync } from "fs";
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

const [slug, orientation] = process.argv.slice(2);
if (!slug || !orientation) {
  console.error("Uso: node scripts/generate-familia-art.mjs <slug> <landscape|portrait|square>");
  process.exit(1);
}

const SIZE = { landscape: "1536x1024", portrait: "1024x1536", square: "1024x1024" }[orientation];
if (!SIZE) {
  console.error("orientation debe ser landscape, portrait o square");
  process.exit(1);
}

const promptPath = path.join(ROOT, "scripts", "_prompts", `${slug}.txt`);
const PROMPT = readFileSync(promptPath, "utf-8").trim();

async function main() {
  console.log(`Generando ${slug} (${orientation}, ${SIZE})...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: PROMPT, size: SIZE, quality: "high", n: 1 }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${detail}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("sin b64_json en la respuesta");

  const outPath = path.join(ROOT, "public", "lumo-art", `${slug}.png`);
  writeFileSync(outPath, Buffer.from(b64, "base64"));
  console.log("✓ sobrescrito:", outPath);
}

main();
