# LUMO CONTENT BIBLE

Guía oficial de producción de contenido de Lumo. Ningún episodio se produce (guion escrito, audio
generado) sin cumplir esta guía. Cambiarla requiere una decisión explícita del usuario, igual que
FICHA-ARTE.md — es "cosa juzgada" hasta que se pida lo contrario.

Prioridad del proyecto: **20 episodios extraordinarios valen más que 200 promedio.** La calidad
narrativa es el principal diferenciador de Lumo frente a Theo/Eden/otros. Nunca se sacrifica
calidad por volumen.

---

## 1. Filosofía narrativa

Lumo no es una app para leer. Es una plataforma de **experiencias narradas** — el contenido es el
producto, la interfaz solo lo organiza. Referencia de calidad: Disney+ (producción), Spotify/Audible
(hábito de escucha), Theo (nicho cristiano familiar). Todo debe funcionar 100% con los ojos
cerrados: si el usuario nunca lee una palabra en pantalla, la experiencia sigue completa. El texto
(subtítulos) es siempre un acompañamiento, nunca el vehículo principal.

## 2. La voz de Lumo — rol, no narrador

Lumo es una luciérnaga mágica, guía cálida y curiosa (ver FICHA-ARTE.md para diseño visual y
personalidad: sereno, cálido, entrañable). En el contenido, Lumo **no narra la historia de
corrido** y **no se presenta en cada episodio** ("Hola, soy Lumo..." repetido rompe la inmersión —
regla dura, corregida en sesión tras feedback directo del usuario).

Dónde aparece Lumo:
- **Cierre reflexivo, siempre** — después de cada historia/experiencia, 1 segmento corto de Lumo
  conectando el contenido con la vida del niño y presentando la pregunta de reflexión.
- **Apertura de una serie nueva, no de cada episodio** — cuando una familia empieza una serie por
  primera vez (ej. primer episodio de "David"), Lumo puede introducir el personaje/tema una sola
  vez. Los episodios siguientes de esa misma serie NO repiten la introducción.
- **Momentos especiales** (a definir caso a caso: un logro, un milestone) — nunca de forma
  automática/repetitiva.

Nunca: Lumo como narrador omnisciente de la historia completa, Lumo interrumpiendo escenas de
acción/diálogo, frases de relleno tipo "¿Estás listo?" repetidas episodio tras episodio.

## 3. Estilo literario y tono

Cada historia es un pequeño audiolibro, no un resumen. Debe tener:
- **Narración descriptiva** — ambientación sensorial (qué se ve, se oye, se siente), no solo
  acción encadenada.
- **Diálogos reales** — los personajes hablan entre sí con voz propia, no se resume lo que dijeron.
- **Emoción** — el lector/oyente debe sentir tensión, calidez, sorpresa; no una lista de hechos.
- **Pausas y silencios** — momentos de respiro entre la acción (ver sección 10).
- **Ambientación** — lugar, clima, sonido del entorno, como parte de la narración.

Prohibido: prosa tipo "X pasó. Y pasó. Z pasó." (estilo resumen bíblico de librito de escuela
dominical). Ejemplo de referencia (aprobado por el usuario, de "David y el gigante"):

> David respiró profundo mientras observaba al enorme gigante que caminaba de un lado a otro. Cada
> paso hacía temblar el suelo. Los soldados israelitas bajaban la mirada y nadie se atrevía a
> enfrentarlo.
>
> David miró las cinco piedras lisas que acababa de recoger del arroyo. Eran pequeñas... muy
> pequeñas. Pero sonrió.
>
> —No estoy solo —susurró—. Dios está conmigo.

## 4. Fidelidad bíblica — no negociable

