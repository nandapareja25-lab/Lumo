# Motor de producción de video — investigación y diseño (pausado, 2026-07-26)

> **Estado: pausado a propósito.** El foco vuelve a terminar y lanzar la app principal de Lumo.
> Este documento existe para que, cuando se retome (con usuarios reales y más tiempo/presupuesto),
> no haya que rehacer la investigación ni las decisiones de arquitectura ya validadas.

## Qué es esto

Una herramienta **privada, de uso interno** (nunca una feature para usuarios de Lumo) para
convertir los cuentos/historias ya escritos del catálogo en videos animados con personajes
100% consistentes, integrada dentro del admin existente — no una app aparte.

## Decisión de arquitectura — resumen ejecutivo

1. **Motor de producción, no generador desde cero.** El principio rector es "reuse first,
   generate second": antes de generar cualquier imagen o video, el sistema consulta una
   biblioteca viva de personajes/poses/fondos ya aprobados, y solo gasta dinero en lo que
   genuinamente no existe todavía. Cada recurso nuevo aprobado entra automáticamente a la
   biblioteca para nunca volver a pagarse.
2. **Sin animación generativa por default.** La mayoría de los planos se resuelven con
   **DepthFlow** (parallax 2.5D gratuito, corre local, sin API) sobre una imagen fija con
   personaje recortado (fondo transparente) + fondo reutilizable. Video generativo real
   (Runway Gen-4 Turbo / Kling / Seedance, todavía sin integrar) queda reservado solo para el
   1-2 momento(s) de mayor tensión emocional por historia (regla ya existente, CLAUDE.md §7.2).
3. **Casting como reutilización, no solo poses.** Los personajes originales de "Cuentos con
   valores" (no bíblicos) usan un elenco de repertorio abierto y creciente — perfiles visuales
   reutilizables entre historias distintas con nombres narrativos distintos, separado de
   `character-registry.ts` (que sigue siendo solo para personajes canónicos de marca: Jesús,
   María, Lumo, etc.).
4. **Character Pack en la primera aparición de cada personaje nuevo**: 4 vistas (frontal, 3/4,
   perfil, cuerpo completo) + 6 expresiones base (neutral + los 5 registros de CLAUDE.md §2.4) +
   3 variantes de iluminación sobre una pose canónica (día cálido / noche fría / umbral) — 13
   imágenes, mayor costo inicial pero evita decenas de regeneraciones después.
5. **Todo corre local (scripts), no en el admin desplegado.** DepthFlow y ffmpeg no entran en
   una función serverless (sin GPU, sin disco persistente, límites de tiempo) — el motor es un
   conjunto de scripts que se corren manualmente, igual que ya funciona todo lo demás
   (`generate-content-audio.mjs`, `generate-character-art.mjs`, etc.). La capa de interfaz en
   el admin queda para **después** de validar el motor, no antes.
6. **Proveedores intercambiables** (imagen y, más adelante, video) — nunca depender de las
   reglas/pricing de un proveedor específico, porque cambian. Mismo patrón que ya usa
   `scripts/audio-providers/` para voz.

## Lo que ya se investigó (no hay que repetir esta parte)

- **Consistencia de personajes en imagen (2026)**: el patrón ganador es reference-based (subir
  1+ imágenes de referencia), no LoRA. `gpt-image-1` soporta esto vía `/v1/images/edits` (hasta
  16 imágenes de referencia) — **ya validado con una prueba real** (ver más abajo). Alternativa
  evaluada: Nano Banana Pro (Gemini 3 Pro Image), diseñado específicamente para hojas de
  personaje multi-pose, hasta 14 referencias con roles explícitos — no probado todavía, queda
  como plan B si `/edits` se vuelve un cuello de botella.
- **Video (para cuando se retome)**: Runway Gen-4 Turbo (~$0.12/seg oficial, mejor anclaje de
  personaje por referencia) y Seedance 1.5 Pro Fast (~$0.022/seg, el más barato con calidad
  usable) son los dos candidatos con mejor relación calidad/precio. Kling 3.0 como punto medio.
  Ninguno integrado todavía — decisión pendiente para la Fase 2.
- **Música/SFX**: ElevenLabs ya cubre esto (Music API + Sound Effects API) bajo la misma cuenta
  que ya usamos para narración — no hace falta sumar otro proveedor.
- **Ensamblado final**: ffmpeg (ya instalado), no Remotion — ya tenemos los `cues` de subtítulos
  calculados en `data/content-audio.json`, ffmpeg alcanza para quemarlos + mezclar audio.

## Riesgos técnicos ya validados

- **✅ Resuelto — `/v1/images/edits` sí preserva identidad**: prueba real con David (personaje
  ya aprobado) en una pose nueva (sentado, orando, de noche) que nunca existió — el resultado
  mantuvo pelo, tono de piel, cara y vestuario correctamente. Ver
  `production/video-drafts/_risk-validation/test-david-sentado-orando-noche.png`.
- **⚠️ Hallazgo, no bloqueante**: el endpoint `/edits` rebotó 3 veces por moderación de salida
  de OpenAI (`moderation_blocked`) en escenas diurnas/exteriores con el mismo personaje infantil
  — no se investigó la causa exacta (decisión explícita: no vale la pena optimizar para reglas
  de un proveedor que puede cambiar). Se resolvió con una capa de resiliencia genérica en vez de
  intentar entender la moderación de OpenAI específicamente.

## Código ya construido (queda en el repo, sin usarse activamente)

- `scripts/image-providers/` — proveedor de imagen intercambiable (`types.mjs`, `openai-images.mjs`, `index.mjs`).
- `scripts/image-providers/generate-with-resilience.mjs` — reintento con variantes de prompt +
  fallback de proveedor + registro de fallas en `data/generation-failures.json`. Validado con
  4 casos de prueba (proveedores simulados, sin costo).
- `scripts/video-engine/asset-library.mjs` — consulta/registro de la biblioteca viva
  (`data/character-asset-library.json`, `data/background-library.json`), función `resolvePlan()`
  que decide reutilizar vs. generar nuevo.
- `data/repertory-cast.json` — perfiles visuales de Nico y Abuela Rosa (elenco de repertorio,
  diseñados para reaparecer), del piloto que quedó sin terminar.
- `production/video-drafts/cuento-autocontrol-el-frasco-de-mermelada/shot-plan.json` — plan de
  escenas del piloto (6 momentos visuales, reducidos de 7 segmentos), resuelto contra la
  biblioteca: 14 necesidades → 10 generaciones únicas tras deduplicar fondos reutilizados.

## Piloto — quedó pausado antes de gastar en generación real

Costo estimado para completar el piloto: ~$6.50-7.50 (26 imágenes de Character Pack, inversión
reutilizable + 8 poses específicas del cuento + 2 fondos). **No se generó nada de esto** — se
pausó en el checkpoint de aprobación, antes de gastar.

## Para retomar esto en el futuro

Orden sugerido, sin perder lo ya validado:
1. Retomar el piloto justo donde quedó — aprobar y generar los Character Packs de Nico/Abuela Rosa.
2. Integrar DepthFlow + ffmpeg para el ensamblado de video sobre esos assets.
3. Medir costo real, tiempo de producción y % de reutilización en un cuento completo.
4. Recién ahí evaluar si hace falta integrar una API de video (Runway/Kling/Seedance) para los
   momentos de máxima tensión, y solo entonces sumar la capa de interfaz en el admin.
