# Notifications Team — FASE 0 (aprobada 2026-07-23)

Fuente: "PROMPT IMPLEMENTAR NOTIFICACIONES PUSH WEB" (documento externo) + filtro de
`LUMO-FILOSOFIA.md` §4-5 (nunca reenganche/culpa/racha; siempre invitación tranquila) +
regla de dialecto neutro (ver memoria `feedback_neutral_spanish_dialect`).

Reglas transversales aprobadas:
- Nunca usar la palabra "ritual" en copy visible al usuario.
- Nunca mencionar plazos internos ("24 horas", etc.) en el texto — la lógica de disparo
  puede usar tiempo internamente, el mensaje no debe sonar a recordatorio por ausencia.
- La familia marca el ritmo — evitar cualquier framing de obligación/horario fijo salvo
  que la propia familia lo haya configurado (caso 1).
- Cada categoría se activa/desactiva de forma independiente desde Configuración.

## Categorías aprobadas para activar

**1. Historias — recordatorio de horario (opt-in, la familia elige el horario)**
TÍTULO: Un buen momento para compartir una historia
CUERPO: Cuando ustedes lo deseen, la historia de hoy estará lista para acompañarlos.
URL: `/app`
DÓNDE: nuevo campo `reminderTime` en `AppState` (`lib/app-data.ts`) + disparo programado
PRIORIDAD: Alta

**2. Historias/Series — continuar donde se quedó**
TÍTULO: Su historia está lista para continuar
CUERPO: Continuará exactamente donde la dejaron.
URL: `/reproducir/{id}`
DÓNDE: `app/reproducir/[id]/page.tsx`, progreso parcial guardado
PRIORIDAD: Media
Nota: el criterio de "cuánto tiempo esperar" es lógica interna, nunca texto visible.

**3. Series — nuevo episodio disponible**
TÍTULO: Nuevo episodio de {serie.label}
CUERPO: {nextEpisodeHook} (campo ya existente en `content-catalog.ts`)
URL: `/reproducir/{nextEpisodeId}`
DÓNDE: catalog-integrator, únicamente al marcar un episodio `approved` e integrado — jamás
por inactividad del usuario.
PRIORIDAD: Media

**4. Oraciones — ilustración nueva**
TÍTULO: "{prayerTitle}" tiene una ilustración nueva
CUERPO: Una nueva forma de vivir este momento juntos.
URL: `/reproducir/{prayerId}`
DÓNDE: al integrar la ilustración de una oración
PRIORIDAD: Baja

**5. Versículo del día (nueva categoría)**
TÍTULO: El versículo de hoy está listo
CUERPO: Una palabra para acompañar este día.
URL: `/versiculo-del-dia` — ⚠️ ruta no existe todavía, hay que crearla o mapear a la
pantalla real donde vive hoy el Versículo del Día (tarjeta en `app/app/page.tsx` +
`lib/verses.ts`)
PRIORIDAD: Alta

**6. Reflexión del día (nueva categoría)**
TÍTULO: La reflexión de hoy ya está disponible
CUERPO: Un momento breve para compartir en familia.
URL: `/reflexiones` — ⚠️ ruta no existe todavía; la colección "Reflexiones" existe en
`lib/content-library.ts` pero no tiene pantalla de listado propia hoy
PRIORIDAD: Media

## Descartadas (no implementar)
- Desafío del día → se sentía como tarea pendiente, valor insuficiente para justificar interrupción.
- Pregunta del Diario → la conversación familiar debe surgir naturalmente en la experiencia, no por notificación posterior.

## Categorías finales del sistema (Configuración, activables por separado)
Historias · Series · Versículo del día · Reflexión del día · Oraciones · Contenido nuevo

## Prerrequisitos reales detectados antes de FASE 1 (bloqueantes)
1. **No hay backend de cuentas.** Todo el estado vive en `localStorage` por dispositivo
   (`lib/app-data.ts`). `push_subscriptions` no puede atarse a `auth.users` porque no hay
   Supabase Auth — se necesita definir cómo identificar "la familia" (device-id anónimo vs.
   cuenta real) antes de decidir el esquema de tabla.
2. **No hay proyecto de Supabase configurado.** `.env.local` tiene las variables comentadas
   y vacías. No tengo un conector MCP de Supabase ni de Vercel disponible en este entorno.
3. **Rutas `/versiculo-del-dia` y `/reflexiones` no existen** como pantallas propias — hay
   que crearlas o redirigir a donde vive hoy ese contenido.
