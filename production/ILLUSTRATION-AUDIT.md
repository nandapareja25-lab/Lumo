# Auditoría de ilustraciones e inconsistencias de personajes (2026-07-23)

Disparada por el nuevo requisito obligatorio: cada episodio debe tener ilustraciones completas
por escena, personajes consistentes desde un registro canónico, y no solo una portada única.
Esta auditoría cubre los 6 episodios ya producidos ("La vida de Jesús" T1) antes de abrir el
siguiente lote.

## Hallazgo 1 — Los 6 episodios existentes tienen una sola ilustración (portada), no por escena

Cada episodio tiene 4-6 segmentos narrativos (`ContentSegment[]`) pero una sola imagen que se
muestra durante todo el episodio (`illustrationSlug`, ahora también reflejado como una única
entrada en `illustrations[]`). Ningún episodio tiene ilustraciones para escenas individuales
(ej. la aparición del ángel a los pastores en S1E1 no tiene imagen propia — solo se ve el
pesebre inicial durante todo el episodio).

| Episodio | Ilustraciones hoy | Escenas del guion | Necesita ilustraciones adicionales |
|---|---|---|---|
| S1E1 — Buenas noticias en Belén | 1/1 (portada) | 5 segmentos | Sí — momento del ángel y los pastores es el más visualmente distinto del episodio y no tiene imagen propia |
| S1E2 — Los sabios que siguieron una estrella | 1/1 (portada) | ~5 segmentos | Sí |
| S1E3 — El niño que sorprendió a los maestros | 1/1 (portada) | ~5 segmentos | Menor prioridad — episodio de 2 personajes, escena única real |
| S1E4 — El anciano que esperó toda su vida | 1/1 (portada) | ~5 segmentos | Sí — STATUS.json menciona que se agregó el personaje Ana al guion pero nunca se ilustró |
| S1E5 — Un viaje en medio de la noche | 1/1 (portada) | ~5 segmentos | Menor prioridad — episodio de una sola escena continua (el viaje) |
| S1E6 — La vuelta a casa | 1/1 (portada) | ~5 segmentos | Menor prioridad |

**Ninguno está "completo" bajo el nuevo estándar.** Los 6 pasan a `illustrations` con 1 entrada
honesta (no se infló el dato), y ninguno debe re-marcarse `approved`/`published` a futuro sin
que se le sumen las escenas que le falten.

## Hallazgo 2 — Personajes recurrentes sin Character Card formal

María, José (padre terrenal), los tres sabios, Simeón, el maestro del templo, y las 4 variantes
de edad de Jesús (bebé / niño pequeño / 12 años / adulto ya existente) aparecen en los 6
episodios con descripciones repetidas manualmente prompt a prompt — nunca tuvieron una ficha
canónica. Quedaron consolidados ahora en `lib/character-registry.ts` con `status:
"pendiente-de-ficha"`, usando exactamente lo que ya se generó (sin inventar nada nuevo), para
no perder la continuidad visual lograda hasta ahora.

**Riesgo real detectado:** `characters/jesus.md` (el Golden Master aprobado) describe a un
Jesús **adulto** con manto azul añil — completamente distinto de las 4 variantes infantiles de
esta serie. Si alguien genera una imagen nueva de "Jesús" citando esa ficha sin especificar la
variante de edad, el resultado no va a coincidir con ninguna imagen ya aprobada de la serie.

## Hallazgo 3 — Un personaje mencionado en el guion sin ilustrar

`production/STATUS.json` (nota de S1E4) dice que se agregó el personaje "Ana" al guion durante
la revisión editorial, pero la ilustración de S1E4 solo muestra a Simeón y María — Ana nunca
aparece visualmente. Es una inconsistencia real entre texto e imagen.

## Resolución (2026-07-23, tras la unificación de estilo)

- **Las 8 oraciones fueron regeneradas por completo** — no eran un caso de "faltan escenas", eran
  un caso de **estilo visual equivocado**: usaban un sistema de prompt distinto (`largometraje
  animado`/"fotografía emocional", proporciones naturales) que nunca pasó por CLAUDE.md. Las 8
  imágenes viejas (`prayer-*.png`) se eliminaron del proyecto junto con sus entradas en
  `data/landing-assets.json` — reemplazo completo, no retoque.
- **Los 6 episodios de "La vida de Jesús" NO se regeneraron en su portada** — a diferencia de las
  oraciones, ya usaban el sistema correcto de CLAUDE.md desde el primer día (mismo MASTER BLOCK,
  proporciones heroicas, esquema de 3 luces). Regenerarlas habría sido gasto sin beneficio real:
  el problema real de los episodios nunca fue el estilo, sino la falta de escenas adicionales y de
  fichas formales de personajes secundarios (Hallazgo 1 y 2 arriba, que siguen vigentes salvo lo
  resuelto abajo).
- **S1E1 (Belén) recibió su 2ª ilustración real** — la escena del ángel y los pastores
  (`series-vida-jesus-s1e1-angel-pastores`), asignada a su segmento correspondiente vía
  `illustrationId`. Es el primer episodio con más de una ilustración por escena.
- **Inconsistencia de Ana (S1E4) resuelta editorialmente, no visualmente** — su aparición en el
  guion es una frase de cierre (un personaje secundario que se menciona, no protagoniza una
  escena), el mismo tratamiento que otros personajes de texto en el catálogo (el sacerdote, el
  levita en "El buen samaritano"). No se generó imagen nueva; no hacía falta.
- **Limitación conocida sin resolver:** ninguno de los 6 episodios tiene audio real todavía, así
  que la pantalla "narración en producción" siempre muestra la escena en índice 0 — la 2ª
  ilustración de S1E1 solo se verá una vez que exista narración real y se llegue a la pantalla de
  reproducción activa. No es un bug nuevo, es el mismo estado pendiente de siempre.

## Plan de actualización (sin detener el lote siguiente)

Orden por visibilidad/impacto, no por número de episodio:

1. **S1E1 (Belén)** — es el episodio de apertura de temporada, el más visto probablemente.
   Agregar una 2ª ilustración para la escena del ángel y los pastores.
2. **S1E4 (Simeón)** — resolver la inconsistencia de Ana (ilustrarla si se mantiene en el
   guion, o quitarla del guion si no amerita una imagen propia — decisión editorial, no técnica).
3. **S1E2 (sabios)** — ya usa la mayor cantidad de personajes nuevos (3 sabios); formalizar sus
   Character Cards antes de que reaparezcan en otra temporada.
4. **Crear Character Cards formales** para María y José de Nazaret (characters/maria.md,
   characters/jose-de-nazaret.md) — son los que más se repiten (5 y 3 episodios respectivamente).
5. **S1E3, S1E5, S1E6** — quedan con 1 ilustración por ahora (menor prioridad, escenas de un solo
   momento continuo); revisar si ameritan una 2ª imagen cuando se retome esta temporada.

Este plan no bloquea el siguiente lote de producción — el próximo lote se construye ya con el
flujo de 10 pasos (`production/agents/README.md`) y el registro de personajes desde el inicio,
así no repite el mismo problema.
