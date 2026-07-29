"use client";

import { useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

type VoiceRecorderProps = {
  value: string | null; // data URL del audio ya grabado
  onChange: (dataUrl: string | null) => void;
};

/**
 * Graba la respuesta del niño con el micrófono (MediaRecorder) y la guarda como data URL.
 * Interino: hoy vive en localStorage: en la Sesión 6 se sube a Supabase Storage y se guarda
 * la URL pública en vez del base64 (mismo campo `audioUrl`, solo cambia el origen del string).
 */
export function VoiceRecorder({ value, onChange }: VoiceRecorderProps) {
  const [status, setStatus] = useState<"idle" | "recording" | "denied">("idle");
  const [playing, setPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => onChange(reader.result as string);
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setStatus("recording");
    } catch {
      setStatus("denied");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setStatus("idle");
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  if (status === "denied") {
    return (
      <p className="text-xs text-red-400">
        No pudimos acceder al micrófono. Revisa los permisos de tu navegador,
        o escribe la respuesta en texto.
      </p>
    );
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[rgba(246,236,217,0.16)] bg-[rgba(246,236,217,0.04)] p-3">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#2D2A26]"
          style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)" }}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <span className="flex-1 text-sm text-[#C9BBA3]">Respuesta grabada</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Borrar grabación"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#C9BBA3] hover:bg-[rgba(246,236,217,0.08)]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <audio
          ref={audioRef}
          src={value}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={status === "recording" ? stopRecording : startRecording}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-colors ${
        status === "recording"
          ? "border-red-400/50 bg-red-400/10 text-red-400"
          : "border-[rgba(246,236,217,0.18)] bg-[rgba(246,236,217,0.04)] text-[#F6ECD9] hover:bg-[rgba(246,236,217,0.08)]"
      }`}
    >
      {status === "recording" ? (
        <>
          <Square className="h-4 w-4" /> Detener grabación
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" /> Grabar respuesta con la voz
        </>
      )}
    </button>
  );
}
