import { createOpenAiImagesProvider } from "./openai-images.mjs";

/**
 * Único punto donde se elige el proveedor de imagen. El motor de producción de video (y
 * cualquier script futuro) llama a `getImageProvider(env)` y usa el resultado sin saber qué
 * servicio hay detrás. Cambiar de proveedor = cambiar IMAGE_PROVIDER en .env.local + agregar el
 * archivo nuevo acá (ej. createNanoBananaProvider) — el resto del motor no se toca.
 */
export function getImageProvider(env) {
  const name = env.IMAGE_PROVIDER || "openai-images";
  switch (name) {
    case "openai-images":
      return createOpenAiImagesProvider(env.OPENAI_API_KEY);
    default:
      throw new Error(`IMAGE_PROVIDER desconocido: "${name}". Opciones: openai-images.`);
  }
}
