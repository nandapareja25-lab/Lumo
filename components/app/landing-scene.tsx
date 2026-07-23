import Image from "next/image";
import { getAsset, LandingSectionSlug } from "@/lib/landing-assets";

type LandingSceneProps = {
  section: LandingSectionSlug;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
};

/**
 * Muestra la ilustración aprobada por el admin para esta sección (/admin/landing) si existe;
 * si no, cae en la escena animada de respaldo (components/scenes/*). La landing NUNCA genera
 * imágenes — solo consume lo que ya fue aprobado y guardado.
 */
export async function LandingScene({ section, alt, fallback, className }: LandingSceneProps) {
  const asset = await getAsset(section);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {asset ? (
        <Image
          src={asset.url}
          alt={alt}
          width={800}
          height={600}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full">{fallback}</div>
      )}
    </div>
  );
}
