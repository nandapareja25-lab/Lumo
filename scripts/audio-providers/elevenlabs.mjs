// Implementación real del contrato AudioProvider (ver types.mjs) para ElevenLabs.
// Voz oficial de Lumo, creada con Voice Design — ver ESTADO.md para el Voice ID y la ficha de voz.
const VOICE_ID = "UV1PvCsFzKWpDz8VJiDc";
const MODEL_ID = "eleven_multilingual_v2";

/** Agrupa caracteres con marca de tiempo en palabras, y palabras en "cues" cortas tipo subtítulo. */
function buildCues(alignment) {
  const { characters: chars, character_start_times_seconds: starts, character_end_times_seconds: ends } = alignment;
  const words = [];
  let curStart = null;
  let curChars = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (curChars.length) {
        words.push({ text: curChars.join(""), start: curStart, end: ends[i - 1] });
        curChars = [];
        curStart = null;
      }
      continue;
    }
    if (curStart === null) curStart = starts[i];
    curChars.push(c);
  }
  if (curChars.length) {
    words.push({ text: curChars.join(""), start: curStart, end: ends[chars.length - 1] });
  }

  // Frases cortas tipo subtítulo de película (no karaoke palabra por palabra): cortamos en
  // comas/puntuación cuando ya hay un mínimo razonable de texto, o al llegar a un máximo.
  const cues = [];
  let buf = [];
  let bufLen = 0;
  for (const w of words) {
    buf.push(w);
    bufLen += w.text.length + 1;
    const endsClause = /[.!?…,;—]["»)]?$/.test(w.text);
    if (bufLen >= 22 && (endsClause || bufLen >= 45)) {
      cues.push({ text: buf.map((x) => x.text).join(" "), start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
      bufLen = 0;
    }
  }
  if (buf.length) {
    cues.push({ text: buf.map((x) => x.text).join(" "), start: buf[0].start, end: buf[buf.length - 1].end });
  }
  return cues;
}

/** @returns {import("./types.mjs").AudioProvider} */
export function createElevenLabsProvider(apiKey) {
  if (!apiKey) throw new Error("Falta ELEVENLABS_API_KEY");

  return {
    id: "elevenlabs",
    async synthesize(text) {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`, {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${res.status} ${err.slice(0, 300)}`);
      }
      const data = await res.json();
      return {
        audioBuffer: Buffer.from(data.audio_base64, "base64"),
        cues: buildCues(data.alignment),
      };
    },
  };
}
