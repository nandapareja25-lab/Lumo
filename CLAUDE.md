# CLAUDE.md — LUMO
## Guía de Dirección de Arte y Sistema Visual

> Este archivo define las reglas de arte, generación de imágenes y consistencia visual
> del proyecto. Léelo completo al inicio de cada sesión antes de generar cualquier imagen,
> prompt, componente visual o código relacionado con la interfaz.
>
> **Reemplaza a `ART-BIBLE.md` y `VISUAL-QA-GUIDE.md` como referencia oficial** (2026-07-22).
> Esos dos documentos quedan como historial de cómo llegamos hasta acá, no como estándar vigente.
>
> **Este archivo es la única fuente de verdad** para reglas, números, filosofía y estándares
> de calidad. `MASTER-PROMPT-SYSTEM.md` es el motor de generación de prompts — traduce estas
> reglas a inglés listo-para-pegar, pero nunca las redefine. Si algo parece contradictorio
> entre los dos documentos, este archivo gana siempre.

---

## 1. IDENTIDAD VISUAL — RESUMEN EJECUTIVO

El estilo visual de esta app es **3D cartoon render de calidad cinematográfica**.
Referentes técnicos (no copiar, usar como vocabulario de producción):
- Proporciones: Pixar / DreamWorks Animation
- Render: Iluminación volumétrica suave, subsurface scattering en piel
- Tono emocional: cálido, esperanzador, dramático según la historia
- Audiencia: niños 4–12 años + padres que aprueban el contenido

**Regla maestra:** Cada imagen debe funcionar a dos tamaños simultáneamente:
- Hero (pantalla completa, 780×520px — ver §8.1): alta complejidad, fondo detallado
- Thumbnail (card pequeña, 300×400px — ver §8.1): el personaje principal sigue siendo legible

> Estos son los únicos tamaños oficiales de Hero/Thumbnail — §8.1 los detalla con su versión
> 2x. No usar ningún otro valor en ningún otro lugar del proyecto.

---

## 2. SISTEMA DE PERSONAJES

### 2.1 Proporciones — Reglas numéricas

| Elemento | Proporción objetivo | Nunca menos de |
|---|---|---|
| Cabeza / altura total | 35–40% | 30% |
| Ojos / área facial | 40–50% | 35% |
| Cuerpo | Compacto y robusto | — |
| Extremidades | Cortas, redondeadas | — |

**Ratio de cabeza:** heroico-cartoon, no anatómico. Cuerpo de 4–5 cabezas de altura (vs 7–8 del adulto real).

### 2.2 Ojos — Regla crítica

Los ojos son el elemento más importante de cada personaje. Siempre incluir:
- **Iris grande**, que ocupe al menos el 60% del área del ojo
- **Catchlight:** punto blanco de luz especular. Obligatorio. Visible incluso a 40px.
- **Highlight secundario:** reflejo suave en la parte inferior del iris (opcional pero recomendado)
- Sin catchlight = personaje sin vida. Si la imagen no tiene catchlight, regenerar.

### 2.3 El Silhouette Test — Obligatorio para todo personaje

Antes de aprobar cualquier diseño de personaje, aplicar el test:
> "¿Si convierto esta imagen a blanco sobre negro, reconozco al personaje?"

Un personaje aprueba el silhouette test cuando tiene un **descriptor icónico**: un elemento
de vestuario, accesorio, o característica física que lo hace único en silueta.

Ejemplos de descriptores icónicos:
- Tocado elaborado / corona / casco con pluma
- Barba muy específica (forma, tamaño)
- Objeto que porta siempre (bastón, instrumento, libro)
- Ropa de color muy saturado único a ese personaje

**Si un personaje no tiene descriptor icónico, crear uno antes de generar imágenes.**

### 2.4 Expresiones — Sistema de 5 registros

Cada escena requiere una expresión del personaje. Usar siempre uno de estos 5 registros:

| Registro | Cuándo usarlo |
|---|---|
| **Alegría / Triunfo** | Resolución de conflicto, celebración |
| **Asombro / Maravilla** | Descubrimiento, milagros, momentos mágicos |
| **Miedo / Tensión** | Peligro, desafío, momento de prueba |
| **Determinación** | Momento de decisión, valentía |
| **Curiosidad** | Exploración, aprendizaje |

Las expresiones deben ser **exageradas al 130–150% del realismo**. En tamaño thumbnail
una expresión sutil desaparece. Si la expresión no se lee a 100px, es demasiado sutil.

