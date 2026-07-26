import { readFileSync } from "node:fs";
import { resolvePlan } from "./asset-library.mjs";

const contentId = process.argv[2];
if (!contentId) {
  console.error("Uso: node scripts/video-engine/resolve-pilot-plan.mjs <contentId>");
  process.exit(1);
}

const planPath = `production/video-drafts/${contentId}/shot-plan.json`;
const plan = JSON.parse(readFileSync(planPath, "utf8"));
const allNeeds = plan.shots.flatMap((s) => s.needs.map((n) => ({ ...n, shotId: s.id })));
const resolved = resolvePlan(allNeeds);

const reuse = resolved.filter((r) => r.resolution === "reutilizar");
const nuevo = resolved.filter((r) => r.resolution === "generar_nuevo");
console.log(`Total de necesidades: ${resolved.length}`);
console.log(`Reutilizar: ${reuse.length}`);
console.log(`Generar nuevo: ${nuevo.length}\n`);

const seen = new Map();
for (const n of nuevo) {
  const key =
    n.type === "character"
      ? `char:${n.characterId}:${n.pose}:${n.expression}:${n.lighting}`
      : `bg:${n.setting}:${n.mood}:${n.lighting}`;
  if (!seen.has(key)) seen.set(key, { ...n, shots: [] });
  seen.get(key).shots.push(n.shotId);
}

console.log("=== Generaciones únicas necesarias (deduplicadas) ===");
for (const [key, v] of seen) {
  console.log(`- ${key}  (usado en: ${v.shots.join(", ")})`);
}
console.log(`\nTotal de generaciones únicas: ${seen.size} (de ${resolved.length} necesidades totales)`);