La fidelidad a las Escrituras es un pilar de marca, no un detalle legal.
- Los eventos, personajes, diálogos centrales y el mensaje teológico deben ser consistentes con el
  texto bíblico real (traducción de referencia: NVI, la misma que usa el link "leer el pasaje
  completo").
- Diálogo reconstruido/dramatizado está permitido (el texto bíblico no siempre da diálogo literal
  completo) siempre que no contradiga ni invente teología nueva.
- Cada historia **debe** cerrar mostrando la referencia bíblica completa con rango de versículos
  cuando exista (ej. "1 Samuel 17:1–58", "Lucas 15:11–32"), nunca solo el capítulo suelto salvo que
  el pasaje abarque varios capítulos completos (ej. "Génesis 6–9").
- Ningún contenido doctrinal se genera ni se aprueba solo con IA sin revisión humana (regla NUNCA
  ya establecida en ESTADO.md, sigue vigente para todo lo que este documento cubre).

## 5. Estructura de un episodio (anatomía estándar)

1. **Apertura** — entra directo en la narración (sin saludo de Lumo repetido). Excepción: primer
   episodio de una serie nueva, ver sección 2.
2. **N escenas narrativas** (cantidad y duración según el tipo, sección 7) — narración+diálogo,
   mood coherente con el momento. Todas comparten **una sola ilustración principal** por episodio
   (ver sección 17 — no ilustración por escena, por ahora).
3. **Cierre de Lumo** — reflexión breve conectando con la vida del niño.
4. **Pregunta de reflexión** — 1 pregunta abierta, no de sí/no, que invite a hablar en familia.
5. **Pantalla de referencia bíblica** — "Esta historia está basada en [libro capítulo:versículos]"
   + "Esta historia está basada en las Escrituras. Te invitamos a leer el pasaje completo en
   familia." + link real a BibleGateway. Ya implementado en `app/reproducir/[id]/page.tsx`.

## 6. Duración objetivo por tipo de contenido

| Tipo | Duración | Créditos de audio aprox. (1 crédito = 1 carácter) |
|---|---|---|
| Historia corta | 6-8 min | ~5,300 |
| Historia estándar | 8-12 min | ~7,600 |
| Historia épica (David, Moisés, José, Jesús) | 12-20 min | ~12,150 |
| Oración guiada | 3-7 min | ~3,800 |
| Momento para dormir | 8-12 min | ~7,600 |
| Devocional | 5-8 min | ~4,900 |
| Meditación | 3-6 min | ~3,400 |

## 7. Cantidad y longitud de escenas

- Cada escena narrativa dura **45-90 segundos de audio real** (nunca 8-15s — eso es resumen, no
  storytelling). En caracteres, ~570-1,140 por escena (calibrado a ~761 caracteres/minuto de
  narración con la voz de Lumo).
- Cantidad de escenas = duración objetivo ÷ ~1 minuto por escena, aproximadamente:
  - Historia corta: 5-6 escenas
  - Historia estándar: 7-9 escenas
  - Historia épica: 10-14 escenas
  - Oración guiada: 3-4 bloques (intro/reflexión/oración/cierre)
- Menos escenas pero más ricas, nunca decenas de micro-fragmentos.

## 8. Ritmo narrativo

Alternar siempre, nunca una sola cosa seguida por mucho tiempo:
narración → diálogo → descripción → silencio/pausa → reflexión → narración...

Prohibido: una escena entera de puras acciones consecutivas sin diálogo ni pausa
("X hizo esto. Luego hizo esto otro. Luego esto.").

## 9. Uso de diálogos

Cada escena narrativa (salvo la de apertura puramente descriptiva) debe incluir **al menos un
intercambio de diálogo real** entre personajes, con guion largo (—), no resumido en discurso
indirecto ("le dijo que..."). Meta orientativa: al menos 30-40% del texto de las escenas centrales
(el clímax, las decisiones importantes) debe ser diálogo directo.

## 10. Uso del silencio y las pausas

Representado de dos formas:
- **En el guion**: puntos suspensivos, frases cortas aisladas, un beat de una sola oración que
  respira ("Silencio. Ni un soldado se movía.").
- **En la producción de audio**: pausas naturales entre frases (la voz de Lumo con
  `stability: 0.5` ya deja aire natural entre oraciones); no rellenar cada segundo con narración.

## 11. Ritmo emocional

Cada episodio construye tensión y la resuelve — nunca queda plano. Estructura emocional típica:
calma inicial → aparece el conflicto/duda/miedo → tensión creciente → punto de decisión/clímax →
resolución → calma final + reflexión. El cierre de Lumo debe bajar la energía, nunca dejar al niño
en el pico de tensión antes de dormir/terminar.

## 12. Música

**Biblioteca reutilizable, no composición por episodio** — mucho más consistente de marca y
sostenible en costo (una pista original por cada uno de 131+ episodios sería ~900 créditos/minuto
cada vez; una biblioteca de ~18 pistas ambientales de ~1.5 min reutilizadas en todo el catálogo
cuesta ~24,300 créditos una sola vez). Cada pista se asocia a un `mood` (los 6 ya definidos:
family/book/prayer/diary/night/threshold) y se elige por escena según su mood, en volumen bajo,
nunca compitiendo con la narración.

## 13. Efectos de sonido

Mismo principio: **biblioteca reutilizable** de ~30-40 efectos (pasos, viento, agua, truenos,
murmullo de multitud, puerta, etc.), usados con moderación — 1-2 momentos clave por episodio, no
como decoración constante. Nunca efectos que distraigan de la narración o asusten de más (checar
contra el tono cálido/esperanzador de la marca).

## 14. Subtítulos

Estilo subtítulo de película, **nunca** karaoke palabra-por-palabra y **nunca** el guion completo
de una sola vez. Frases cortas (~22-45 caracteres) que aparecen y desaparecen en sincronía real con
el audio, usando las marcas de tiempo del proveedor de voz (`with-timestamps` — sin costo extra,
confirmado empíricamente). Implementado en `app/reproducir/[id]/page.tsx` vía `cueText` +
`onTimeUpdate`.

## 15. Producción de audio — reglas operativas

- Nunca Web Speech API ni ninguna síntesis de navegador como parte del producto — si el audio real
  no existe todavía, se muestra honestamente "en producción", nunca se finge narración.
- El proveedor de voz es intercambiable (`scripts/audio-providers/`, contrato `AudioProvider`) — hoy
  ElevenLabs, mañana puede ser otro sin tocar la app.
- Ningún guion se manda a generar audio real hasta que su guion escrito esté aprobado contra esta
  guía.

## 16. Estándares de calidad — checklist de aprobación de un episodio

Antes de aprobar un guion para producción de audio, debe cumplir TODO esto:
- [ ] Ninguna escena dura menos de 45s estimados (ni un resumen de 2-3 oraciones).
- [ ] Al menos un diálogo real por escena central.
- [ ] Ritmo alternado (narración/diálogo/descripción/pausa), no bloques monótonos.
- [ ] Lumo no se presenta con saludo repetido; solo cierre reflexivo (+ apertura de serie si aplica).
- [ ] Cierre con pregunta de reflexión abierta.
- [ ] Referencia bíblica completa y verificada contra el texto real.
- [ ] Tono cálido/esperanzador, sin violencia gráfica ni miedo desproporcionado (ver
  `lib/story-style-guide.ts` para las restricciones ya vigentes de contenido).
- [ ] Duración total dentro del rango de su categoría (sección 6).

## 17. Dirección artística e ilustraciones

Las ilustraciones no son decoración — son parte de la narración. Tienen exactamente la misma
jerarquía que el guion: un episodio no está terminado si el guion es perfecto pero el arte es
genérico.

**Filosofía**: cada ilustración debe contar la historia incluso antes de reproducir el audio. Nada
de personajes posando para la cámara, nada de retratos sin contexto — cada imagen es un momento
clave de la historia, capturado con emoción.

**Referencias de calidad** (inspiración de composición e iluminación, no de estilo a copiar
literalmente): Pixar, Disney Animation Studios, DreamWorks (composición cinematográfica), *The Wild
Robot*, *Klaus*, *Arcane* (solo iluminación/composición). El objetivo es nivel cinematográfico, no
ilustración infantil simple.

**Regla de oro**: si una ilustración no podría imprimirse como página de un cuento ilustrado o
como póster de una película animada, no cumple el estándar de Lumo.

**Una sola ilustración principal por episodio (decisión vigente, revierte la idea de "una por
escena")**: se probó generar arte por escena en el piloto y el resultado fue calidad pareja pero
media — mejor invertir el mismo tiempo y créditos en UNA portada verdaderamente espectacular por
episodio que en varias imágenes buenas-pero-no-extraordinarias. Esa única ilustración:
- Representa el **momento más icónico** de toda la historia (el clímax, la decisión clave), no una
  escena cualquiera.
- Transmite la **emoción principal** del episodio de un vistazo.
- Composición cinematográfica de nivel póster — no una ilustración genérica.
- Mantiene identidad visual consistente con el resto de Lumo (paleta, personajes, iluminación).
- Se usa como portada en Explorar/Home Y como fondo fijo durante toda la reproducción del audio.

Ilustración por escena (o incluso animación) queda como evolución futura para cuando el producto
madure — no es el foco ahora. No rediseñar el pipeline para eso hasta que se pida explícitamente.

### Prompt maestro — la única identidad visual permitida (aprobado por el usuario, "cosa juzgada")

Este es el ÚNICO bloque de estilo que se usa para generar cualquier ilustración de Lumo. Nunca se
improvisan variantes por historia — cada historia solo agrega un bloque corto de 4 campos
(personajes, acción, escenario, emoción) al final de este texto, tal cual está, sin modificarlo:

```
Ilustración cinematográfica 3D de calidad de largometraje animado, con una dirección artística
cálida, emotiva y atemporal.

Personajes con proporciones humanas ligeramente estilizadas, anatomía consistente y expresiones
naturales. Los ojos deben ser proporcionados al rostro, con párpados bien definidos, poco blanco
visible alrededor del iris y pupilas de tamaño natural. La emoción debe transmitirse mediante la
expresión completa del rostro y la postura corporal, nunca mediante ojos exageradamente grandes o
expresiones permanentes de sorpresa.

Los personajes deben sentirse humanos, cercanos y llenos de vida. No caricaturescos, no
hiperrealistas y nunca con el aspecto plástico o genérico típico de imágenes generadas por IA.

La piel, el cabello, la barba, las telas y los materiales deben tener textura rica y natural. La
ropa debe presentar pliegues y desgaste coherentes con la época. El entorno debe sentirse vivo y
creíble.

La iluminación debe ser cinematográfica, con luz volumétrica, sombras suaves y una paleta cálida
dominada por tonos dorados, tierra y ámbar. La escena debe transmitir profundidad mediante un
primer plano, plano medio y fondo claramente diferenciados.

La composición debe contar una historia. Cada imagen debe parecer un fotograma de una película,
nunca un personaje posando para la cámara. La acción principal debe entenderse inmediatamente con
solo observar la ilustración.

La cámara debe utilizar un lenguaje cinematográfico (planos generales, medios o cercanos según la
emoción del momento), evitando encuadres rígidos o artificiales.

Las imágenes deben generarse en formato vertical nativo 9:16, compuestas específicamente para
dispositivos móviles, sin recortes posteriores.

Nunca generar:
- texto o tipografía;
- logotipos o marcas de agua;
- personajes mirando directamente a cámara sin motivo narrativo;
- ojos desproporcionados o expresiones exageradas;
- apariencia plástica o de juguete;
- fondos vacíos o sin profundidad;
- composiciones donde el rostro ocupe casi toda la imagen.
```

**Bloque por historia** (lo único que cambia entre ilustraciones): Personajes / Acción / Escenario /
Emoción. Ejemplo real (El Buen Samaritano):

> Personajes: el samaritano (barba oscura, turbante verde oliva, túnica color arena) y el viajero
> herido (joven, cabello oscuro, túnica desgastada con heridas visibles). Acción: el samaritano
> limpiándole el rostro con un paño. Escenario: camino rocoso entre Jerusalén y Jericó, atardecer,
> burro cargado cerca. Emoción: compasión.

Fuente única en código: `lib/story-style-guide.ts` (`STORY_STYLE_GUIDE`) y su copia inline en
`scripts/generate-hero-art.mjs` deben ser texto idéntico a este bloque — si se edita uno, se edita
el otro en la misma sesión.

**Test de diagnóstico obligatorio**: taparse mentalmente la boca del personaje en la imagen — si
solo con los ojos el personaje sigue pareciendo asustado o en shock, la ilustración no cumple el
estándar, sin importar el resto de la composición.

### Emoción dominante
Cada imagen transmite la emoción central del episodio, incluso sin leer el título:
David vs Goliat → valentía · El Buen Samaritano → compasión · Moisés → asombro · José → esperanza ·
La Resurrección → alegría.

### Consistencia de personajes
Todo personaje recurrente mantiene exactamente el mismo diseño en toda la app: rostro, edad,
proporciones, vestimenta, paleta, cabello, barba, accesorios. Se necesita una guía visual por
personaje recurrente antes de generar su segunda aparición (evita que "David" se vea distinto en
dos ilustraciones distintas).

### Aparición de Lumo en las ilustraciones
Lumo NO aparece en todas las ilustraciones — solo cuando forma parte real de la experiencia
narrativa (ej. el cierre reflexivo). Las historias bíblicas son las protagonistas visuales; Lumo
acompaña, nunca le roba protagonismo a la escena.

### Una sola ilustración por episodio (ver arriba)
La misma ilustración principal se usa como portada en Explorar/Home y como fondo fijo durante toda
la reproducción del audio — no hay ilustración distinta por escena por ahora (ver la decisión al
inicio de esta sección). Debe funcionar igual de bien en ambos contextos: genera curiosidad como
portada (tipo Disney+/Netflix, un niño quiere tocarla) Y sostiene visualmente toda la historia
mientras se reproduce.

### Checklist de aprobación de una ilustración
- [ ] Formato nativo vertical (`1024x1536`), no cuadrado recortado después.
- [ ] Sin ojos sobredimensionados ni expresión de sorpresa permanente — emoción vía cejas/mirada/
  boca/postura.
- [ ] Nunca un primer plano/retrato posando — muestra la acción principal con profundidad.
- [ ] Con solo ver la imagen, se entiende qué pasa en la escena, sin leer texto.
- [ ] Personaje recurrente coincide con su diseño ya establecido (rostro, ropa, paleta).
- [ ] Emoción dominante del episodio reconocible en la imagen.
- [ ] Ningún texto/letra/logo dentro de la imagen.

## 18. Validación de experiencia completa — el verdadero "gold standard"

Un episodio no se aprueba solo por su guion. El "gold standard" exige que estas 8 partes funcionen
juntas, no por separado:

1. **Guion** — checklist de la sección 16.
2. **Narración** — la voz real de Lumo, ritmo, pronunciación, emoción actuada (no un TTS plano).
3. **Ilustración principal** — una sola pieza espectacular por episodio, cumpliendo la sección 17.
4. **Música** — pista ambiental coherente con el mood, en volumen que nunca compite con la voz.
5. **Efectos de sonido** — presentes en los momentos clave, nunca decorativos de más.
6. **Subtítulos** — frases cortas sincronizadas de verdad con el audio real (no estimadas).
7. **Ritmo** — la experiencia completa (audio + imagen + música) respira, no se siente apurada ni
   plana.
8. **Experiencia de usuario** — navegación, transición entre escenas, pantalla de cierre (sección
   19) — todo se siente premium, no una demo técnica.

Ninguna de las 8 partes se aprueba de forma aislada. Un guion perfecto con ilustraciones genéricas
NO es un gold standard. Se revisa como si fuera el episodio que se presenta al mundo — si algo no
emociona, se vuelve a hacer, sin apuro.

## 19. Experiencia de cierre enriquecida

El episodio no termina cuando termina el audio de la última escena. Después del audio viene un
momento de cierre, no un botón de "Continuar" seco:

1. Referencia bíblica completa (libro, capítulo, versículos).
2. Breve reflexión (la voz/texto de Lumo conectando la historia con la vida del niño).
3. Pregunta de conversación en familia, visible en pantalla (no solo dicha en audio).
4. Invitación a leer el pasaje completo (link real, ya implementado).
5. Sugerencia de continuar con un episodio relacionado (misma serie o mismo valor/tema) — nunca
   forzado, siempre opcional.

## 20. Proceso de producción (orden obligatorio)

1. **Este documento** (Content Bible) — completo y aprobado. ✅ (este archivo)
2. **Episodio piloto ("gold standard")** — un solo episodio, con sus 8 partes (sección 18)
   iteradas hasta que sea prácticamente perfecto, ANTES de escribir ningún otro guion nuevo.
   Sin apuro — se prefiere invertir varios días en el piloto que producir rápido todo el catálogo.
3. **Producción por colecciones** (nunca todo el catálogo de una vez): Historias Bíblicas →
   Oraciones Guiadas → Devocionales → Meditaciones → Series Especiales. Cada colección se revisa y
   aprueba antes de pasar a la siguiente.
4. Las 16 piezas viejas (formato corto, pre-Content-Bible) se reescriben contra este estándar antes
   o durante el lote de su propia colección — no se generan en su formato viejo nunca más.

Lumo se piensa como un estudio de animación y producción de contenido, no como un equipo que
desarrolla una app. El producto principal no es la aplicación — son las historias y experiencias
que viven las familias. La app es solo el vehículo.

## 21. Ficha de producción de referencia — "El Buen Samaritano" (episodio gold standard)

Primer episodio producido con las 8 partes completas (sección 18). Estos son los parámetros
EXACTOS usados — se convierten en el estándar por defecto para todo episodio futuro. Cambiar
cualquiera de estos valores es una decisión nueva, no un ajuste silencioso.

**Guion**: `lib/content-catalog.ts`, id `buen-samaritano`. 7 segmentos (6 narración + 1 cierre de
Lumo), 4,696 caracteres, ~6.2 min. Ver secciones 1-11 de este documento para las reglas de
escritura ya aplicadas acá.

**Narración (voz)**:
- Proveedor: ElevenLabs, vía `scripts/audio-providers/elevenlabs.mjs` (abstracción `AudioProvider`,
  ver sección 15 y `scripts/generate-content-audio.mjs`).
- Modelo: `eleven_multilingual_v2`.
- Voice ID: `UV1PvCsFzKWpDz8VJiDc` (voz oficial de Lumo, creada con Voice Design — femenina, cálida,
  narración infantil).
- `voice_settings`: `stability: 0.5`, `similarity_boost: 0.75`.
- Costo real confirmado: 1 carácter = 1 crédito exacto (sin multiplicador), endpoint
  `/v1/text-to-speech/{voice_id}/with-timestamps` (mismo precio que sin timestamps).
- Archivos: `public/lumo-audio/buen-samaritano-{0..6}.mp3`. Registro: `data/content-audio.json`.

**Subtítulos (sincronización)**:
- Se agrupan caracteres con marca de tiempo en palabras, y palabras en "cues" cortas: corte al
  llegar a ≥22 caracteres si la palabra termina en puntuación de cláusula (`. , ; — ! ? …`), o
  forzado a los ≥45 caracteres. Nunca el guion completo de una vez (ver sección 14).
- Implementación: `buildCues()` en `scripts/audio-providers/elevenlabs.mjs`. Consumo en
  `app/reproducir/[id]/page.tsx` vía `onTimeUpdate` + `cueText`.

**Ilustración principal**:
- Un solo prompt maestro fijo (sección 17) + bloque de 4 campos (Personajes/Acción/Escenario/
  Emoción) específico de esta historia.
- Modelo: `gpt-image-1`, tamaño `1024x1536` (vertical nativo), calidad `medium`.
- Script: `scripts/generate-hero-art.mjs`. Archivo: `public/lumo-art/story-buen-samaritano.png`.
  Registro: `data/landing-assets.json`.
- Nota: esta pieza específica fue generada con `personajes`/`accion`/`escenario`/`emocion` =
  el samaritano y el viajero herido / vendándole el brazo / camino rocoso Jerusalén-Jericó al
  atardecer, burro cerca / compasión.

**Música (biblioteca reutilizable por mood)**:
- Script: `scripts/generate-music-library.mjs`. Endpoint: `POST /v1/music` de ElevenLabs.
  `music_length_ms: 30000` (pistas de 30s, loopeables).
- Prompt base compartido (aplicado a las 6): *"Instrumental ambient background music for a warm,
  gentle Christian family storytelling app for children. No lyrics, no vocals, no percussion
  drums, loopable, cinematic but understated — must sit quietly behind spoken narration, never
  compete with a voice."* + una línea de mood específico (ver el diccionario `MOODS` en el script
  para las 6 variantes: family/book/prayer/diary/night/threshold).
- Archivos: `public/lumo-music/{mood}.mp3`. Registro: `data/audio-library.json` → `music`.
- Mezcla: `loop = true`, **volumen 0.15** (constante `MUSIC_VOLUME` en
  `app/reproducir/[id]/page.tsx`), cambia de pista automáticamente cuando cambia el `mood` de la
  escena activa.

**Efectos de sonido (biblioteca reutilizable)**:
- Script: `scripts/generate-sfx-library.mjs`. Endpoint: `POST /v1/sound-generation` de ElevenLabs,
  con `duration_seconds` explícito por efecto (2-4s cada uno en este lote).
- Generados para este episodio: `pasos-camino-rocoso`, `viento-desierto`, `burro-resoplido`,
  `tela-vendaje`, `monedas` (prompts exactos en el script). Usados en el guion: `viento-desierto`
  en el segmento del camino vacío tras el ataque, `tela-vendaje` en el segmento del samaritano
  vendando al herido — 2 momentos clave, no decoración constante (sección 13).
- Archivos: `public/lumo-sfx/{nombre}.mp3`. Registro: `data/audio-library.json` → `sfx`.
- Mezcla: un solo disparo por segmento (no loop), **volumen 0.45** (constante `SFX_VOLUME`),
  vinculado por el campo opcional `sfx?: string` en `ContentSegment` (`lib/content-catalog.ts`).

**Niveles de mezcla (resumen)**: narración ≈ 1.0 (dominante, sin normalizar) · música 0.15 (fondo,
nunca compite) · efectos 0.45 (puntuales, audibles pero breves).

**Pantalla de cierre**: referencia bíblica completa + línea de invitación a leer + reflexión de
Lumo + pregunta de conversación visible + sugerencia de episodio relacionado (mismo `seriesId`,
con fallback a tags compartidas) — sección 19, implementado en `app/reproducir/[id]/page.tsx`.

**Arquitectura de proveedor**: todo lo de audio (voz, música, SFX) pasa por scripts independientes
que hablan directo con la API elegida — el día que se cambie de proveedor de voz, solo cambia
`scripts/audio-providers/` (ver sección 15); música/SFX hoy están acoplados a ElevenLabs
directamente en sus scripts (no tienen todavía su propia capa `AudioProvider` — extensión futura
si se cambia de proveedor de música/SFX).

## 22. Catálogo fundacional de lanzamiento (reemplaza la meta de 150 episodios por ahora)

**Regla vigente**: los ~150 episodios siguen siendo la visión de largo plazo, pero NO son el
objetivo de esta etapa. El objetivo es una colección pequeña, coherente y premium para lanzar la
primera versión pública. No se retoma la meta de 150 hasta después del lanzamiento.

### Tamaño del catálogo y justificación

| Tipo | Cantidad | Por qué este número |
|---|---|---|
| Historias Bíblicas | **10** | Las 9 ya escritas (Antiguo:6/Nuevo:3, personajes:6, milagros:2, valores:7) cubren bien la mayoría de categorías de Explorar, **excepto "Mujeres de la Biblia"**, que hoy solo tiene a Ester — una sola historia hace que esa categoría se sienta vacía. Se agrega 1 historia nueva (Rut, ya registrada en `content-library.ts` como serie con `targetEpisodes: 1`) para que las 6 categorías de Explorar tengan al menos 2 historias cada una. |
| Oraciones Guiadas | **8** | Ya escritas completas (situacionales: dormir, despertar, gratitud, miedo, tristeza, examen, familia, comer) — cubren de punta a punta un día normal de un niño. Ampliar a 10 ahora sería agregar situaciones marginales sin necesidad real; mejor invertir esos créditos en Historias. |
| Devocionales | **6** | De los 12 valores planeados a largo plazo (`content-library.ts`), se eligen los 6 más centrales para una familia cristiana empezando: Amor, Fe, Esperanza, Gratitud, Perdón, Valentía. Los otros 6 (Generosidad, Humildad, Paciencia, Bondad, Honestidad, Obediencia) quedan para la próxima ampliación. 1 episodio por valor (no 2) para el lanzamiento. |
| Meditaciones | **5** | De las 7 planeadas, se priorizan las 5 más conectadas al uso real de la app (ritual nocturno): Dormir tranquilo, Calmar la ansiedad, Respirar, Confiar en Dios, Encontrar paz. Descansar y Silencio quedan para después (se superponen con Dormir tranquilo). |
| **Total** | **29 episodios** | Biblioteca chica pero sin huecos — cada colección y cada categoría de Explorar tiene contenido real, nada se siente vacío. |

### Costo real (tarifa calibrada: 1 crédito = 1 carácter, ver sección 21)

| Tipo | Créditos/episodio | Cantidad | Subtotal |
|---|---|---|---|
| Historia corta | ~5,300 | 5 | 26,500 |
| Historia estándar | ~7,600 | 4 | 30,400 |
| Historia épica | ~12,150 | 1 | 12,150 |
| Oración guiada | ~3,800 | 8 | 30,400 |
| Devocional | ~4,900 | 6 | 29,400 |
| Meditación | ~3,400 | 5 | 17,000 |
| SFX nuevos (biblioteca ampliada, ~10 efectos) | ~150 c/u | 10 | 1,500 |
| **Total producción** | | | **147,350** |
| Reserva de correcciones/regrabación (20%) | | | 29,470 |
| Reserva de experimentación (voces/música nuevas) | | | 10,000 |
| **TOTAL con reservas** | | | **186,820** |

*(Música: no suma costo extra — la biblioteca de 6 pistas por mood ya existe y se reutiliza.)*

### Plan de créditos (121,000/mes disponibles)

- **Costo de un episodio completo**: entre ~3,400 (meditación corta) y ~12,150 (historia épica) créditos, según tipo y duración — ver tabla de la sección 6.
- **Episodios posibles este mes sin comprometer calidad**: repartiendo el total (186,820) en **2 meses** → **~93,410 créditos/mes**, dejando **~27,590/mes sin usar** (23% de margen) — nunca se gasta el 100% solo porque está disponible.
- **Reserva de regrabación**: 20% del costo de producción (29,470 créditos) — para cuando un episodio no cumpla el checklist de la sección 16/18 y haya que rehacerlo, sin que eso implique recortar el resto del plan.
- **Reserva de experimentación**: 10,000 créditos aparte, para probar cosas nuevas (otra voz, otro estilo de música, ajustes de mezcla) sin tocar el presupuesto de producción del catálogo.

**Orden sugerido** (impacto primero, no dificultad):
1. **Mes 1**: las 8 Oraciones (desbloquea por completo la pantalla Orar, que hoy es solo texto) +
   las historias que faltan para que ninguna categoría de Explorar quede vacía (Rut, y las
   historias "cortas" restantes).
2. **Mes 2**: el resto de Historias (estándar/épica) + los 6 Devocionales + las 5 Meditaciones.

Este orden es una sugerencia, no una obligación — se ajusta según qué fase de pantallas (Fase 3
Home, Fase 4 Explore, Fase 5 Prayer) esté en curso en el `ROADMAP.md`, ya que el contenido debe
estar listo cuando la pantalla que lo consume se trabaje.

---

*Última actualización: 2026-07-19. Cambios a este documento son decisiones "cosa juzgada" — se
registran acá y en ESTADO.md, no se reabren sin pedido explícito del usuario.*
