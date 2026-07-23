# LUMO — Master Prompt System
## Motor de generación de prompts — no redefine reglas, las ejecuta

> Este documento es únicamente el motor de generación de prompts. Las reglas, números,
> filosofía y estándares de calidad viven en `CLAUDE.md` — acá solo se traducen a inglés
> listo-para-pegar. Si un número o una regla no está en `CLAUDE.md`, no se inventa acá.
>
> **Si algo de este documento contradice a `CLAUDE.md`, `CLAUDE.md` tiene precedencia** —
> corregir este archivo, no al revés.

---

## ANATOMÍA DEL SISTEMA

```
PROMPT FINAL = [MASTER BLOCK] + {{CHARACTER}} + {{SCENE}} + {{EMOTION}} + {{LIGHTING}} + {{FORMAT}}
```

Cada imagen del proyecto se genera completando esas 5 variables.
El MASTER BLOCK garantiza que todas las imágenes pertenezcan al mismo mundo visual.

---

## MASTER BLOCK
### Copiar exactamente. Nunca modificar.

```
3D cartoon render, Pixar animation studio quality,
soft volumetric lighting, no cel-shading, no flat illustration, no 2D cartoon,
subsurface scattering on organic surfaces,
heroic cartoon proportions: head is 35-40% of total body height,
rounded compact body, no sharp angular shapes,
all characters have large expressive eyes with visible white catchlight,
warm rim light separating every subject from the background,
background is subordinate to subject: maximum 3 contextual elements,
background slightly out of focus, most saturated color belongs to subject not background,
8k render quality, high detail facial features,
cinematic color grading, soft shadows, no hard edges,
photorealistic texture quality within cartoon proportions,
award-winning children's animation aesthetic
```

*(Las proporciones y reglas de fondo de este bloque son la traducción directa de
`CLAUDE.md` §2.1 y §4.3 — si esos números cambian, este bloque se actualiza para que
coincida, nunca al revés.)*

---

## LAS 5 VARIABLES

### {{CHARACTER}}
*Quién está en la escena y sus rasgos físicos permanentes.*

**Regla:** Describe al personaje desde cero en cada prompt. No asumir que el modelo recuerda
sesiones anteriores. Índice y fichas completas de cada personaje: `characters/REGISTRY.md`
(template y reglas generales: `CLAUDE.md` §5).

**Bloque de Lumo (copiar cuando Lumo esté en escena — traducción directa de `characters/lumo.md`):**

```
Lumo, a small cartoon firefly character,
oversized expressive eyes with double catchlight
(white specular highlight plus warm golden reflection from own bioluminescence),
dark forest-green compact rounded body,
glowing bioluminescent abdomen emitting warm golden light (#FFD740),
short rounded antennae with small golden ball tips,
two pairs of translucent iridescent wings
with subtle blue-green-lavender shimmer,
Lumo's bioluminescent glow casts warm golden color bleeding
on any nearby surfaces and characters
```

**Para personajes secundarios:** crear primero su Character Card en `characters/[slug].md`
(template en `CLAUDE.md` §5.1, registrarlo en `characters/REGISTRY.md`), luego traducir esa
ficha a un bloque equivalente:

```
[nombre], a [especie/tipo] cartoon character,
[rasgo físico 1], [rasgo físico 2], [descriptor icónico],
[paleta de cuerpo en inglés]
```

---

### {{SCENE}}
*Dónde ocurre la imagen y cuáles son los 2–3 elementos de contexto (máximo, según CLAUDE.md §4.3).*

| Escena | Descripción para prompt |
|---|---|
| Bosque nocturno | `a magical night forest, ancient glowing mushrooms, fireflies in distance, deep blue-indigo atmosphere` |
| Pradera de día | `a warm sunlit meadow, tall golden grass, soft clouds, bright Mediterranean light` |
| Cueva misteriosa | `a mysterious cave with crystal formations, faint blue bioluminescent moss, deep shadows` |
| Aldea / pueblo | `a charming miniature village at dusk, warm lantern lights, cobblestone paths` |
| Cielo / vuelo | `an open twilight sky, gradient from deep blue to amber horizon, distant stars appearing` |
| Interior acogedor | `a cozy hollow inside an ancient tree, warm candlelight, dry leaves and seeds as furniture` |

---

### {{EMOTION}}
*Qué expresa el personaje. Los 5 registros y cuándo usar cada uno están en `CLAUDE.md` §2.4
— acá solo la traducción a inglés lista para pegar.*

