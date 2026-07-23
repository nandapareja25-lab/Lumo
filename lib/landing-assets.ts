import "server-only";
import { promises as fs } from "fs";
import path from "path";
import {
  LandingAsset,
  LandingAssetsMap,
  LandingSectionSlug,
} from "./landing-sections";

/**
 * Almacén interino de las escenas de la landing (JSON local + /public/lumo-art).
 * Reemplazar por Supabase (tabla `landing_assets` + Storage) en la Sesión 6 — misma forma de datos,
 * solo cambia dónde vive `readAssets`/`writeAssets`. La landing y el panel admin no deberían
 * necesitar cambios cuando se migre.
 */

export { LANDING_SECTIONS } from "./landing-sections";
export type { LandingAsset, LandingAssetsMap, LandingSectionSlug } from "./landing-sections";

const DATA_FILE = path.join(process.cwd(), "data", "landing-assets.json");

export async function readAssets(): Promise<LandingAssetsMap> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as LandingAssetsMap;
}

export async function getAsset(
  slug: LandingSectionSlug,
): Promise<LandingAsset | null> {
  const assets = await readAssets();
  return assets[slug] ?? null;
}

export async function saveAsset(
  slug: LandingSectionSlug,
  asset: LandingAsset,
): Promise<void> {
  const assets = await readAssets();
  assets[slug] = asset;
  await fs.writeFile(DATA_FILE, JSON.stringify(assets, null, 2));
}

export async function clearAsset(slug: LandingSectionSlug): Promise<void> {
  const assets = await readAssets();
  assets[slug] = null;
  await fs.writeFile(DATA_FILE, JSON.stringify(assets, null, 2));
}

/** Guarda el PNG aprobado en /public/lumo-art (stand-in de Supabase Storage) y devuelve su ruta pública. */
export async function saveApprovedImage(
  slug: LandingSectionSlug,
  base64Png: string,
): Promise<string> {
  const dir = path.join(process.cwd(), "public", "lumo-art");
  await fs.mkdir(dir, { recursive: true });
  const filename = `${slug}-${Date.now()}.png`;
  await fs.writeFile(path.join(dir, filename), Buffer.from(base64Png, "base64"));
  return `/lumo-art/${filename}`;
}
