// TODO: implementar cuando Lumo necesite cambiar de proveedor. Azure Speech soporta "word boundary"
// events para subtítulos progresivos.

/** @returns {import("./types.mjs").AudioProvider} */
export function createAzureTtsProvider(_apiKey) {
  return {
    id: "azure-tts",
    async synthesize(_text) {
      throw new Error("azure-tts: proveedor no implementado todavía. Usar AUDIO_PROVIDER=elevenlabs.");
    },
  };
}
