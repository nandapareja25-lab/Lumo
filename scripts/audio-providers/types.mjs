/**
 * Contrato que debe cumplir cualquier proveedor de voz (ElevenLabs, OpenAI TTS, Google Cloud TTS,
 * Azure Speech, Amazon Polly, o el que venga después). Ni el script de generación ni la app
 * consumen nada de un proveedor específico — solo este contrato. Cambiar de proveedor es
 * implementar `synthesize()` en un archivo nuevo y registrarlo en `index.mjs`, sin tocar el resto.
 *
 * @typedef {Object} SynthesizeResult
 * @property {Buffer} audioBuffer - Audio en bytes (mp3), listo para escribir a disco.
 * @property {Cue[]} cues - Frases cortas con marca de tiempo para subtítulos progresivos.
 *   Un proveedor sin soporte de timestamps puede devolver un array vacío — el reproductor ya
 *   está preparado para ese caso (simplemente no muestra subtítulos sincronizados).
 *
 * @typedef {Object} Cue
 * @property {string} text
 * @property {number} start - segundos
 * @property {number} end - segundos
 *
 * @typedef {Object} AudioProvider
 * @property {string} id - slug del proveedor (ej. "elevenlabs"), guardado en el registro para trazabilidad.
 * @property {(text: string) => Promise<SynthesizeResult>} synthesize
 */

export {};
