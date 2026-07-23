# Character Card: LUMO

> Personaje principal / mascota. Ficha completa — ver `CLAUDE.md` §5 para el template y las
> reglas generales de personajes (proporciones, silhouette test, expresiones).

**Slug:** `lumo`
**Color de acento:** `#FFD740` (dorado luciérnaga)

## GOLDEN MASTER — Circle Portrait oficial (aprobado 2026-07-22)

**Archivo:** `public/lumo-art/lumo_circle_default_200.webp` (2x: `lumo_circle_default_400.webp`)

Esta es la referencia oficial de identidad de Lumo. Toda ilustración futura del personaje se
compara contra esta imagen antes de aprobarse — cualquier mejora debe demostrar una mejora
clara sin alterar la identidad ya fijada acá (expresión, encuadre, proporciones, materiales).

**Por qué fondo claro y no nocturno:** el avatar de identidad permanente representa el estado
"de día" de Lumo (brillo suave, siempre visible — ver morfología abajo), no una escena
puntual. Convive con la UI real de la app (`#FAF3EE`) sin competir. La versión nocturna
original (`lumo_circle_night_*.webp`) queda como referencia para uso Hero/Splash, no como
identidad permanente — ver decisión de dirección de arte del 2026-07-22.

**Reproducibilidad:**
- Modelo: `gpt-image-1` (OpenAI Images API)
- Proceso: generación base + una edición dirigida (`images.edit`), no un solo paso
- Tamaño de generación: 1024×1024, calidad `high`
- Script de generación base: `scripts/generate-character-art-light-variant.mjs`
- Script de edición final: `scripts/edit-character-art.mjs`
- Prompt de generación base: bloque `{{CHARACTER}}` de Lumo + SCENE "seamless soft warm cream
  background (#FAF3EE)" + EMOTION "Curiosidad" + LIGHTING "Magia nocturna" (adaptada a ambient
  fill cálido) + FORMAT "Circle Portrait" — ver `MASTER-PROMPT-SYSTEM.md`
- Prompt de edición aplicada sobre esa base: reemplazar halo circular por degradado ambiental
  cálido de bajo contraste; aumentar iridiscencia/definición de alas; aumentar color bleeding
  cálido del abdomen sobre torso/brazos (texto completo en `scripts/edit-character-art.mjs`)
- No existe un parámetro de "seed" reproducible en `gpt-image-1` — la reproducibilidad depende
  de repetir este mismo proceso de dos pasos (generación + edición) con los prompts exactos
  arriba, no de un ID numérico único.

---

```
ESPECIE:          Luciérnaga (firefly) — 3D cartoon, estilo Pixar

DESCRIPTOR ICÓNICO (silhouette test)
  Abdomen bioluminiscente que emite luz cálida amarillo-dorada.
  Cuerpo oscuro + punto de luz cálida que irradia = LUMO en silueta pura.
  El brillo SIEMPRE visible. De día: suave. De noche: intenso. Nunca apagado.

MORFOLOGÍA — proporciones específicas
  Cabeza:    45% de la altura total (más grande que la norma)
  Ojos:      50-60% del área facial. Catchlight DOBLE:
             (1) catchlight estándar de la luz externa
             (2) reflejo dorado del brillo propio del abdomen
  Antenas:   Cortas, redondeadas, bolitas en las puntas (#FFD740)
  Cuerpo:    Oval compacto. Tórax oscuro + abdomen luminoso
  Alas:      2 pares, translúcidas, iridiscencia suave (verde-azul-lavanda)
             Plegadas en reposo, desplegadas en vuelo
  Patas:     6, cortas, redondeadas. Nunca en primer plano
  Tamaño:    Pelota de tenis (escala cartoon, no insecto realista diminuto)

COLOR DEL BRILLO — el color más importante del proyecto
  Brillo principal:  #FFD740  (amarillo-dorado cálido)
  Halo exterior:     #FF8C00  (naranja ámbar, difuso)
  De noche:          Ilumina 60-80px de radio alrededor del personaje
  De día:            Presente al 30% de intensidad nocturna
  Prompt keyword:    "glowing bioluminescent abdomen, warm golden light"

COLOR DE ACENTO UI (ring, badges, CTAs, iconos activos)
  HEX: #FFD740  —  Dorado luciérnaga

PALETA DE CUERPO
  Tórax:    #1A2A1A  (verde muy oscuro, casi negro)
  Abdomen:  #2A3A10  (verde oscuro) + glow #FFD740 encima
  Alas:     Translúcidas, tinte base #C8E8FF + iridiscencia
  Ojos:     Iris #2D5A1A + catchlight blanco + reflejo dorado
  Antenas:  #1A2A1A con bolitas #FFD740 en puntas

EXPRESIÓN DEFAULT
  CURIOSIDAD — cabeza ladeada, una antena más alta, ojos muy abiertos,
  sonrisa suave. LUMO siempre está descubriendo algo.

COMPORTAMIENTO DE ALAS
  Reposo:    Plegadas, casi invisibles
  Vuelo:     Desplegadas, mostrando iridiscencia
  Emoción:   Semi-desplegadas, temblando
  Sueño:     Completamente cerradas, brillo muy suave

REGLA CRÍTICA — efecto de luz en el entorno
  LUMO ilumina lo que tiene cerca. Objetos y personajes cercanos deben
  tener un tinte dorado-ámbar en el lado que da hacia LUMO.
  Este "color bleeding" del brillo es lo que hace la imagen sentirse mágica.
  Prompt keyword: "casting warm golden light on surroundings,
                   color bleeding from bioluminescence"

KEYWORDS DE CONSISTENCIA (incluir en TODOS los prompts)
  "firefly character, cartoon firefly, Pixar style firefly,
   glowing abdomen, bioluminescent, warm golden glow,
   big expressive eyes, translucent iridescent wings,
   rounded cute design, no realistic proportions"

NUNCA para este personaje
  - Brillo verde (cliché radiactivo, no mágico — siempre dorado)
  - Cuerpo marrón (pierde el carácter nocturno/misterioso)
  - 6 patas en primer plano (muy literal, resta encanto cartoon)
  - Postura amenazante o agresiva
  - Ojos pequeños o entrecerrados
  - Brillo apagado o invisible en cualquier escena
```