| Registro | Descripción para prompt |
|---|---|
| **Curiosidad** | `head tilted 15 degrees, one antenna higher than the other, eyes wide open with wonder, soft gentle smile, leaning slightly forward` |
| **Alegría / Triunfo** | `big open smile showing joy, eyes curved upward in celebration, wings slightly spread in excitement, body upright and confident` |
| **Asombro / Maravilla** | `eyes extremely wide (maximum size), mouth slightly open, both antennae pointing forward, body frozen in awe, pupils dilated` |
| **Determinación** | `focused forward gaze, slight squint, antennae pointing straight ahead, body leaning into direction of movement, confident posture` |
| **Miedo / Tensión** | `eyes wide with fear (whites visible), antennae pressed back, body hunched and small, wings tight against body, trembling posture` |

---

### {{LIGHTING}}
*Paleta de iluminación según el tono emocional. Los tonos y colores hex base están en
`CLAUDE.md` §3.2 — acá la versión larga lista para pegar.*

| Tono | Bloque para prompt |
|---|---|
| **Magia nocturna** *(escena más poderosa de Lumo)* | `Lumo's bioluminescent abdomen is the primary light source, warm golden key light from below-center, deep blue-indigo ambient fill, golden rim light from own glow, volumetric light rays from abdomen, floating golden light particles in air` |
| **Esperanza / alegría** | `warm golden hour key light from upper-left, soft blue sky fill light, bright warm rim light, hopeful glowing atmosphere, golden color grading` |
| **Aventura / exterior** | `bright Mediterranean sunlight key light, blue sky fill, crisp white rim light, vibrant saturated colors, adventure atmosphere` |
| **Paz / reflexión** | `soft diffused white key light, very gentle green fill, warm white rim light, serene calm atmosphere, gentle color grading` |
| **Misterio / noche** | `cool blue-violet key light from side, deep indigo fill, moonlight rim light, mysterious atmosphere, low contrast shadows` |
| **Peligro / tensión** | `harsh amber-orange side key light, dark purple fill, intense orange rim light, dramatic high-contrast lighting, tense atmosphere` |

---

### {{FORMAT}}
*Composición según el uso en la app. Los % de ocupación oficiales están en `CLAUDE.md` §4.1
— estos bloques ya los incluyen ensamblados.*

| Formato | Uso | Bloque para prompt |
|---|---|---|
| **HERO** | Banner principal, pantalla completa | `cinematic wide composition, subject positioned center or center-right, fills 55% of frame, detailed background with depth of field, lower third has visual space for text overlay gradient, dramatic cinematic framing, 16:9 or 4:3 aspect` |
| **THUMB_PORTRAIT** | Cards de historia, 3:4 | `portrait composition 3:4 ratio, subject fills 60% of frame, simple background with 2-3 elements, subject in dynamic pose or action, lower third clear for text overlay, shallow depth of field background` |
| **THUMB_SQUARE** | Cards secundarias, 1:1 | `square composition 1:1 ratio, subject fills 55% of frame, centered composition, background condensed to essential elements, balanced framing` |
| **CIRCLE_PORTRAIT** | Avatar de personaje en UI | `circular portrait composition, head and upper body only, subject looking slightly toward camera or in 3/4 view, face fills 70% of circle area, neutral or atmospheric background, no need for text overlay space, intimate portrait framing` |
| **SPLASH** | Onboarding, pantallas de entrada | `full screen vertical composition 9:16, subject large and centered, rich detailed background, magical atmosphere, space at top for title text, space at bottom for CTA button, epic establishing shot feel` |

---

## FÓRMULA DE ENSAMBLAJE

```
PROMPT FINAL:

[MASTER BLOCK]
+ CHARACTER: [bloque del personaje]
+ SCENE: [descripción de la escena, máx 3 elementos]
+ EMOTION: [bloque de emoción elegido]
+ LIGHTING: [bloque de iluminación elegido]
+ FORMAT: [bloque de formato elegido]
```

**Instrucción de orden:** Pegar los bloques en ese orden. El modelo de imagen lee de izquierda
a derecha con peso decreciente. El MASTER BLOCK al inicio establece el estilo base antes de
cualquier instrucción específica.

---

## EJEMPLO COMPLETO — Circle Portrait de Lumo

*Primer prompt de producción del proyecto. Usar como seed y referencia.*

Variables elegidas: CHARACTER=Lumo · SCENE=twilight sky · EMOTION=Curiosidad ·
LIGHTING=Magia nocturna · FORMAT=Circle Portrait.

