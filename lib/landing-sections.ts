/** Lista de piezas de arte (escenas de landing + poses del personaje) que se generan y aprueban en /admin/landing. */
export const LANDING_SECTIONS = [
  { slug: "hero", label: "Landing — Hero principal" },
  { slug: "historias-biblicas", label: "Landing — Historias bíblicas" },
  { slug: "oracion-familia", label: "Landing — Oración en familia" },
  { slug: "diario-espiritual", label: "Landing — Diario espiritual" },
  { slug: "rutina-noche", label: "Landing — Rutina de noche" },
  { slug: "registro-final", label: "Landing — Sección final de registro" },
  { slug: "lumo-frontal", label: "Lumo — Retrato frontal (uso general)" },
  { slug: "lumo-feliz", label: "Lumo — Expresión feliz/celebrando" },
  { slug: "lumo-volando", label: "Lumo — Volando (hero/onboarding)" },
] as const;

export type LandingSectionSlug = (typeof LANDING_SECTIONS)[number]["slug"];

export type LandingAsset = {
  url: string;
  prompt: string;
  approvedAt: string;
};

export type LandingAssetsMap = Record<LandingSectionSlug, LandingAsset | null>;
