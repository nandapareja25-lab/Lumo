// TODO: implementar cuando Lumo necesite cambiar de proveedor. Amazon Polly soporta "speech marks"
// (tipo "word") para subtítulos progresivos.

/** @returns {import("./types.mjs").AudioProvider} */
export function createPollyProvider(_credentials) {
  return {
    id: "polly",
    async synthesize(_text) {
      throw new Error("polly: proveedor no implementado todavía. Usar AUDIO_PROVIDER=elevenlabs.");
    },
  };
}
