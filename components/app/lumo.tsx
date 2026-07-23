type LumoProps = {
  size?: number;
  className?: string;
};

/**
 * El personaje de marca: Lumo, una luciérnaga mágica — diseño oficial definido por el usuario
 * (ficha de personaje: cuerpo dorado, ojos grandes, antenas con luz, alas, abdomen que brilla).
 * Personalidad: curioso, amable, valiente, empático, alegre, esperanzador.
 */
export function Lumo({ size = 150, className }: LumoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lumo-halo" cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#F0B84E" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#F0B84E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lumo-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEFB8" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#FFCC4D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lumo-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6C766" />
          <stop offset="100%" stopColor="#E8A93D" />
        </linearGradient>
      </defs>

      <circle cx="75" cy="80" r="72" fill="url(#lumo-halo)" />

      {/* alas */}
      <ellipse
        cx="47"
        cy="70"
        rx="16"
        ry="26"
        fill="#F7F1DC"
        opacity="0.55"
        transform="rotate(-18 47 70)"
      />
      <ellipse
        cx="103"
        cy="70"
        rx="16"
        ry="26"
        fill="#F7F1DC"
        opacity="0.55"
        transform="rotate(18 103 70)"
      />

      {/* antenas */}
      <path d="M65 44 Q58 26 50 20" stroke="#C98A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M85 44 Q92 26 100 20" stroke="#C98A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="19" r="4.5" fill="#FFE066">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="19" r="4.5" fill="#FFE066">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" begin="0.3s" repeatCount="indefinite" />
      </circle>

      {/* cuerpo */}
      <ellipse cx="75" cy="82" rx="33" ry="36" fill="url(#lumo-body)" stroke="#D89A38" strokeWidth="1.5" />

      {/* mejillas */}
      <ellipse cx="52" cy="92" rx="6" ry="4" fill="#F2A25D" opacity="0.55" />
      <ellipse cx="98" cy="92" rx="6" ry="4" fill="#F2A25D" opacity="0.55" />

      {/* ojos (con parpadeo) */}
      <ellipse cx="62" cy="80" rx="9.5" ry="10" fill="#3B2A1E">
        <animate
          attributeName="ry"
          values="10;10;10;1;10;10"
          keyTimes="0;0.85;0.9;0.93;0.96;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse cx="88" cy="80" rx="9.5" ry="10" fill="#3B2A1E">
        <animate
          attributeName="ry"
          values="10;10;10;1;10;10"
          keyTimes="0;0.85;0.9;0.93;0.96;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      <circle cx="59" cy="76" r="2.6" fill="#FFFFFF" />
      <circle cx="85" cy="76" r="2.6" fill="#FFFFFF" />

      {/* sonrisa */}
      <path d="M65 95 Q75 101 85 95" stroke="#8A5A22" strokeWidth="2.6" fill="none" strokeLinecap="round" />

      {/* abdomen — la luz */}
      <ellipse cx="75" cy="118" rx="18" ry="15" fill="url(#lumo-light)">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2.4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="75" cy="118" rx="8" ry="6.5" fill="#FFF3D2" />
    </svg>
  );
}
