// Captura screenshots REALES de la app corriendo (para usar en la Landing en vez de mockups o
// escenas ilustradas). Usa Chrome del sistema vía puppeteer-core — no descarga un browser propio.
// Requiere que `npm run dev` (o el preview) ya esté corriendo en localhost:3000.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";
import path from "path";

const ROOT = process.cwd();
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = path.join(ROOT, "public", "lumo-screens");
mkdirSync(OUT_DIR, { recursive: true });

const SHOTS = [
  { name: "player", url: "http://localhost:3000/reproducir/buen-samaritano", waitMs: 2000 },
  { name: "orar", url: "http://localhost:3000/app/orar", waitMs: 800 },
  { name: "diario", url: "http://localhost:3000/app/historia/buen-samaritano/diario", waitMs: 800 },
  { name: "home", url: "http://localhost:3000/app", waitMs: 800 },
  { name: "explorar", url: "http://localhost:3000/app/explorar", waitMs: 800 },
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });

  for (const shot of SHOTS) {
    await page.goto(shot.url, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, shot.waitMs));
    const filePath = path.join(OUT_DIR, `${shot.name}.png`);
    await page.screenshot({ path: filePath });
    console.log(`✓ ${shot.name} -> ${filePath}`);
  }

  await browser.close();
  console.log("Listo.");
}

main();