> Las keywords en inglés para cada registro viven en `MASTER-PROMPT-SYSTEM.md` §`{{EMOTION}}`
> — no se repiten acá para evitar que las dos versiones se desalineen con el tiempo.

---

## 3. SISTEMA DE ILUMINACIÓN

### 3.1 Esquema de tres luces (estándar)

Todo render de personaje usa este esquema base:

```
KEY LIGHT:    Principal. Cálido (amarillo-ámbar). 45° desde arriba-adelante.
              Intensidad: alta. Define la forma principal.

FILL LIGHT:   Secundaria. Fría (azul muy suave). Lado opuesto al key.
              Intensidad: baja (20–30% del key). Evita sombras duras.

RIM LIGHT:    Contraluz. Mismo tono que el key o ligeramente más saturado.
              Intensidad: media. Separa el personaje del fondo. OBLIGATORIO.
```

El rim light es el elemento que más contribuye a la calidad percibida del render.
Sin rim light, el personaje "se pega" al fondo. Siempre incluirlo en los prompts.

### 3.2 Paleta de iluminación por tono emocional de escena

| Tono de escena | Key light | Fill light | Rim light |
|---|---|---|---|
| Esperanza / alegría | Amarillo cálido #FFD080 | Azul cielo #C8E8FF | Dorado #FFB840 |
| Peligro / tensión | Naranja ámbar #FF7820 | Morado oscuro #280840 | Naranja intenso #FF5500 |
| Paz / reflexión | Blanco suave #FFF8E8 | Verde muy suave #C8F0D8 | Blanco cálido #FFECC8 |
| Aventura / exterior | Luz solar #FFE060 | Azul cielo #90C8FF | Cian brillante #60D0FF |
| Misterio / noche | Azul profundo #102040 | Índigo #201060 | Luna plateada #C0D8FF |

> Las keywords en inglés para cada tono viven en `MASTER-PROMPT-SYSTEM.md` §`{{LIGHTING}}` —
> los hex de acá son la fuente numérica; el inglés listo-para-pegar no se repite.

---

## 4. SISTEMA DE COMPOSICIÓN

### 4.1 Regla de protagonismo

| Tamaño de presentación | Área del personaje |
|---|---|
| Hero (pantalla completa) | 55% del frame |
| Thumbnail portrait (3:4) | 60% del frame |
| Card cuadrada (1:1) | 55% del frame |
| Circle portrait (1:1 crop) | 70% del frame (solo cabeza + hombros) |

> **Valores oficiales (2026-07-22)** — única fuente de verdad para estos cuatro números.
> Regla general: cuanto más chico y repetido es el formato, mayor la ocupación necesaria
> para que la prueba de miniatura siga funcionando.

**El personaje nunca compite con el fondo. Si el fondo es tan interesante como el personaje,
el fondo está mal.**

### 4.2 Zona de texto — Regla de composición

Para thumbnails y cards donde habrá texto superpuesto, el tercio inferior queda libre de
elementos narrativos importantes; el gradient oscuro va ahí, de transparente a negro 75%.

### 4.3 Fondo — Regla de subordinación

1. **Señales mínimas de contexto:** 2–3 elementos son suficientes.
2. **Desenfoque progresivo:** el fondo ligeramente desenfocado respecto al personaje.
3. **No más de 3 colores dominantes en el fondo.**
4. **El color más saturado de la escena debe estar en el personaje, no en el fondo.**

---

## 5. SISTEMA DE COLOR POR PERSONAJE

> **Las Character Cards viven en `characters/`, no acá.** Este archivo define solo el
> template (§5.1) y las reglas (§5.2/§5.3) — así `CLAUDE.md` no crece con cada personaje
> nuevo. Índice completo y colores reservados: `characters/REGISTRY.md`.

### 5.0 Lumo (personaje principal)

Ficha completa en `characters/lumo.md`. Slug: `lumo`. Color de acento: `#FFD740`.

### 5.1 Character Card Format

Antes de generar cualquier imagen de un personaje nuevo:
1. Elegir un slug único (ver convención en §5.3) y verificarlo contra `characters/REGISTRY.md`.
2. Crear `characters/[slug].md` con este template.
3. Agregar la fila correspondiente en `characters/REGISTRY.md`.

