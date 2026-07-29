"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Lumo } from "./lumo";

export type LumoPose =
  | "lumo-frontal"
  | "lumo-feliz"
  | "lumo-volando"
  | "lumo-saludo"
  | "lumo-leyendo"
  | "lumo-senalando"
  | "lumo-pensando"
  | "lumo-durmiendo"
  | "lumo-abrazo";

type LumoPortraitProps = {
  pose: LumoPose;
  size: number;
  className?: string;
};

/**
 * Muestra la pose real de Lumo (recortada de la lámina de 9 poses del usuario en
 * Desktop/IMAGENES, 2026-07-28 — reemplaza las poses generadas con IA anteriores) si ya existe;
 * si no, cae en el SVG simplificado como respaldo. Los recortes son PNG con fondo transparente
 * del personaje completo, no una foto-retrato — por eso usa `object-contain` sin máscara
 * circular (una máscara redonda recortaría la estrella en vez de mostrarla completa).
 */
export function LumoPortrait({ pose, size, className }: LumoPortraitProps) {
  const [url, setUrl] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetch(`/api/lumo-pose?pose=${pose}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setUrl(data.url);
      })
      .catch(() => active && setUrl(null));
    return () => {
      active = false;
    };
  }, [pose]);

  if (url) {
    return (
      <Image
        src={url}
        alt="Lumo"
        width={size}
        height={size}
        className={`object-contain ${className ?? ""}`}
      />
    );
  }

  return <Lumo size={size} className={className} />;
}
