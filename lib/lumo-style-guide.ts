/**
 * Guía de estilo reutilizable para CUALQUIER prompt de generación de imagen de Lumo.
 * Se antepone siempre al prompt que escribe el admin (ver app/api/admin/generate-image).
 * Fuente de verdad de identidad visual: FICHA-ARTE.md → "Rediseño del personaje" (ficha del
 * usuario, 2026-07-17) — no redecidir aquí, solo traducir a instrucciones de generación.
 */
export const LUMO_STYLE_GUIDE = `
Estilo de render: render 3D estilo película animada infantil premium (calidad tipo largometraje
animado moderno) — NUNCA un dibujo vectorial plano ni ilustración 2D. Volumen suave, sombreado
tipo "claymation"/Pixar, texturas suaves y redondeadas, iluminación cálida y cinematográfica con
profundidad de campo real. NUNCA una copia de un personaje o escena existente.

PERSONAJE "LUMO" — luciérnaga mágica (diseño oficial, seguir con fidelidad):
- Cuerpo: ovalado, dorado cálido (tono miel/ámbar), muy redondeado y tierno, sin ángulos duros.
- Cabeza y cuerpo forman una sola silueta continua (sin cuello marcado), como un peluche.
- Ojos: MUY grandes en proporción a la cara, color café oscuro, con un brillo/highlight blanco
  claro — la expresión por defecto es dulce, cálida, ligeramente curiosa.
- Sonrisa pequeña y simple, mejillas con un leve rubor cálido.
- Antenas: dos, finas, curvas hacia arriba y afuera, cada una termina en una lucecita cálida que
  brilla (como una bombillita diminuta).
- Alas: un par, translúcidas, con un patrón sutil de venas, tono crema/dorado muy pálido, se
  pliegan detrás del cuerpo.
- Abdomen inferior (la "luz"): un segmento redondeado en la parte baja del cuerpo que emite un
  brillo cálido dorado/amarillo — ESTA LUZ NUNCA DESAPARECE POR COMPLETO, solo cambia de
  intensidad (regla de personalidad no negociable).
- Paleta exacta del personaje: cuerpo dorado (#F2BB4E aprox.), detalles/sombra marrón-dorado
  (#C98A2E aprox.), luz del abdomen amarillo brillante (#FFE066 aprox.), ojos café oscuro
  (#3B2A1E aprox.), alas crema translúcida (#F7F1DC aprox.).
- Personalidad a transmitir siempre en pose/expresión: curioso, amable, valiente, empático,
  alegre, esperanzador — nunca temeroso, nunca travieso/pícaro, nunca sarcástico.
- Escala de referencia: pequeño, del tamaño de la palma de una mano de un niño (~40cm si estuviera
  en el mundo real) — siempre se ve pequeño y entrañable junto a personas u objetos.

PROHIBIDO SIEMPRE:
- Texto, letras, palabras o números dentro de la imagen.
- Logos, marcas de agua, marcas comerciales.
- Cualquier personaje o estilo reconocible de Disney, Pixar, Theo, Eden Kids Bible Stories,
  o cualquier IP protegida — Lumo debe ser reconocible como personaje 100% propio, no una copia.
- Colores fuera de la paleta del personaje, expresiones agresivas o tristes por defecto, alas o
  antenas rígidas/mecánicas.
`.trim();

export function buildLumoPrompt(userPrompt: string): string {
  return `${LUMO_STYLE_GUIDE}\n\nInstrucción específica de esta pieza:\n${userPrompt.trim()}`;
}
