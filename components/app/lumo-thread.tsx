"use client";

/**
 * El hilo de luz de Lumo — ya no exclusivo de la Landing. Gramática visual compartida por toda
 * la app: acompaña el recorrido de cada pantalla, nunca decorativo, nunca en cada transición
 * (BRAND-DNA.md: la luz respira, no parpadea; una sola fuente por escena).
 */
export function LumoThread({ height = 74 }: { height?: number }) {
  return (
    <div className="relative mx-auto flex flex-col items-center" style={{ height }}>
      <style jsx global>{`
        @keyframes lumoThreadBreathe {
          0%,
          100% {
            opacity: 0.55;
            transform: translateX(-50%) scale(0.9);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.15);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .lumo-thread-dot {
            animation: lumoThreadBreathe 4.5s ease-in-out infinite;
          }
        }
      `}</style>
      <span
        className="absolute left-1/2 w-px -translate-x-1/2"
        style={{
          height: "100%",
          background:
            "linear-gradient(180deg, transparent, rgba(243,200,120,0.45) 45%, rgba(243,200,120,0.45) 55%, transparent)",
        }}
      />
      <span
        className="lumo-thread-dot absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #F7C948 0%, #F5B800 65%, rgba(232,163,61,0) 100%)",
          boxShadow: "0 0 16px 5px rgba(232,163,61,0.45)",
        }}
      />
    </div>
  );
}
