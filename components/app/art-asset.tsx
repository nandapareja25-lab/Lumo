"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ArtAssetProps = {
  slug: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
};

/**
 * Muestra la ilustración real generada por IA (guardada vía /admin/landing o el script de
 * generación) si existe para este `slug`; si no, cae en la escena de respaldo. Mismo patrón que
 * LumoPortrait, pero genérico para cualquier ilustración (historias, categorías, escenas).
 */
export function ArtAsset({ slug, alt, fallback, className }: ArtAssetProps) {
  const [url, setUrl] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetch(`/api/lumo-pose?pose=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setUrl(data.url);
      })
      .catch(() => active && setUrl(null));
    return () => {
      active = false;
    };
  }, [slug]);

  if (url) {
    return (
      <div className={`overflow-hidden ${className ?? ""}`}>
        <Image src={url} alt={alt} fill className="object-cover" sizes="400px" />
      </div>
    );
  }

  return <div className={`overflow-hidden ${className ?? ""}`}>{fallback}</div>;
}
