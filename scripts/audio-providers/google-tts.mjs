// TODO: implementar cuando Lumo necesite cambiar de proveedor. Google Cloud TTS sí soporta
// timepoints por SSML <mark>, se puede lograr paridad de subtítulos progresivos con más trabajo.

/** @returns {import("./types.mjs").AudioProvider} */
export function createGoogleTtsProvider(_credentials) {
  return {
    id: "google-tts",
    async synthesize(_text) {
      throw new Error("google-tts: proveedor no implementado todavía. Usar AUDIO_PROVIDER=elevenlabs.");
    },
  };
}
