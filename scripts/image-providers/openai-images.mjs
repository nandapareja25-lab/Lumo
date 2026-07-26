// Implementación real del contrato ImageProvider (ver types.mjs) para OpenAI.
// A diferencia de los scripts de arte existentes (generate-character-art.mjs,
// generate-story-art.mjs), que solo usan /v1/images/generations (texto puro, sin anclaje
// visual), acá usamos /v1/images/edits — el único endpoint de gpt-image-1 que acepta imágenes
// de referencia (hasta 16) para preservar la identidad de un personaje en una escena nueva.
// Ese endpoint es multipart/form-data, no JSON, por eso la mecánica de fetch es distinta al
// resto de los scripts de imagen del proyecto.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ProviderError } from "./types.mjs";

const MODEL = "gpt-image-1";

// Códigos de error de OpenAI que vale la pena reintentar (con otra variante de prompt o con
// otro proveedor) — todo lo que no esté acá se trata como fatal (no reintentar a ciegas un
// error de configuración). Ver nota en types.mjs: esta lista es específica de OpenAI a
// propósito, el motor nunca la ve.
const RECOVERABLE_CODES = new Set(["moderation_blocked", "rate_limit_exceeded", "server_error"]);

function classifyOpenAiError(status, detail) {
  let code = "unknown";
  try {
    code = JSON.parse(detail)?.error?.code ?? "unknown";
  } catch {
    // detail no era JSON — status 5xx sin cuerpo estructurado, por ejemplo
  }
  if (status >= 500) return { recoverable: true, reason: "server_error" };
  if (status === 429) return { recoverable: true, reason: "rate_limit_exceeded" };
  if (RECOVERABLE_CODES.has(code)) return { recoverable: true, reason: code };
  return { recoverable: false, reason: code };
}

export function createOpenAiImagesProvider(apiKey) {
  if (!apiKey) throw new Error("Falta OPENAI_API_KEY para el proveedor de imagen openai-images");

  return {
    id: "openai-images",
    async generate({ prompt, referenceImagePaths = [], transparentBackground = false, size = "1024x1024" }) {
      const form = new FormData();
      form.append("model", MODEL);
      form.append("prompt", prompt);
      form.append("size", size);
      form.append("quality", "high");
      form.append("n", "1");
      if (transparentBackground) form.append("background", "transparent");

      if (referenceImagePaths.length > 0) {
        // /v1/images/edits: sin referencias, es generación pura (mismo comportamiento que
        // /generations); con referencias, ancla el personaje a esas imágenes.
        for (const p of referenceImagePaths) {
          const buf = await readFile(p);
          form.append("image[]", new Blob([buf], { type: `image/${path.extname(p).slice(1) || "png"}` }), path.basename(p));
        }
      }

      const endpoint = referenceImagePaths.length > 0
        ? "https://api.openai.com/v1/images/edits"
        : "https://api.openai.com/v1/images/generations";

      const res = referenceImagePaths.length > 0
        ? await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form })
        : await fetch(endpoint, {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: MODEL,
              prompt,
              size,
              quality: "high",
              n: 1,
              ...(transparentBackground ? { background: "transparent" } : {}),
            }),
          });

      if (!res.ok) {
        const detail = await res.text();
        const { recoverable, reason } = classifyOpenAiError(res.status, detail);
        throw new ProviderError(
          `OpenAI Images API (${referenceImagePaths.length > 0 ? "edits" : "generations"}) respondió ${res.status}: ${detail}`,
          { recoverable, reason, providerId: "openai-images" },
        );
      }

      const data = await res.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) {
        throw new ProviderError("Respuesta de OpenAI sin b64_json", {
          recoverable: true,
          reason: "empty_response",
          providerId: "openai-images",
        });
      }

      return { imageBuffer: Buffer.from(b64, "base64") };
    },
  };
}
