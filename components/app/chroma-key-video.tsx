"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
};

// El video fuente tiene fondo magenta/violeta (rango de matiz ~285-355°) con un viñeteado
// radial — no un color plano, por eso el chroma key se hace por matiz+saturación en vez de
// una sola distancia RGB fija (así cubre el degradé sin dejar un halo rosado alrededor de
// Lumo). El verde/dorado del personaje está lejos de ese rango de matiz, así que no se toca.
const KEY_HUE_MIN = 285;
const KEY_HUE_MAX = 355;
const KEY_SAT_MIN = 0.05;

function rgbToHueSat(r: number, g: number, b: number): [number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s];
}

/**
 * Reproduce un video con fondo de croma (magenta) y lo compone en un <canvas> quitando ese
 * fondo en tiempo real, pixel a pixel, cuadro a cuadro — no depende de transparencia nativa de
 * video (WebM+VP9 con alfa no funcionó de forma confiable en este entorno, verificado con una
 * prueba aislada: el canal alfa se perdía al codificar). Respeta prefers-reduced-motion — no
 * se monta si el sistema lo pide.
 */
export function ChromaKeyVideo({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const W = 240;
    const H = Math.round((W * 1280) / 720);
    canvas.width = W;
    canvas.height = H;

    let raf = 0;
    let cancelled = false;

    function draw() {
      if (!cancelled) {
        if (!video!.paused && !video!.ended && video!.readyState >= 2) {
          ctx!.drawImage(video!, 0, 0, W, H);
          const frame = ctx!.getImageData(0, 0, W, H);
          const data = frame.data;
          for (let i = 0; i < data.length; i += 4) {
            const [h, s] = rgbToHueSat(data[i], data[i + 1], data[i + 2]);
            if (h >= KEY_HUE_MIN && h <= KEY_HUE_MAX && s >= KEY_SAT_MIN) {
              data[i + 3] = 0;
            }
          }
          ctx!.putImageData(frame, 0, 0);
        }
        raf = requestAnimationFrame(draw);
      }
    }

    video.play().catch(() => {});
    raf = requestAnimationFrame(draw);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  return (
    <div className={className}>
      <video ref={videoRef} src={src} autoPlay loop muted playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
