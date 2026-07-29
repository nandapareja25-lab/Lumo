/**
 * Registro canónico de personajes — fuente única de verdad estructurada (2026-07-23).
 *
 * No reemplaza las Character Cards en `characters/*.md` (siguen siendo la ficha completa,
 * legible, con contexto y razones — CLAUDE.md §5.1) ni a `characters/REGISTRY.md` (índice de
 * slugs/colores). Este archivo existe para que el código de producción (scripts, dashboard,
 * `ContentItem.illustrations[].characterVersions`) tenga un dato consultable en vez de tener
 * que parsear markdown.
 *
 * Regla: antes de generar una ilustración nueva, revisar acá si el personaje ya existe. No
 * rediseñar desde cero un personaje con `status: "approved"` sin documentar el motivo y subir
 * `version`.
 */

export type CharacterStatus =
  /** Tiene Character Card completa en characters/[slug].md + Golden Master aprobado. */
  | "approved"
  /** Aparece en episodios reales pero solo con descripción ad-hoc en el prompt — todavía no
   * tiene Character Card propia. Encontrado durante la auditoría de 2026-07-23. */
  | "pendiente-de-ficha"
  | "descartado";

export type CharacterRecord = {
  id: string;
  nombre: string;
  descripcionCanonica: string;
  edadAparente: string;
  rasgosVisuales: string[];
  vestuario: string;
  paleta: { primario: string; secundario: string; acento: string };
  /** Ruta a la ficha completa, si existe. */
  fichaCompleta?: string;
  /** Ruta(s) a la imagen de referencia aprobada, si existe. */
  referenciasAprobadas: string[];
  episodios: string[];
  promptBase?: string;
  version: string;
  status: CharacterStatus;
  /** Por qué cambió de versión o quedó pendiente — obligatorio si version > "v1". */
  notas?: string;
};

