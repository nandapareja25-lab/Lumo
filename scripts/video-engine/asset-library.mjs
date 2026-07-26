// Biblioteca viva de assets visuales (personajes y fondos) — "reuse first, generate second"
// (decisión del usuario, 2026-07-26). Ningún paso del motor decide directamente si algo se
// reutiliza o se genera: todo pasa por acá, para que la regla de negocio ("consultar antes de
// gastar") viva en un solo lugar.
//
// No hay embeddings ni búsqueda por similitud — a esta escala (cientos de historias, no
// millones) un catálogo JSON con coincidencia por tags controlados alcanza y es mucho más
// simple de mantener. Los tags los decide quien arma el plan de escenas (hoy: revisión manual;
// más adelante, una llamada a Claude) usando el mismo vocabulario fijo con el que se guardan
// los assets — así la coincidencia es determinística.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const CHAR_LIBRARY_PATH = path.join(process.cwd(), "data", "character-asset-library.json");
const BG_LIBRARY_PATH = path.join(process.cwd(), "data", "background-library.json");

function readJson(filePath) {
  return existsSync(filePath) ? JSON.parse(readFileSync(filePath, "utf8")) : { assets: [] };
}
function writeJson(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Busca en la biblioteca de personajes un asset que calce con lo que pide un plano.
 * Coincidencia exacta por (characterId, pose, expression, lighting) — si alguno de esos campos
 * viene null en la búsqueda, no se exige para ese campo (ej. buscar sin importar iluminación).
 */
export function findCharacterAsset({ characterId, pose = null, expression = null, lighting = null }) {
  const { assets } = readJson(CHAR_LIBRARY_PATH);
  return assets.find(
    (a) =>
      a.characterId === characterId &&
      (pose === null || a.pose === pose) &&
      (expression === null || a.expression === expression) &&
      (lighting === null || a.lighting === lighting),
  ) ?? null;
}

export function findBackgroundAsset({ setting, mood = null, lighting = null }) {
  const { assets } = readJson(BG_LIBRARY_PATH);
  return assets.find(
    (a) => a.setting === setting && (mood === null || a.mood === mood) && (lighting === null || a.lighting === lighting),
  ) ?? null;
}

/** Se llama SOLO cuando el usuario aprobó una imagen nueva — nunca automáticamente antes de eso. */
export function addCharacterAsset(asset) {
  const lib = readJson(CHAR_LIBRARY_PATH);
  const entry = { ...asset, approvedAt: new Date().toISOString(), usedInContentIds: asset.usedInContentIds ?? [] };
  lib.assets.push(entry);
  writeJson(CHAR_LIBRARY_PATH, lib);
  return entry;
}

export function addBackgroundAsset(asset) {
  const lib = readJson(BG_LIBRARY_PATH);
  const entry = { ...asset, approvedAt: new Date().toISOString(), usedInContentIds: asset.usedInContentIds ?? [] };
  lib.assets.push(entry);
  writeJson(BG_LIBRARY_PATH, lib);
  return entry;
}

/** Marca un asset ya existente como reutilizado en un cuento nuevo — para poder medir % de reutilización real (paso 5 del plan). */
export function markCharacterAssetReused(assetId, contentId) {
  const lib = readJson(CHAR_LIBRARY_PATH);
  const asset = lib.assets.find((a) => a.id === assetId);
  if (asset && !asset.usedInContentIds.includes(contentId)) {
    asset.usedInContentIds.push(contentId);
    writeJson(CHAR_LIBRARY_PATH, lib);
  }
}

export function markBackgroundAssetReused(assetId, contentId) {
  const lib = readJson(BG_LIBRARY_PATH);
  const asset = lib.assets.find((a) => a.id === assetId);
  if (asset && !asset.usedInContentIds.includes(contentId)) {
    asset.usedInContentIds.push(contentId);
    writeJson(BG_LIBRARY_PATH, lib);
  }
}

/**
 * Resuelve un plan de escenas contra la biblioteca actual — para cada necesidad (personaje en
 * una pose, o un fondo), decide "reutilizar" (con el asset encontrado) o "generar nuevo". No
 * genera nada — solo informa, para que el humano apruebe antes de gastar (regla del
 * 2026-07-26: "no generar nada automáticamente si antes no verificamos si realmente hace falta").
 */
export function resolvePlan(needs) {
  return needs.map((need) => {
    if (need.type === "character") {
      const match = findCharacterAsset(need);
      return { ...need, resolution: match ? "reutilizar" : "generar_nuevo", matchedAsset: match };
    }
    const match = findBackgroundAsset(need);
    return { ...need, resolution: match ? "reutilizar" : "generar_nuevo", matchedAsset: match };
  });
}
