"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Lumo } from "./lumo";

type LumoPortraitProps = {
  pose: "lumo-frontal" | "lumo-feliz" | "lumo-volando";
  size: number;
  className?: string;
};

/**
 * Muestra la pose real de Lumo (generada y aprobada en /admin/landing) si ya existe; si no,
 * cae en el SVG simplificado como respaldo. Reemplaza el dibujo por las poses reales en cuanto
 * el usuario las genere con su clave de OpenAI — sin tocar ninguna pantalla que use este componente.
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
        className={`rounded-full object-cover ${className ?? ""}`}
      />
    );
  }

  return <Lumo size={size} className={className} />;
}