```
3D cartoon render, Pixar animation studio quality,
soft volumetric lighting, no cel-shading, no flat illustration, no 2D cartoon,
subsurface scattering on organic surfaces,
heroic cartoon proportions: head is 35-40% of total body height,
rounded compact body, no sharp angular shapes,
all characters have large expressive eyes with visible white catchlight,
warm rim light separating every subject from the background,
background is subordinate to subject: maximum 3 contextual elements,
background slightly out of focus, most saturated color belongs to subject not background,
8k render quality, high detail facial features,
cinematic color grading, soft shadows, no hard edges,
photorealistic texture quality within cartoon proportions,
award-winning children's animation aesthetic,

Lumo, a small cartoon firefly character,
oversized expressive eyes with double catchlight
(white specular highlight plus warm golden reflection from own bioluminescence),
dark forest-green compact rounded body,
glowing bioluminescent abdomen emitting warm golden light (#FFD740),
short rounded antennae with small golden ball tips,
two pairs of translucent iridescent wings
with subtle blue-green-lavender shimmer,
Lumo's bioluminescent glow casts warm golden color bleeding
on any nearby surfaces and characters,

deep twilight sky background, gradient from blue to dark indigo,
first stars appearing, soft atmospheric haze,

head tilted 15 degrees, one antenna higher than the other,
eyes wide open with wonder, soft gentle smile, leaning slightly forward,

Lumo's bioluminescent abdomen is the primary light source,
warm golden key light from below-center,
deep blue-indigo ambient fill,
golden rim light from own glow,
volumetric light rays from abdomen,
floating golden light particles in air,

circular portrait composition,
head and upper body only,
subject looking slightly toward camera in 3/4 view,
face fills 70% of circle area,
neutral atmospheric background,
intimate portrait framing
```

---

## CHECKLIST

El checklist de calidad completo (incluidos los ítems específicos de Lumo) vive en
`CLAUDE.md` §10 — se corre ahí, no acá, para no mantener dos listas.

---

## CONTROL DE VERSIONES DE ESTE DOCUMENTO

| Versión | Cambio | Fecha |
|---|---|---|
| 1.0 | Creación inicial — Master Block + 5 variables + ejemplo Circle Portrait | Jul 2026 |
| 1.1 | Refactor: se quitaron números y reglas duplicadas con `CLAUDE.md` (proporciones, % de ocupación, checklist); `{{FORMAT}}` actualizado a los porcentajes oficiales (Hero 55 / Thumbnail 60 / Card 55 / Circle 70) | 2026-07-22 |

> Cuando se apruebe una imagen como referencia oficial, agregar el ID/seed acá para
> garantizar consistencia futura.

## REFERENCIAS OFICIALES APROBADAS (Golden Masters)

| Personaje | Formato | Archivo | Detalle de reproducibilidad |
|---|---|---|---|
| Lumo | Circle Portrait | `public/lumo-art/lumo_circle_default_200.webp` | Ver `characters/lumo.md` § Golden Master (2026-07-22) |
| David | Circle Portrait | `public/lumo-art/david_circle_default_200.webp` | Ver `characters/david.md` |
| Goliat | Circle Portrait | `public/lumo-art/goliat_circle_default_200.webp` | Ver `characters/goliat.md` |
| Noé | Circle Portrait | `public/lumo-art/noe_circle_default_200.webp` | Ver `characters/noe.md` |
| El buen samaritano | Circle Portrait | `public/lumo-art/buen-samaritano_circle_default_200.webp` | Ver `characters/buen-samaritano.md` |
| Moisés | Circle Portrait | `public/lumo-art/moises_circle_default_200.webp` | Ver `characters/moises.md` |
| El hijo pródigo | Circle Portrait | `public/lumo-art/hijo-prodigo_circle_default_200.webp` | Ver `characters/hijo-prodigo.md` |
| El padre (pródigo) | Circle Portrait | `public/lumo-art/padre-prodigo_circle_default_200.webp` | Ver `characters/padre-prodigo.md` (2 iteraciones) |
| Daniel | Circle Portrait | `public/lumo-art/daniel_circle_default_200.webp` | Ver `characters/daniel.md` |
| Jesús | Circle Portrait | `public/lumo-art/jesus_circle_default_200.webp` | Ver `characters/jesus.md` |
| José | Circle Portrait | `public/lumo-art/jose_circle_default_200.webp` | Ver `characters/jose.md` |
| Ester | Circle Portrait | `public/lumo-art/ester_circle_default_200.webp` | Ver `characters/ester.md` |

---

*Este documento vive junto a `CLAUDE.md` en la raíz del proyecto. `CLAUDE.md` tiene
precedencia si algo contradice.*