export const CHARACTER_REGISTRY: CharacterRecord[] = [
  // ---- Personajes con Character Card aprobada (consolidados desde characters/*.md) ----
  {
    id: "lumo",
    nombre: "Lumo",
    descripcionCanonica: "Estrella sonriente, mascota y guía narrador de la app (rebrand 2026-07-28, reemplaza el diseño anterior de luciérnaga).",
    edadAparente: "n/a (personaje mascota)",
    rasgosVisuales: ["cuerpo de estrella amarillo miel", "halo dorado suave", "ojos grandes con catchlight", "mejillas sonrosadas"],
    vestuario: "n/a",
    paleta: { primario: "#F6C945", secundario: "#FFE9A8", acento: "#F6C945" },
    fichaCompleta: "characters/lumo.md",
    referenciasAprobadas: ["public/lumo-art/lumo_circle_default_200.webp", "public/lumo-art/lumo_circle_default_400.webp"],
    episodios: [],
    promptBase: "scripts/_prompts/lumo.txt",
    version: "v2",
    status: "approved",
  },
  {
    id: "david",
    nombre: "David",
    descripcionCanonica: "Pastor joven, futuro rey, honda al hombro.",
    edadAparente: "adolescente/joven",
    rasgosVisuales: ["honda de pastor colgada al hombro", "pañuelo/turbante simple"],
    vestuario: "túnica tierra + correa de honda",
    paleta: { primario: "#8A6A4E", secundario: "#C1642E", acento: "#C1642E" },
    fichaCompleta: "characters/david.md",
    referenciasAprobadas: ["public/lumo-art/david_circle_default_200.webp"],
    episodios: ["david-goliat"],
    promptBase: "scripts/_prompts/david.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "goliat",
    nombre: "Goliat",
    descripcionCanonica: "Guerrero gigante, antagonista puntual.",
    edadAparente: "adulto",
    rasgosVisuales: ["armadura de bronce pesada en capas", "lanza enorme", "escala gigante"],
    vestuario: "armadura de bronce + cuero oscuro",
    paleta: { primario: "#7A5C3E", secundario: "#3A2E22", acento: "#7A5C3E" },
    fichaCompleta: "characters/goliat.md",
    referenciasAprobadas: ["public/lumo-art/goliat_circle_default_200.webp"],
    episodios: ["david-goliat"],
    promptBase: "scripts/_prompts/goliat.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "noe",
    nombre: "Noé",
    descripcionCanonica: "Anciano de fe constante, constructor del arca.",
    edadAparente: "anciano",
    rasgosVisuales: ["barba larga blanca", "báculo de madera", "postura levemente encorvada"],
    vestuario: "túnica arena + manto verde madera",
    paleta: { primario: "#C9A06A", secundario: "#6E7F4E", acento: "#6E7F4E" },
    fichaCompleta: "characters/noe.md",
    referenciasAprobadas: ["public/lumo-art/noe_circle_default_200.webp"],
    episodios: ["noe-arca"],
    promptBase: "scripts/_prompts/noe.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "buen-samaritano",
    nombre: "El buen samaritano",
    descripcionCanonica: "Viajero que se detiene a ayudar a un desconocido herido.",
    edadAparente: "adulto",
    rasgosVisuales: ["frasco de barro con aceite", "vendas de tela al cinto"],
    vestuario: "manto de viaje índigo + cinto",
    paleta: { primario: "#3E5C7A", secundario: "#C9A06A", acento: "#5B7A9E" },
    fichaCompleta: "characters/buen-samaritano.md",
    referenciasAprobadas: ["public/lumo-art/buen-samaritano_circle_default_200.webp"],
    episodios: ["buen-samaritano"],
    promptBase: "scripts/_prompts/buen-samaritano.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "moises",
    nombre: "Moisés",
    descripcionCanonica: "Líder que guía al pueblo fuera de Egipto, báculo icónico.",
    edadAparente: "adulto mayor",
    rasgosVisuales: ["báculo de madera"],
    vestuario: "túnica ocre-dorada + faja de líder",
    paleta: { primario: "#C9973E", secundario: "#8A6A4E", acento: "#C9973E" },
    fichaCompleta: "characters/moises.md",
    referenciasAprobadas: ["public/lumo-art/moises_circle_default_200.webp"],
    episodios: ["moises-mar-rojo"],
    promptBase: "scripts/_prompts/moises.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "hijo-prodigo",
    nombre: "El hijo pródigo",
    descripcionCanonica: "Joven que vuelve a casa tras perderlo todo.",
    edadAparente: "joven adulto",
    rasgosVisuales: ["túnica raída y remendada"],
    vestuario: "tela gastada + remiendos",
    paleta: { primario: "#8A6A4E", secundario: "#6B5540", acento: "#8A6A4E" },
    fichaCompleta: "characters/hijo-prodigo.md",
    referenciasAprobadas: ["public/lumo-art/hijo-prodigo_circle_default_200.webp"],
    episodios: ["hijo-prodigo"],
    promptBase: "scripts/_prompts/hijo-prodigo.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "padre-prodigo",
    nombre: "El padre (hijo pródigo)",
    descripcionCanonica: "Padre que recibe con alegría al hijo que vuelve.",
    edadAparente: "adulto mayor",
    rasgosVisuales: ["manto amplio de dueño de casa"],
    vestuario: "túnica oliva + detalles cálidos",
    paleta: { primario: "#7A8450", secundario: "#C9A06A", acento: "#7A8450" },
    fichaCompleta: "characters/padre-prodigo.md",
    referenciasAprobadas: ["public/lumo-art/padre-prodigo_circle_default_200.webp"],
    episodios: ["hijo-prodigo"],
    promptBase: "scripts/_prompts/padre-prodigo.txt",
    version: "v2",
    status: "approved",
    notas: "v1 mostraba brazos/manos extendidos entrando en el cuadro, rompiendo el encuadre cabeza+hombros del roster. v2 corrigió quitando 'brazos abiertos' del prompt.",
  },
  {
    id: "daniel",
    nombre: "Daniel",
    descripcionCanonica: "Oficial de la corte babilónica, fe firme ante el peligro.",
    edadAparente: "adulto",
    rasgosVisuales: ["túnica de oficial de corte azul/púrpura"],
    vestuario: "túnica azul real + detalles púrpura",
    paleta: { primario: "#4A5C8A", secundario: "#5C4A7A", acento: "#4A5C8A" },
    fichaCompleta: "characters/daniel.md",
    referenciasAprobadas: ["public/lumo-art/daniel_circle_default_200.webp"],
    episodios: ["daniel-leones"],
    promptBase: "scripts/_prompts/daniel.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "jesus",
    nombre: "Jesús (adulto)",
    descripcionCanonica: "Maestro adulto, serenidad constante como rasgo permanente.",
    edadAparente: "adulto (~30 años)",
    rasgosVisuales: ["manto azul añil sobre túnica crema"],
    vestuario: "túnica crema + manto añil",
    paleta: { primario: "#EDE3D0", secundario: "#3E5C7A", acento: "#D4A13D" },
    fichaCompleta: "characters/jesus.md",
    referenciasAprobadas: ["public/lumo-art/jesus_circle_default_200.webp"],
    episodios: ["buen-samaritano", "jesus-tormenta"],
    promptBase: "scripts/_prompts/jesus.txt",
    version: "v1",
    status: "approved",
    notas:
      "Esta ficha es SOLO la versión adulta. Las apariciones de Jesús niño/bebé en 'La vida de Jesús' Temporada 1 son variantes de edad distintas, registradas por separado (ver jesus-bebe, jesus-nino-pequeno, jesus-12-anos) — pendientes de Character Card formal.",
  },
  {
    id: "jose",
    nombre: "José (hijo de Jacob)",
    descripcionCanonica: "Vendido por sus hermanos, perdona y salva a su familia. NO confundir con José de Nazaret.",
    edadAparente: "joven adulto",
    rasgosVisuales: ["túnica de colores (rojo, verde, azul, ocre)"],
    vestuario: "túnica multicolor + ribete dorado",
    paleta: { primario: "#7A5C8A", secundario: "#C9973E", acento: "#7A5C8A" },
    fichaCompleta: "characters/jose.md",
    referenciasAprobadas: ["public/lumo-art/jose_circle_default_200.webp"],
    episodios: ["jose-hermanos"],
    promptBase: "scripts/_prompts/jose.txt",
    version: "v1",
    status: "approved",
  },
  {
    id: "ester",
    nombre: "Ester",
    descripcionCanonica: "Reina que arriesga su posición para salvar a su pueblo.",
    edadAparente: "joven adulta",
    rasgosVisuales: ["corona dorada ornamentada"],
    vestuario: "vestido rosa/rojo real + bordados dorados",
    paleta: { primario: "#8A2E3E", secundario: "#C9973E", acento: "#C1668A" },
    fichaCompleta: "characters/ester.md",
    referenciasAprobadas: ["public/lumo-art/ester_circle_default_200.webp"],
    episodios: ["ester-reina"],
    promptBase: "scripts/_prompts/ester.txt",
    version: "v1",
    status: "approved",
  },

  // ---- Encontrados en producción real (Serie "La vida de Jesús" S1) sin Character Card
  // formal todavía — auditoría 2026-07-23, ver production/ILLUSTRATION-AUDIT.md. Documentados
  // acá con lo real que ya se generó, para no perder continuidad antes de crear su ficha. ----
  {
    id: "maria",
    nombre: "María",
    descripcionCanonica: "Madre de Jesús — joven, piel oliva cálida, manto celeste sencillo.",
    edadAparente: "joven adulta",
    rasgosVisuales: ["piel oliva cálida", "cubrecabeza y manto celeste sencillos"],
    vestuario: "manto/robe celeste pálido, sencillo",
    paleta: { primario: "#C8E0F0", secundario: "#8A6A4E", acento: "#5B7A9E" },
    referenciasAprobadas: [
      "public/lumo-art/series-vida-jesus-s1e1-belen_600.webp",
      "public/lumo-art/series-vida-jesus-s1e2-sabios_600.webp",
      "public/lumo-art/series-vida-jesus-s1e4-simeon_600.webp",
      "public/lumo-art/series-vida-jesus-s1e5-huida_600.webp",
      "public/lumo-art/series-vida-jesus-s1e6-nazaret_600.webp",
    ],
    episodios: [
      "vida-jesus-s1e1-buenas-noticias-en-belen",
      "vida-jesus-s1e2-los-sabios-de-oriente",
      "vida-jesus-s1e4-presentado-en-el-templo",
      "vida-jesus-s1e5-la-huida-a-egipto",
      "vida-jesus-s1e6-el-regreso-a-nazaret",
    ],
    version: "v1",
    status: "pendiente-de-ficha",
    notas: "Aparece en 5 de los 6 episodios de S1 con descripción consistente copiada manualmente prompt a prompt. Necesita Character Card propia antes del próximo lote para dejar de depender de copiar texto.",
  },
  {
    id: "jose-de-nazaret",
    nombre: "José (esposo de María)",
    descripcionCanonica: "Padre terrenal de Jesús — piel morena cálida, túnica de tono tierra. Slug distinto de `jose` (José, hijo de Jacob) para no confundirlos.",
    edadAparente: "joven adulto",
    rasgosVisuales: ["piel morena cálida", "túnica sencilla color tierra"],
    vestuario: "túnica color tierra sencilla",
    paleta: { primario: "#8A6A4E", secundario: "#6B5540", acento: "#8A6A4E" },
    referenciasAprobadas: [
      "public/lumo-art/series-vida-jesus-s1e1-belen_600.webp",
      "public/lumo-art/series-vida-jesus-s1e5-huida_600.webp",
      "public/lumo-art/series-vida-jesus-s1e6-nazaret_600.webp",
    ],
    episodios: [
      "vida-jesus-s1e1-buenas-noticias-en-belen",
      "vida-jesus-s1e5-la-huida-a-egipto",
      "vida-jesus-s1e6-el-regreso-a-nazaret",
    ],
    version: "v1",
    status: "pendiente-de-ficha",
  },
  {
    id: "jesus-bebe",
    nombre: "Jesús (recién nacido)",
    descripcionCanonica: "Variante de edad de Jesús — bebé recién nacido envuelto en telas.",
    edadAparente: "recién nacido",
    rasgosVisuales: ["envuelto en telas cálidas color crema"],
    vestuario: "n/a (envuelto)",
    paleta: { primario: "#EDE3D0", secundario: "#C9A06A", acento: "#D4A13D" },
    referenciasAprobadas: [
      "public/lumo-art/series-vida-jesus-s1e1-belen_600.webp",
      "public/lumo-art/series-vida-jesus-s1e4-simeon_600.webp",
      "public/lumo-art/series-vida-jesus-s1e5-huida_600.webp",
    ],
    episodios: [
      "vida-jesus-s1e1-buenas-noticias-en-belen",
      "vida-jesus-s1e4-presentado-en-el-templo",
      "vida-jesus-s1e5-la-huida-a-egipto",
    ],
    version: "v1",
    status: "pendiente-de-ficha",
  },
  {
    id: "jesus-nino-pequeno",
    nombre: "Jesús (niño pequeño, edad de caminar)",
    descripcionCanonica: "Variante de edad de Jesús — toddler, ya de edad de caminar y tomarse de la mano.",
    edadAparente: "~2 años",
    rasgosVisuales: ["curiosidad brillante"],
    vestuario: "túnica infantil simple",
    paleta: { primario: "#EDE3D0", secundario: "#C9A06A", acento: "#D4A13D" },
    referenciasAprobadas: [
      "public/lumo-art/series-vida-jesus-s1e2-sabios_600.webp",
      "public/lumo-art/series-vida-jesus-s1e6-nazaret_600.webp",
    ],
    episodios: ["vida-jesus-s1e2-los-sabios-de-oriente", "vida-jesus-s1e6-el-regreso-a-nazaret"],
    version: "v1",
    status: "pendiente-de-ficha",
  },
  {
    id: "jesus-12-anos",
    nombre: "Jesús (12 años)",
    descripcionCanonica: "Variante de edad de Jesús — niño de 12 años, curioso, conversando con maestros.",
    edadAparente: "12 años",
    rasgosVisuales: ["mirada curiosa y enfocada"],
    vestuario: "túnica crema sencilla",
    paleta: { primario: "#EDE3D0", secundario: "#C9A06A", acento: "#D4A13D" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e3-templo_600.webp"],
    episodios: ["vida-jesus-s1e3-el-nino-en-el-templo"],
    version: "v1",
    status: "pendiente-de-ficha",
    notas: "Único episodio de la temporada sin María/José en escena — revisar si eso es intencional al planear ilustraciones adicionales para este episodio.",
  },
  {
    id: "simeon",
    nombre: "Simeón",
    descripcionCanonica: "Anciano del templo que reconoce al Mesías en el bebé Jesús.",
    edadAparente: "anciano",
    rasgosVisuales: ["barba blanca larga", "lágrimas de alegría"],
    vestuario: "túnica roja profunda",
    paleta: { primario: "#8A2E3E", secundario: "#6B5540", acento: "#8A2E3E" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e4-simeon_600.webp"],
    episodios: ["vida-jesus-s1e4-presentado-en-el-templo"],
    version: "v1",
    status: "pendiente-de-ficha",
  },
  {
    id: "sabio-oro",
    nombre: "Sabio de oriente (oro)",
    descripcionCanonica: "El primero de los tres sabios — turbante púrpura, cofre de oro.",
    edadAparente: "adulto",
    rasgosVisuales: ["turbante púrpura profundo", "cofre pequeño de oro"],
    vestuario: "túnica de viaje ornamentada",
    paleta: { primario: "#5C2E7A", secundario: "#C9973E", acento: "#C9973E" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e2-sabios_600.webp"],
    episodios: ["vida-jesus-s1e2-los-sabios-de-oriente"],
    version: "v1",
    status: "pendiente-de-ficha",
    notas: "Aparece una sola vez hasta ahora — si vuelve a salir en otra temporada, formalizar ficha antes de reutilizarlo.",
  },
  {
    id: "sabio-incienso",
    nombre: "Sabio de oriente (incienso)",
    descripcionCanonica: "El segundo de los tres sabios — turbante turquesa, canasta de incienso.",
    edadAparente: "adulto",
    rasgosVisuales: ["turbante turquesa", "canasta abierta con resina de incienso"],
    vestuario: "túnica de viaje ornamentada",
    paleta: { primario: "#2E7A6E", secundario: "#C1642E", acento: "#2E7A6E" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e2-sabios_600.webp"],
    episodios: ["vida-jesus-s1e2-los-sabios-de-oriente"],
    version: "v1",
    status: "pendiente-de-ficha",
  },
  {
    id: "sabio-mirra",
    nombre: "Sabio de oriente (mirra)",
    descripcionCanonica: "El tercero de los tres sabios — turbante borgoña, frasco de alabastro.",
    edadAparente: "adulto",
    rasgosVisuales: ["turbante borgoña", "frasco alto de alabastro blanco"],
    vestuario: "túnica de viaje ornamentada",
    paleta: { primario: "#6E2E3A", secundario: "#EDE3D0", acento: "#6E2E3A" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e2-sabios_600.webp"],
    episodios: ["vida-jesus-s1e2-los-sabios-de-oriente"],
    version: "v1",
    status: "pendiente-de-ficha",
  },
  {
    id: "angel-anunciacion",
    nombre: "Ángel de la anunciación a los pastores",
    descripcionCanonica: "Figura de luz cálida dorada, sin rasgos de género marcados, alas suaves — anuncia el nacimiento a los pastores.",
    edadAparente: "n/a",
    rasgosVisuales: ["cuerpo de luz cálida dorada", "sin pies visibles (se disuelve en luz)", "alas suaves"],
    vestuario: "n/a (luz)",
    paleta: { primario: "#FFE060", secundario: "#FFF8E8", acento: "#FFD740" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e1-angel-pastores_600.webp"],
    episodios: ["vida-jesus-s1e1-buenas-noticias-en-belen"],
    version: "v1",
    status: "pendiente-de-ficha",
    notas: "Aparece una sola vez hasta ahora. Formalizar ficha si vuelve a aparecer en otra temporada.",
  },
  {
    id: "maestro-del-templo",
    nombre: "Maestro del templo",
    descripcionCanonica: "Anciano maestro que se sorprende con las preguntas del niño Jesús.",
    edadAparente: "anciano",
    rasgosVisuales: ["barba gris larga"],
    vestuario: "túnica azul profundo",
    paleta: { primario: "#3E5C7A", secundario: "#6B5540", acento: "#3E5C7A" },
    referenciasAprobadas: ["public/lumo-art/series-vida-jesus-s1e3-templo_600.webp"],
    episodios: ["vida-jesus-s1e3-el-nino-en-el-templo"],
    version: "v1",
    status: "pendiente-de-ficha",
  },
];

export function getCharacter(id: string): CharacterRecord | undefined {
  return CHARACTER_REGISTRY.find((c) => c.id === id);
}

export function charactersApprovedOnly(): CharacterRecord[] {
  return CHARACTER_REGISTRY.filter((c) => c.status === "approved");
}

export function charactersPendingFicha(): CharacterRecord[] {
  return CHARACTER_REGISTRY.filter((c) => c.status === "pendiente-de-ficha");
}
