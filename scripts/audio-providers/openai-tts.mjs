// TODO: implementar cuando Lumo necesite cambiar de proveedor. OpenAI TTS no devuelve marcas de
// tiempo por palabra hoy — este provider debería devolver `cues: []` (el reproductor ya soporta
// contenido sin subtítulos sincronizados, ver app/reproducir/[id]/page.tsx).

/** @returns {import("./types.mjs").AudioProvider} */
export function createOpenAiTtsProvider(_apiKey) {
  return {
    id: "openai-tts",
    async synthesize(_text) {
      throw new Error("openai-tts: proveedor no implementado todavía. Usar AUDIO_PROVIDER=elevenlabs.");
    },
  };
}