```markdown
# Character Card: [NOMBRE]

**Slug:** `[slug-kebab-case]`
**Color de acento:** `#______`

### Descriptor icónico
[Accesorio / vestuario / característica que lo hace reconocible en silueta]

### Paleta de vestuario
- Color primario: #______
- Color secundario: #______
- Color de acento: #______

### Expresión default (cuando no hay contexto específico)
[Uno de los 5 registros del §2.4]

### Seed / referencia de consistencia
[ID de imagen de referencia o descripción física detallada]

### Nunca
- [Lista de elementos que este personaje NUNCA debe tener]
```

### 5.2 Regla del color de acento

Cada personaje tiene un color de acento único y fijo, usado en el ring del círculo de
personaje en la UI, el badge de identificación, y los highlights de vestuario. Nunca cambia
entre historias. Verificar unicidad contra `characters/REGISTRY.md` antes de asignar uno nuevo.

### 5.3 Convención de slug e identidad

- Cada personaje tiene un **slug** único y estable (minúsculas, kebab-case, sin acentos —
  ej. `moises`, `david`, `buen-samaritano`) que no cambia aunque cambie su nombre visible.
  Es el identificador que conecta su Character Card, su color en `REGISTRY.md`, y los
  nombres de archivo de sus ilustraciones (§8.2).

---

## 6. GENERACIÓN DE PROMPTS

Toda la mecánica de armar un prompt (bloque base, variables, templates por formato, qué
incluir/excluir siempre) vive en **`MASTER-PROMPT-SYSTEM.md`**. Este archivo no define
templates de prompt — define las reglas y números que ese sistema debe respetar.

Lista de qué NUNCA incluir en ningún prompt (política, no texto de prompt):
- Nombres de personajes con copyright.
- Nombres de artistas reales o de un estudio específico como estilo a imitar.
- Referencias a fotorrealismo, anime, o ilustración plana 2D.

---

## 7. SISTEMA DE ESCENAS — COMPOSICIÓN NARRATIVA

### 7.1 Regla del conflicto visible

1. ¿Se puede identificar al protagonista en menos de 2 segundos?
2. ¿La expresión comunica la emoción dominante de la historia?
3. ¿Si hay antagonista, se ve la diferencia de poder/tamaño?
4. ¿El tono de color del fondo refuerza la emoción de la escena?

### 7.2 Regla del momento de máxima tensión

Siempre ilustrar el **momento de mayor tensión**, no el desenlace.

---

## 8. ESPECIFICACIONES TÉCNICAS DE OUTPUT

### 8.1 Tamaños de exportación

| Uso | Dimensiones | Formato | Calidad |
|---|---|---|---|
| Hero / banner | 780×520px (2x: 1560×1040) | WebP | 90% |
| Thumbnail portrait | 300×400px (2x: 600×800) | WebP | 85% |
| Card cuadrada | 300×300px (2x: 600×600) | WebP | 85% |
| Circle portrait | 200×200px (2x: 400×400) | WebP | 85% |
| Splash / onboarding | 390×844px (2x: 780×1688) | WebP | 92% |

> Aplica a partir de ahora para ilustraciones nuevas. Los archivos PNG ya existentes en
> `public/lumo-art/` no se renombran retroactivamente — ver nota de migración al final.

### 8.2 Nomenclatura de archivos (a partir de ahora)

```
[personaje-slug]_[tipo]_[escena-slug]_[tamaño].webp

moises_hero_burning-bush_780x520.webp
david_thumb_goliath-fight_300x400.webp
jesus_circle_default_200x200.webp
```

- **`[personaje-slug]`**: el slug oficial del personaje (§5.3, único en `characters/REGISTRY.md`)
  — nunca el nombre visible ni una variante libre.
- **`[escena-slug]`**: minúsculas, kebab-case, máximo 4 palabras, sin palabras vacías
  (artículos/preposiciones). Una vez elegido para una escena, no cambia — evita que la misma
  escena termine con nombres distintos entre iteraciones (`burning-bush`, nunca
  `burning_bush` ni `the-burning-bush-scene`).

### 8.3 Gradient overlay (implementación en código, no horneado en la imagen)

```css
.story-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 45%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.75) 100%);
  border-radius: 0 0 12px 12px;
}
```

---

## 9. SISTEMA DE UI — COLORES Y TOKENS

### 9.1 Paleta de la UI (independiente de las ilustraciones)

```
BACKGROUND PRINCIPAL:  #FAF3EE  (crema cálido — NUNCA blanco puro #FFFFFF)
SURFACE / CARDS:       #FFFFFF  (blanco solo en cards, no en backgrounds)
TEXTO PRIMARIO:        #1A1410  (casi negro cálido, nunca negro puro)
TEXTO SECUNDARIO:      #6B5B52  (gris cálido)
TEXTO MUTED:           #A89288  (para labels, captions)

