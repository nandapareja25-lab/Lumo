import Image from "next/image";

/**
 * El mundo compartido de Lumo — una escena ilustrada fija detrás del contenido que se
 * desplaza, no un color plano. Las 5 escenas (Home/Mi Camino/Diario/Orar/Explorar) comparten
 * la misma luna, la misma luz, la misma niebla — son rincones del mismo universo, no fondos
 * independientes (ver BRAND-DNA.md y la sesión de dirección de arte del 2026-07-20).
 *
 * La escena en sí (luna, casita, luciérnagas) no se regenera — solo se corrige el grado de
 * color (sepia + hue-rotate + saturate, la técnica estándar de color-grading por CSS) para que
 * el azul-marrón del cielo original se lea como verde bosque, sin aplanar el brillo cálido de
 * las luciérnagas y las ventanas (reporte de usuario, 2026-07-24).
 */
export function WorldBackdrop({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
        style={{ filter: "sepia(0.4) saturate(1.8) hue-rotate(45deg) brightness(0.9)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(10,20,15,0.32) 0%, rgba(10,20,15,0.5) 55%, rgba(8,16,12,0.88) 100%)",
        }}
      />
    </div>
  );
}
