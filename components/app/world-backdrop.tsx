import Image from "next/image";

/**
 * El mundo compartido de Lumo — una escena ilustrada fija detrás del contenido que se
 * desplaza, no un color plano. Las 5 escenas (Home/Mi Camino/Diario/Orar/Explorar) comparten
 * la misma luna, la misma luz, la misma niebla — son rincones del mismo universo, no fondos
 * independientes (ver BRAND-DNA.md y la sesión de dirección de arte del 2026-07-20).
 */
export function WorldBackdrop({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Image src={src} alt={alt} fill priority className="object-cover" sizes="100vw" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,11,8,0.32) 0%, rgba(16,11,8,0.5) 55%, rgba(16,11,8,0.88) 100%)",
        }}
      />
    </div>
  );
}
