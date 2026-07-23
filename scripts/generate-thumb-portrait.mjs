// Generador genérico de Thumbnail Portrait (3:4) para episodios de contenido.
// Uso: node scripts/generate-thumb-portrait.mjs <slug>
// Lee el prompt de scripts/_prompts/<slug>.txt
import { readFileSync, mkdirSync } from "fs";
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

const slug = process.argv[2];
if (!slug) {
  console.error("Uso: node scripts/generate-thumb-portrait.mjs <slug>");
  process.exit(1);
}

const promptPath = path.join(ROOT, "scripts", "_prompts", `${slug}.txt`);
const PROMPT = readFileSync(promptPath, "utf-8").trim();

async function main() {
  console.log(`Generando ${slug} (thumbnail portrait 3:4)...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: PROMPT,
      size: "1024x1536",
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

  const out2x = path.join(dir, `${slug}_600.webp`);
  const out1x = path.join(dir, `${slug}_300.webp`);

  await sharp(buffer).resize(600, 800, { fit: "cover" }).webp({ quality: 85 }).toFile(out2x);
  await sharp(buffer).resize(300, 400, { fit: "cover" }).webp({ quality: 85 }).toFile(out1x);

  console.log("✓ guardado:", out1x, out2x);
}

main();
