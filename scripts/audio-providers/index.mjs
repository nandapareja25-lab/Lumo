import { createElevenLabsProvider } from "./elevenlabs.mjs";
import { createOpenAiTtsProvider } from "./openai-tts.mjs";
import { createGoogleTtsProvider } from "./google-tts.mjs";
import { createAzureTtsProvider } from "./azure-tts.mjs";
import { createPollyProvider } from "./polly.mjs";

/**
 * Único punto donde se elige el proveedor de voz. `scripts/generate-content-audio.mjs` (y
 * cualquier script futuro de generación) llama a `getAudioProvider(env)` y usa el resultado sin
 * saber qué servicio hay detrás. Cambiar de proveedor = cambiar `AUDIO_PROVIDER` en .env.local.
 */
export function getAudioProvider(env) {
  const name = env.AUDIO_PROVIDER || "elevenlabs";
  switch (name) {
    case "elevenlabs":
      return createElevenLabsProvider(env.ELEVENLABS_API_KEY);
    case "openai-tts":
      return createOpenAiTtsProvider(env.OPENAI_API_KEY);
    case "google-tts":
      return createGoogleTtsProvider(env.GOOGLE_TTS_CREDENTIALS);
    case "azure-tts":
      return createAzureTtsProvider(env.AZURE_SPEECH_KEY);
    case "polly":
      return createPollyProvider(env.AWS_ACCESS_KEY_ID);
    default:
      throw new Error(`AUDIO_PROVIDER desconocido: "${name}". Opciones: elevenlabs, openai-tts, google-tts, azure-tts, polly.`);
  }
}
