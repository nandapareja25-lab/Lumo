/**
 * Prompt maestro de identidad visual de Lumo — fuente única de verdad (ver LUMO-CONTENT-BIBLE.md
 * sección 17, "Prompt maestro"). Aprobado por el usuario como el ÚNICO estilo permitido para
 * cualquier ilustración del proyecto. No mencionar personajes ni escenas acá — eso lo agrega cada
 * historia como un bloque corto (personajes/acción/escenario/emoción) vía `buildStoryPrompt`.
 *
 * Si se edita este texto, editar también la copia inline en scripts/generate-hero-art.mjs en la
 * misma sesión — deben quedar idénticas.
 */
export const STORY_STYLE_GUIDE = `
Ilustración de largometraje animado 3D — nunca fotorrealista, nunca un render publicitario, nunca
una fotografía. La dirección artística es cálida, emotiva y atemporal.

Personajes estilizados: proporciones naturales pero simplificadas, con rasgos legibles y muy
expresivos incluso en miniatura. Rostros cálidos y llenos de vida, evitando el fotorrealismo y el
exceso de detalle — formas simples y limpias antes que texturas complejas. La emoción se lee
primero, el detalle queda en segundo plano.

Los personajes deben sentirse cercanos y humanos, nunca caricaturescos al punto de perder
naturalidad, y nunca con el aspecto plástico o genérico típico de imágenes de IA genéricas.

Los materiales (piel, cabello, telas) se resuelven con formas simples y pintadas, no con detalle
fotográfico ni texturas hiperrealistas. El entorno debe sentirse vivo y creíble sin competir con
el personaje.

La iluminación cuenta la historia — cálida, del hogar, nunca espectacular ni artificial —
dominada por tonos ámbar, madera, crema y terracota. Azules muy suaves solo cuando la escena
específicamente lo pida. La escena transmite profundidad con un primer plano, plano medio y fondo
diferenciados, siempre con lenguaje de cámara de película animada — nunca un lente dramático ni
una composición publicitaria o fotográfica.

Cada ilustración es un instante que está ocurriendo, nunca una pose. Los personajes no posan ni
sonríen para el espectador — están dentro de la escena, viviendo el momento. Cada imagen debe
sentirse como un fotograma real de una película: quien la mira debería poder imaginar lo que pasó
un segundo antes y lo que va a pasar un segundo después.

Las imágenes deben generarse en formato vertical nativo 9:16, compuestas específicamente para
dispositivos móviles, sin recortes posteriores.

Nunca generar:
- texto o tipografía;
- logotipos o marcas de agua;
- personajes mirando directamente a cámara sin motivo narrativo, o posando para el espectador;
- fotorrealismo, apariencia de render publicitario o de fotografía;
- detalle o textura excesiva que compita con la emoción principal de la escena;
- apariencia plástica o de juguete;
- fondos vacíos o sin profundidad;
- composiciones donde el rostro ocupe casi toda la imagen.
`.trim();

/** Tamaño de generación estándar — vertical, no cuadrado (ver sección 17 del Content Bible). */
export const STORY_IMAGE_SIZE = "1024x1536";

/**
 * Cada historia agrega solo su bloque de 4 campos (personajes/acción/escenario/emoción) al
 * prompt maestro — nunca se reescribe ni varía el resto del estilo.
 */
export function buildStoryPrompt(storyBlock: string): string {
  return `${STORY_STYLE_GUIDE}\n\n${storyBlock.trim()}`;
}