ACENTO PRIMARIO:       #E8A33D  (dorado Lumo — ya en uso, se mantiene)
ACENTO SECUNDARIO:     #B8791F  (dorado oscuro para texto sobre claro — ya en uso)
```

> **Regla:** el background crema `#FAF3EE` se usa en TODAS las pantallas de navegación
> (reemplaza a `#FAFAF8`, usado hasta el 2026-07-22). Las ilustraciones traen su propio
> color. La UI nunca compite.

### 9.2 Border radius del sistema

```
Botones CTA:           50px    (pill shape)
Cards de story:        12px
Cards de menú:         12px
Icon en rounded sq:    12px    (40×40px container)
Círculos de personaje: 50%     (círculo perfecto)
Badges / pills:        50px    (pill)
```

### 9.3 Tipografía

Sans-serif de bordes redondeados que espeje el lenguaje de formas del arte: **Nunito**
(reemplaza a Fraunces/Karla, usados hasta el 2026-07-22). Nunca fuentes con remates (serif)
en la UI principal.

---

## 10. CHECKLIST DE CALIDAD

### Personaje
- [ ] ¿La cabeza es ≥35% de la altura total?
- [ ] ¿Los ojos tienen catchlight visible?
- [ ] ¿Pasa el silhouette test (reconocible en silueta)?
- [ ] ¿La expresión se lee claramente a 100px de ancho?
- [ ] ¿El rim light separa al personaje del fondo?

### Composición
- [ ] ¿El personaje ocupa el % correcto según su formato (§4.1)?
- [ ] ¿El tercio inferior está libre para texto (si aplica)?
- [ ] ¿El fondo tiene máximo 3 elementos de contexto?
- [ ] ¿El color más saturado está en el personaje, no en el fondo?

### Consistencia
- [ ] ¿El personaje tiene el mismo descriptor icónico que en otras escenas?
- [ ] ¿Los colores del vestuario coinciden con la Character Card?
- [ ] ¿El estilo de render es consistente con las demás imágenes del proyecto?

### Lumo específicamente (además de lo anterior)
- [ ] ¿Tiene el catchlight doble (luz externa + reflejo dorado propio)?
- [ ] ¿El brillo del abdomen es dorado, nunca verde, y nunca apagado?
- [ ] ¿Hay "color bleeding" cálido sobre superficies/personajes cercanos?
- [ ] ¿Las alas están en el estado correcto para la escena (reposo/vuelo/emoción/sueño)?

### Técnico
- [ ] ¿El archivo sigue la nomenclatura correcta?
- [ ] ¿Se exportaron los dos tamaños necesarios (1x y 2x)?
- [ ] ¿El gradient overlay está en CSS, no horneado en la imagen?

---

## 11. INSTRUCCIONES DE USO PARA CLAUDE CODE

1. **Lee este archivo completo** antes de generar cualquier prompt o imagen.
2. **Crea o consulta la Character Card** del personaje involucrado (§5.1).
3. **Arma el prompt en `MASTER-PROMPT-SYSTEM.md`**, usando los números y reglas de este
   archivo (proporciones §2.1, ocupación §4.1, tonos de luz §3.2).
4. **Valida con el checklist** antes de aprobar cualquier resultado (§10).

**Nunca generes imágenes de personajes sin tener definido su descriptor icónico.**
**Nunca uses blanco puro (#FFFFFF) como background de la UI.**
**Nunca incluyas el gradient overlay horneado en la imagen — siempre en CSS/código.**

---

*Versión 1.1 (2026-07-22) — Refactor: se eliminó la sección de templates de prompt (ahora en
`MASTER-PROMPT-SYSTEM.md`), se fijaron los porcentajes de ocupación oficiales (§4.1), y se
recortaron las keywords en inglés duplicadas (§2.4, §3.2) para que vivan en un solo lugar.
Actualizar este archivo cuando se definan nuevos personajes, se cambien tokens de color, o se
ajusten las reglas de producción.*
