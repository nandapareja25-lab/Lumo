// Capa de resiliencia sobre cualquier ImageProvider (ver types.mjs). Ningún script debería
// llamar a `provider.generate()` directamente en el motor de producción — todos pasan por acá.
//
// Filosofía (decisión del usuario, 2026-07-26): no optimizamos para las reglas de moderación
// de un proveedor específico, porque pueden cambiar en cualquier momento. En cambio, el motor
// asume que CUALQUIER paso puede fallar de forma recuperable, y sabe qué hacer cuando pasa:
//   1. Reintentar con la siguiente variante de prompt ya preparada (no reformula en caliente
//      con otra llamada a IA — las variantes se preparan de antemano, en el paso de
//      planificación de escenas, junto con el prompt principal).
//   2. Si se agotan las variantes en el proveedor principal, probar el proveedor de respaldo
//      (si hay uno configurado) con la misma lista de variantes.
//   3. Si todo falla, registrar el motivo completo en data/generation-failures.json y lanzar
//      un error claro para que un humano lo revise — nunca fallar en silencio.
// Un error NO recuperable (`ProviderError.recoverable === false`) corta la cadena de inmediato,
// para no gastar reintentos en algo que nunca va a funcionar (ej. API key inválida).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ProviderError } from "./types.mjs";

const FAILURES_LOG_PATH = path.join(process.cwd(), "data", "generation-failures.json");

function appendFailureLog(entry) {
  const dir = path.dirname(FAILURES_LOG_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const log = existsSync(FAILURES_LOG_PATH) ? JSON.parse(readFileSync(FAILURES_LOG_PATH, "utf8")) : [];
  log.push({ ...entry, at: new Date().toISOString() });
  writeFileSync(FAILURES_LOG_PATH, JSON.stringify(log, null, 2));
}

/**
 * @param {Object} params
 * @param {import("./types.mjs").ImageProvider} params.provider - Proveedor principal.
 * @param {import("./types.mjs").ImageProvider} [params.fallbackProvider] - Proveedor de
 *   respaldo, opcional — si no hay ninguno configurado, se documenta en el log y se corta ahí.
 * @param {string[]} params.promptVariants - Al menos 1. La [0] es la preferida; el resto son
 *   reformulaciones ya preparadas para reintentar sin depender de una llamada a IA extra.
 * @param {string[]} [params.referenceImagePaths]
 * @param {boolean} [params.transparentBackground]
 * @param {"1024x1024"|"1024x1536"|"1536x1024"} [params.size]
 * @param {{ contentId?: string, shotId?: string, assetType?: string }} [params.context] - Solo
 *   para trazabilidad en el log — no afecta la generación.
 */
export async function generateImageResilient({
  provider,
  fallbackProvider,
  promptVariants,
  referenceImagePaths = [],
  transparentBackground = false,
  size = "1024x1024",
  context = {},
}) {
  if (!promptVariants?.length) throw new Error("generateImageResilient necesita al menos 1 promptVariant");

  const attempts = [];
  const providers = fallbackProvider ? [provider, fallbackProvider] : [provider];

  for (const activeProvider of providers) {
    for (let i = 0; i < promptVariants.length; i++) {
      const prompt = promptVariants[i];
      try {
        const result = await activeProvider.generate({ prompt, referenceImagePaths, transparentBackground, size });
        if (attempts.length > 0) {
          // Hubo reintentos antes de este éxito — vale la pena dejarlo registrado igual,
          // ayuda a notar patrones (ej. "la variante 2 siempre funciona, promover a variante 1").
          appendFailureLog({ ...context, outcome: "recovered", providerId: activeProvider.id, variantIndex: i, previousAttempts: attempts });
        }
        return { ...result, providerId: activeProvider.id, variantIndex: i, attempts };
      } catch (err) {
        const recoverable = err instanceof ProviderError ? err.recoverable : false;
        const reason = err instanceof ProviderError ? err.reason : "non_provider_error";
        attempts.push({ providerId: activeProvider.id, variantIndex: i, recoverable, reason, message: err.message });

        if (!recoverable) {
          appendFailureLog({ ...context, outcome: "fatal", attempts });
          throw err;
        }
        // recuperable: sigue el loop — próxima variante, o próximo proveedor si se acabaron.
      }
    }
  }

  appendFailureLog({
    ...context,
    outcome: "exhausted",
    attempts,
    note: fallbackProvider
      ? "Se agotaron todas las variantes en el proveedor principal y en el de respaldo."
      : "Se agotaron todas las variantes en el proveedor principal. No hay proveedor de respaldo configurado — considerá agregar uno en image-providers/index.mjs si esto se repite.",
  });
  throw new Error(
    `generateImageResilient: ${promptVariants.length} variante(s) agotadas en ${providers.map((p) => p.id).join(" → ")}. Ver data/generation-failures.json para el detalle.`,
  );
}
