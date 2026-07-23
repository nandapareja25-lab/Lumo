# Pipeline de producción de contenido — Lumo

10 pasos (actualizado 2026-07-23 — antes eran 8; se agregó selección desde el registro
canónico de personajes y prueba del episodio completo como pasos propios, obligatorios antes
de integrar). El estado real de cada episodio vive en `production/STATUS.json` — nunca en la
memoria de una conversación, para que el proceso se pueda retomar sin repetir episodios ya
terminados.

## Flujo (10 pasos)

1. **Guion** — `story-writer` escribe la narración, reflexión, pregunta familiar, desafío y gancho.
2. **Revisión editorial** — `editorial-reviewer`, invocación independiente (no ve el razonamiento del escritor).
3. **Identificación de escenas** — qué momentos narrativos del guion necesitan ilustración propia (no solo portada). Ver `production/ILLUSTRATION-AUDIT.md` para el criterio de cuántas escenas amerita un episodio.
4. **Selección de personajes desde el registro canónico** (`lib/character-registry.ts`) — nunca rediseñar un personaje `approved` desde cero. Si un personaje del episodio no existe en el registro, crear su entrada (`status: "pendiente-de-ficha"` como mínimo) antes de generar.
5. **Generación de ilustraciones** — una por escena identificada en el paso 3, no una portada única. `image-producer` no puede marcar nada generado sin archivo real en disco.
6. **Revisión de continuidad visual** — `visual-reviewer`, invocación independiente. Valida además consistencia de personajes/vestuario/edad/proporciones contra el registro canónico, no solo composición.
7. **Integración en el reproductor** — `catalog-integrator` llena `ContentItem.illustrations[]` y `ContentSegment.illustrationId` para que cada escena muestre la imagen correcta durante la narración (ver `lib/content-catalog.ts` → `illustrationForSegment`).
8. **Prueba del episodio completo** — abrir el episodio real en el reproductor y confirmar que las ilustraciones cambian en el orden correcto durante la narración, no solo que los archivos existen.
9. **Actualización del catálogo** — `tsc --noEmit` limpio, `production/DASHBOARD.md` y `production/gallery.html` actualizados.
10. **Publicación** — commit, push, verificar deploy de Vercel.

## Regla de aprobación (bloqueante)

Un episodio NO puede marcarse `approved`/`complete`/`published` hasta que:
- el texto esté terminado y editorialmente aprobado;
- **todas** las ilustraciones previstas para ese episodio estén terminadas (no solo la portada);
- los personajes sean consistentes con `lib/character-registry.ts`;
- las imágenes estén integradas en `ContentItem.illustrations[]`, no solo generadas en disco;
- el episodio funcione correctamente en el reproductor real (paso 8, no solo `tsc` limpio).

## Roles

| Rol | Hace | No hace |
|---|---|---|
| `content-planner` | Planifica temporadas/episodios, personajes, escenas, enseñanza, dependencias | No escribe texto final ni genera imágenes |
| `story-writer` | Narración, reflexión, pregunta familiar, desafío, gancho, referencias | No se auto-aprueba |
| `editorial-reviewer` | Valida claridad, edad, continuidad, relleno, lenguaje inclusivo, fidelidad, duración, spoiler del gancho | Nunca revisa texto que escribió — **siempre corre como invocación independiente** |
| `visual-director` | Identifica escenas, selecciona personajes del registro canónico, ensambla el prompt con `MASTER-PROMPT-SYSTEM.md`, chequea contra Golden Masters/registro | No genera la imagen final |
| `image-producer` | Llama de verdad a la API de imágenes, guarda el archivo real, valida formato/dimensiones/peso, registra modelo y versión de personaje usada | No puede marcar "generada" sin archivo real en disco |
| `visual-reviewer` | Revisa el archivo real contra Golden Master/registro, escena, composición, anatomía, texto accidental, proporciones, consistencia entre escenas del mismo episodio | Nunca revisa una imagen que generó — **invocación independiente** |
| `catalog-integrator` | Inserta SOLO contenido aprobado en `lib/content-catalog.ts` (incluido `illustrations[]`), corre `tsc`, verifica que todo archivo referenciado exista, prueba el episodio en el reproductor real | No inserta nada con estado distinto de `visual_review: approved`, ni marca `approved` sin probar el reproductor |
| `production-manager` | Mantiene `production/STATUS.json` y `production/DASHBOARD.md`, coordina el orden de fases, decide cuándo un lote está bloqueado | No escribe contenido ni aprueba nada él mismo |

## Regla de independencia

`editorial-reviewer` y `visual-reviewer` son las dos únicas fases que se ejecutan como
**invocación de subagente separada** (sin contexto de cómo se escribió/generó lo que revisan) —
son los dos puntos del pipeline donde la independencia real importa. El resto de las fases
(planificación, ensamblaje de prompt, llamada a la API, integración) son deterministas —
correrlas como "otro agente" no agrega independencia real, así que se ejecutan directamente.

## Estados posibles (`production/STATUS.json`)

`planned` → `writing` → `editorial_review` → `scene_breakdown` → `character_selection` →
`image_generation` → `visual_review` → `integration` → `player_test` → `approved` | `blocked`

Un episodio `blocked` registra el motivo exacto y no bloquea al resto del lote.
