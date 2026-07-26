/**
 * Contrato que debe cumplir cualquier proveedor de imagen (OpenAI gpt-image-1, Nano Banana Pro,
 * Flux, o el que venga después). Ni el motor de producción de video ni ningún script consumen
 * nada de un proveedor específico — solo este contrato. Cambiar de proveedor es implementar
 * `generate()` en un archivo nuevo y registrarlo en `index.mjs`, sin tocar el resto del motor.
 *
 * Mismo patrón que scripts/audio-providers/ — no reinventar la forma.
 *
 * @typedef {Object} GenerateImageInput
 * @property {string} prompt - Descripción de la escena/pose nueva a generar.
 * @property {string[]} [referenceImagePaths] - Rutas locales a imágenes de referencia del/de los
 *   personaje(s) que deben mantener su identidad — vacío o ausente para una generación sin anclaje
 *   (ej. un fondo, que no tiene personaje que preservar).
 * @property {boolean} [transparentBackground] - true para recortes de personaje sobre fondo
 *   transparente (biblioteca de poses); false/ausente para fondos o escenas compuestas completas.
 * @property {"1024x1024"|"1024x1536"|"1536x1024"} [size]
 *
 * @typedef {Object} GenerateImageResult
 * @property {Buffer} imageBuffer - PNG en bytes, listo para escribir a disco.
 *
 * @typedef {Object} ImageProvider
 * @property {string} id - slug del proveedor (ej. "openai-images"), guardado en el catálogo para trazabilidad.
 * @property {(input: GenerateImageInput) => Promise<GenerateImageResult>} generate
 */

/**
 * Error que debe lanzar cualquier ImageProvider cuando `generate()` falla — nunca un Error
 * genérico. `recoverable` es la única señal que le importa a la capa de resiliencia
 * (generate-with-resilience.mjs): si un reintento con otra variante de prompt (o un proveedor
 * de respaldo) tiene sentido, o si es un error de configuración/fatal que no vale la pena
 * reintentar (API key inválida, parámetro mal formado, etc.).
 *
 * Cada proveedor decide QUÉ cuenta como recuperable según sus propios códigos de error — el
 * motor nunca conoce las particularidades de un proveedor específico (ver decisión del
 * 2026-07-26: "no optimizar para las reglas actuales de un proveedor").
 */
export class ProviderError extends Error {
  /**
   * @param {string} message
   * @param {{ recoverable: boolean, reason: string, providerId: string }} details
   */
  constructor(message, { recoverable, reason, providerId }) {
    super(message);
    this.name = "ProviderError";
    this.recoverable = recoverable;
    this.reason = reason;
    this.providerId = providerId;
  }
}
