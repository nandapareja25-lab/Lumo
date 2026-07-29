type LumoProps = {
  size?: number;
  className?: string;
};

/**
 * El personaje de marca: Lumo, una estrella sonriente — rebrand 2026-07-28 (reemplaza el diseño
 * anterior de luciérnaga, ver characters/lumo.md). Personalidad sin cambios: curioso, amable,
 * valiente, empático, alegre, esperanzador — solo cambió su apariencia ilustrada.
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
        <radialGradient id="lumo-halo" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#F6C945" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F6C945" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lumo-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9D666" />
          <stop offset="100%" stopColor="#F6C945" />
        </linearGradient>
      </defs>

      <circle cx="75" cy="78" r="72" fill="url(#lumo-halo)" />

      {/* estrella de 5 puntas redondeadas, con brazos y piernas cortos */}
      <path
        d="M75 24
           C79 24 82 27 84 32
           L94 54
           C96 58 100 61 105 62
           L128 66
           C137 67 141 78 135 85
           L119 101
           C115 105 113 110 114 115
           L118 138
           C120 148 110 155 102 150
           L81 139
           C77 137 73 137 69 139
           L48 150
           C40 155 30 148 32 138
           L36 115
           C37 110 35 105 31 101
           L15 85
           C9 78 13 67 22 66
           L45 62
           C50 61 54 58 56 54
           L66 32
           C68 27 71 24 75 24 Z"
        fill="url(#lumo-body)"
        stroke="#E8B93A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* brazos cortos y redondeados */}
      <ellipse cx="24" cy="92" rx="9" ry="7" fill="#F6C945" stroke="#E8B93A" strokeWidth="1.2" />
      <ellipse cx="126" cy="92" rx="9" ry="7" fill="#F6C945" stroke="#E8B93A" strokeWidth="1.2" />

      {/* piernas cortas y redondeadas */}
      <ellipse cx="58" cy="146" rx="8" ry="7" fill="#F6C945" stroke="#E8B93A" strokeWidth="1.2" />
      <ellipse cx="92" cy="146" rx="8" ry="7" fill="#F6C945" stroke="#E8B93A" strokeWidth="1.2" />

      {/* mejillas */}
      <ellipse cx="56" cy="92" rx="6.5" ry="4.5" fill="#FFB4A8" opacity="0.65" />
      <ellipse cx="94" cy="92" rx="6.5" ry="4.5" fill="#FFB4A8" opacity="0.65" />

      {/* ojos (con parpadeo) */}
      <ellipse cx="63" cy="80" rx="8.5" ry="9" fill="#10204A">
        <animate
          attributeName="ry"
          values="9;9;9;1;9;9"
          keyTimes="0;0.85;0.9;0.93;0.96;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse cx="87" cy="80" rx="8.5" ry="9" fill="#10204A">
        <animate
          attributeName="ry"
          values="9;9;9;1;9;9"
          keyTimes="0;0.85;0.9;0.93;0.96;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      <circle cx="60" cy="76" r="2.4" fill="#FFFFFF" />
      <circle cx="84" cy="76" r="2.4" fill="#FFFFFF" />

      {/* sonrisa amplia */}
      <path d="M62 94 Q75 104 88 94" stroke="#10204A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
