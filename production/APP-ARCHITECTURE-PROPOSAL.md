# Arquitectura de navegación — Lumo

Estado: **aprobada y en aplicación** (2026-07-24). Este documento empezó como propuesta y ahora
registra las decisiones ya tomadas — ver el historial de cambios al final.

## 1. Navegación primaria (bottom nav) — sin cambios

```
Inicio · Explorar · Mi camino · Diario · Perfil
```

Se mantiene en 5 tabs a propósito (decisión del usuario, 2026-07-24): cada tab nuevo es una
decisión más para un padre agotado a las nueve de la noche — va contra
`LUMO-FILOSOFIA.md`. Series, Historias bíblicas, Oraciones, Reflexiones, Afirmaciones,
Versículo del día, Colecciones no son tabs propios — viven dentro de Explorar o Perfil.

## 2. Inicio — solo el ritual de hoy (implementado 2026-07-24)

Responde una sola pregunta: "¿qué podemos compartir hoy?". Secciones, en orden, todas con datos
reales (ninguna se muestra si no hay contenido real detrás):

1. Continuar donde quedó (nuevo — ver §4).
2. Historia del día.
3. Versículo del día.
4. Oración del día (si corresponde una hoy).
5. Una recomendación (próxima historia real no vivida).
6. Botón grande → Explorar todo el contenido.

**Reflexión del día** no se muestra todavía — no hay contenido real de esa colección producido
(`lib/content-library.ts`, colección "reflexiones", 0 episodios). Se agrega sola cuando exista.

## 3. Explorar — biblioteca completa (sin cambios en esta pasada)

Sigue siendo la única pantalla de descubrimiento/navegación completa. Estructura interna
detallada quedó documentada en la versión anterior de este archivo (ver git log) — no repetida
acá para no duplicar fuente de verdad.

## 4. Progreso parcial por episodio (implementado 2026-07-24)

Nuevo dato en `AppState.progress: Record<string, ContentProgress>` (`lib/app-data.ts`), clave =
`contentId`:

```ts
type ContentProgress = { contentId: string; segmentIndex: number; audioTime: number; updatedAt: string };
```

- **Compatibilidad**: campo nuevo con default `{}` — estados guardados antes de esta fecha no lo
  tienen; `readApp()` ya hace `{ ...DEFAULT_STATE, ...parsed }`, así que se completa solo, sin
  migración manual ni romper nada existente.
- **Se guarda**: en `app/reproducir/[id]/page.tsx`, cada ~4s reales de audio (`handleTimeUpdate`),
  vía `saveProgress(contentId, segmentIndex, audioTime)`.
- **Se borra**: al terminar de verdad — mismo momento en que ya se marcaba
  `completedStoryIds`/`prayersSaidIds` (`completeStory`, `markPrayerSaid`), y también apenas se
  llega al último segmento (`goNext`/`onEnded` con `isLast`), para que "Continuar donde quedó"
  nunca ofrezca algo que la familia ya escuchó completo.
- **Se usa**: al abrir `/reproducir/[id]`, si existe progreso guardado para ese contenido, arranca
  directo en `segmentIndex` y hace `audio.currentTime = audioTime` una sola vez al cargar ese
  segmento — reanudación exacta, no aproximada.
- **Funciones nuevas** (`lib/app-data.ts`): `saveProgress`, `getProgress`, `clearProgress`,
  `recentInProgress(state, limit)` (más reciente primero, para "Continuar donde quedó" e
  historial reciente a futuro).
- Verificado en vivo (preview local, escritorio y móvil): progreso simulado en un contenido con
  audio real (`david-goliat`) → aparece "Continuar donde quedó" en Inicio → abrir el reproductor
  reanuda exactamente en la escena y el segundo guardados (confirmado con captura: barra de
  progreso en la escena 3/7, subtítulo a mitad de historia, no desde el inicio).

## 5. Fondo global viejo eliminado (hallazgo de paso, 2026-07-24)

`components/app/ambient-background.tsx` (paleta verde salvia, identidad pre-"Vigilia") vivía
montado globalmente en `app/layout.tsx`, siempre tapado por el contenido de cada pantalla. Al
acortar Inicio (§2) quedó expuesto un tramo del fondo viejo. Se eliminó el componente y su
archivo; `app/layout.tsx` ahora pone `bg-[#FAF3EE]` directo en `<body>` (el crema oficial de
CLAUDE.md §9.1), sin ninguna capa de fondo animada global.

## 6. Pendiente, todavía sin resolver

- "Próximamente" sigue siendo solo `/admin/proximamente` (herramienta interna) — decisión
  explícita de no hacerlo público todavía, hasta que exista un calendario editorial estable.
- Historial reciente / estado de avance visual por episodio en Explorar (más allá de "Continuar
  donde quedó" en Inicio) — el dato ya existe (`recentInProgress`), falta la pantalla.

## Historial de cambios

- 2026-07-24 — v1: propuesta inicial (5 tabs, estructura de Explorar, preguntas abiertas).
- 2026-07-24 — v2: aprobada. Inicio reestructurado, progreso parcial implementado, fondo viejo
  eliminado. Este archivo pasa de "propuesta" a "registro de arquitectura vigente".
