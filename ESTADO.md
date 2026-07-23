# ESTADO — Lumo
Última actualización: 2026-07-22 | Sesión actual: 6

⏸️ CHECKPOINT — **Etapa "Vigilia" (identidad visual) cerrada oficialmente el 2026-07-21**, y
**etapa de exploración de producto cerrada el 2026-07-22.** Todo el recorrido principal (Landing,
Reproductor, Orar, Diario, Home, Explorar, Mi Camino, Perfil, Onboarding, Paywall) migrado a la
identidad Vigilia, auditado de punta a punta. Dentro de la etapa de Infraestructura/Contenido, ya
cerraron: "Producción de oraciones — audio" (8/8), "Reescritura de guiones de Historias" (las 7
stub reescritas), y "Producción de historias — audio" (9/9) — todas el 2026-07-21.

El 2026-07-22 se abrió y cerró una etapa de exploración de producto: nació `LUMO-FILOSOFIA.md`
(documento de mayor autoridad del proyecto), los principios 1-2 de `BRAND-DNA.md` ("el adulto es
el anfitrión del momento" / "el recuerdo pertenece a la familia"), una investigación de mercado
real, y una auditoría crítica de 10 ideas pendientes con una regla de triage permanente
(Integridad/Expresión/Producto) — ver sección "Cierre de la etapa de exploración de producto" más
abajo para el detalle completo, y `ROADMAP.md` para el sistema de gobierno congelado y el
resultado exacto del triage. Ya en Fase 2 (construcción), se ejecutaron: las 2 tareas de
integridad (duraciones reales + "10 minutos" del landing), una segunda pasada sobre las 8
oraciones (dialecto neutro en todo el proyecto + reescritura completa de guiones a 1-2 min + fix
de un bug real de subtítulos en el reproductor) — ver sección "Segunda pasada de oraciones" más
abajo — y **las 8 ilustraciones de oraciones completas** (1024×1536, sin mostrar a Lumo, regla de
"fotografía emocional", verificadas en Explorar y en el reproductor).

`antes-de-comer` (50s) y `antes-de-comenzar-el-dia` (55s) quedan aceptadas tal cual pese a estar
debajo del piso de 60s pedido, y `prayer-antes-de-comenzar-el-dia` queda aceptada pese a tener más
objetos de cocina en cuadro de lo ideal — ambas, decisión explícita del usuario. Siguiente acción
exacta: **continuar Fase 2** — limpieza de infraestructura, Sistema de pagos, Sistema de cuentas.
No se retoma trabajo de identidad visual salvo ajustes puntuales, ni se reabre la filosofía salvo
evidencia fuerte de que una convicción fundamental era incorrecta.

## Segunda pasada de oraciones — dialecto, duración y bug de subtítulos (2026-07-22)

Tras escuchar el piloto de ilustración, el usuario notó dos problemas reales en el audio ya
generado de las 8 oraciones (no detectados en la producción original):

- **Muletilla "Hola, soy Lumo"** repetida al inicio de las 8 — se sentía como ruido para una
  familia que reza todas las noches. Se quitó de las 8.
- **Duración real insuficiente**: los guiones originales daban 8-18 segundos de audio real — muy
  corto para sostener nada. Se reescribieron las 8 con estructura real de oración guiada
  (asentar → respirar/reflexionar → orar → consuelo/cierre), apuntando a 1-2 minutos.
- **Dialecto argentino**: se auditó todo el proyecto (código + contenido) buscando voseo. La voz
  de ElevenLabs se mantiene sin cambios (aprobada previamente) — el problema era el texto. Se
  encontraron y corrigieron 6 instancias reales: `content-catalog.ts` (cierre de "El buen
  samaritano" — requirió regenerar ese segmento de audio para que coincida), `lib/verses.ts` (2
  instancias, usado en la landing), y 2 en copy de UI (`diario`, `mi-camino`). El resto de
  ocurrencias de "acá" eran comentarios internos de código, no texto de usuario.
- **Bug real encontrado y corregido en el reproductor** (`app/reproducir/[id]/page.tsx`,
  `handleTimeUpdate`): durante silencios entre frases (pausas naturales o "..."), el subtítulo
  saltaba al último cue del segmento en vez de mantener el anterior — se sentía como "se pierde
  la secuencia". Corregido para que persista el último cue ya iniciado durante los silencios.
  Aplica a todo el reproductor, no solo a las oraciones.
- **Bloqueo de proveedor encontrado y resuelto**: la clave de ElevenLabs en `.env.local` tenía una
  cuota propia de 25.000 créditos (distinta del plan de 121.000/mes de la cuenta) — se agotó a
  mitad de la generación del piloto. El usuario amplió la cuota de la clave; se completó la
  generación sin cambiar de clave.
- **Resultado**: las 8 oraciones regeneradas — `cuando-tengo-miedo` 109s, `antes-de-dormir` 72s,
  `cuando-estoy-triste` 69s, `por-mi-familia` 65s, `dar-gracias` 62s, `antes-de-un-examen` 61s,
  `antes-de-comenzar-el-dia` 55s, `antes-de-comer` 50s. Las últimas 2 quedaron por debajo del piso
  de 60s pedido — el usuario decidió explícitamente dejarlas así por ahora (2026-07-22), son las
  oraciones naturalmente más breves del lote.

## Cierre de la etapa de exploración de producto (2026-07-22)

El usuario pausó toda implementación nueva para definir qué es Lumo antes de seguir agregándole
funciones — cita: *"Prefiero descartar diez ideas buenas antes que llenar Lumo de funciones sin un
propósito claro."* Resultado, en orden:

1. **`LUMO-FILOSOFIA.md`** (documento nuevo): responde por qué existe Lumo — no un vacío de
   contenido bíblico (la investigación de mercado mostró que abunda), sino la brecha entre la
   intención de un padre agotado y su energía real al final del día. Incluye su propia regla de
   enmienda: no cambia por buenas ideas nuevas, solo si una convicción fundamental resulta
   equivocada. Filtro operativo: *"¿esto reduce el costo de presencia para un adulto agotado, o lo
   aumenta?"*
2. **`BRAND-DNA.md` principios 1 y 2** (resto renumerado 3-14): "El adulto es el anfitrión del
   momento" y "El recuerdo pertenece a la familia" — decisión fundacional de que el usuario real
   de Lumo es el padre/madre, no el niño (que participa pero no opera ni decide el momento).
3. **Investigación de mercado real** (no tabla de funciones): Bible App for Kids, Hallow, Glorify,
   Pray.com, Abide, apps de "Bedtime Bible Stories", Sam/Bible Chat Kids — analizadas por quién es
   el usuario real, qué transformación prometen, qué comportamiento incentivan, y qué nunca
   harían. Ninguna combina adulto-anfitrión + recuerdo-sobre-métricas + anti-gamificación como
   postura declarada. Conclusión: Lumo no compite por tiempo de pantalla, compite por tiempo de
   presencia — espacio hoy desatendido en lo investigado, no copiado de un competidor.
4. **Auditoría crítica de 10 ideas pendientes** (color marrón, diferenciador, ilustraciones,
   "10 minutos" del landing, luciérnaga, duración de audios, meditaciones, rosario, canciones,
   series) contra `LUMO-FILOSOFIA.md`, con una **regla de triage permanente** (Integridad /
   Expresión / Producto) escrita en `ROADMAP.md`. Resultado: 2 pasan a tareas de integridad, 3
   quedan como expresión ya prevista, 2 quedan descartadas sin evidencia nueva, y 2 (series,
   canciones) quedan como **preguntas abiertas**, no features pendientes — no vuelven al roadmap
   automáticamente. Ver `ROADMAP.md` sección "Resultado del triage de las 10 ideas" para el
   detalle exacto.

**Sistema de gobierno del producto, congelado desde acá**: `LUMO-FILOSOFIA.md` (por qué) →
`BRAND-DNA.md` (cómo se expresa) → `ROADMAP.md` (qué y cuándo). No se abren documentos nuevos ni
se amplían estos tres salvo evidencia muy fuerte de que una convicción fundamental es incorrecta.

## Producción de oraciones (audio) — cerrada (2026-07-21)

Primera unidad de la etapa de Infraestructura/Contenido bajo el nuevo criterio "funcionalidad por
funcionalidad" (auditoría → arquitectura → aprobación → implementación → verificación real):

- **8 oraciones con narración real generada**: `antes-de-dormir`, `dar-gracias`,
  `cuando-tengo-miedo`, `cuando-estoy-triste`, `antes-de-un-examen`, `por-mi-familia`,
  `antes-de-comer`, `antes-de-comenzar-el-dia`.
- **31 segmentos de audio generados en total** (4 cada una salvo `antes-de-comer`, que tiene 3),
  vía `scripts/generate-content-audio.mjs` pasando explícitamente los 8 ids — el catálogo de
  Historias (`david-goliat`, `noe-arca`, etc.) **no se tocó**.
- **Proveedor: ElevenLabs** (misma voz oficial de Lumo, ya validada con "El buen samaritano") —
  intercambiable a futuro vía `scripts/audio-providers/`, sin tocar el script genérico.
- **`cues` con timestamps disponibles para subtítulos progresivos** en las 8 entradas de
  `data/content-audio.json` (formato moderno: `{ provider, segments: [{ url, cues }] }`).
- **Archivos servidos correctamente** desde `public/lumo-audio/` (31 mp3, uno por segmento).
- **Reproducción verificada en vivo** en `/reproducir/[id]` (probado con `antes-de-dormir`: audio
  real cargando vía `/api/content-audio`, progreso avanzando, subtítulo mostrado).
- **Costo real**: ~1,903 créditos en total — muy por debajo de lo presupuestado en
  `LUMO-CONTENT-BIBLE.md` sección 22 (~30,400 estimados).
- **Pendiente, deliberadamente fuera de esta unidad**: ilustraciones propias por oración
  (`illustrationSlug` tipo `prayer-*`) — se trabajarán como su propia unidad editorial separada
  (dirección de arte, prompts revisados uno por uno, generación individual, revisión editorial,
  integración), con el mismo nivel de cuidado que tuvieron las historias. Hasta que esa unidad se
  complete, **`MoodScene` sigue siendo el fallback visual oficial** para las 8 oraciones (ya cálido
  y consistente con Vigilia desde la auditoría final del cierre de esa etapa).

## Producción de historias (audio) — parcial, 2026-07-21

Auditoría del catálogo de 9 historias reveló un hallazgo que cambió el alcance: **7 de las 9
tienen guiones stub (3 segmentos, ~200-250 caracteres), no solo audio pendiente** — muy por debajo
de la `lengthCategory`/`durationSeconds` que tienen asignada (p.ej. `moises-mar-rojo` está marcada
"épica" con menos texto que las "cortas"). Generar narración real sobre esos guiones tal como
están produciría audio de ~15-20s contra los 95-110s prometidos — un problema de **contenido sin
terminar de escribir**, no de producción de audio.

- **Generado ahora**: `david-goliat` — único guion completo (7 segmentos, 5,209 caracteres,
  coherente con "épica") que no tenía narración. ElevenLabs, `cues` disponibles, verificado en vivo
  en el reproductor (`/lumo-audio/david-goliat-*.mp3`, 206 Partial Content).
- **Ya tenía audio completo**: `buen-samaritano` (referencia/piloto de la sesión anterior).
- **Quedan sin narrar, a propósito**: `noe-arca` (formato de registro viejo, sin `cues`) y las 6
  restantes (`moises-mar-rojo`, `hijo-prodigo`, `daniel-leones`, `jesus-tormenta`, `jose-hermanos`,
  `ester-reina`) — los 7 eran guiones stub. **Antes de narrarlas hacía falta una unidad de
  contenido** (reescritura de guion a la altura de `david-goliat`/`buen-samaritano`), separada de
  la producción de audio.

## Reescritura de guiones de Historias — cerrada (2026-07-21)

Unidad de **contenido** (no de audio), abierta tras el hallazgo anterior. Regla editorial fijada
por el usuario para las 7 reescrituras: *"No queremos contar lo que pasó. Queremos hacer que la
familia sienta que caminó junto a los personajes"* — el estándar de calidad es "El buen
samaritano"/"David y el gigante": vivir la historia narrada, no escuchar un resumen bíblico.

- **Piloto aprobado primero** (`moises-mar-rojo`): 3 segmentos → 8 segmentos, 207 → 4,673
  caracteres, `durationSeconds` 100 → 380 (ahora coherente con su `lengthCategory` "épica").
  Verificado en el reproductor antes de continuar con el resto.
- **Las 6 restantes reescritas con el mismo criterio**: `noe-arca` (7 segmentos, 3,389
  caracteres), `hijo-prodigo` (6 segmentos, 2,751), `daniel-leones` (6 segmentos, 2,688),
  `jesus-tormenta` (6 segmentos, 2,049), `jose-hermanos` (8 segmentos, 4,077), `ester-reina` (7
  segmentos, 3,198). Todas ahora con `durationSeconds` realista para su `lengthCategory`, un
  segmento de cierre (`role: "guia-cierre"`) con reflexión + pregunta, y personajes secundarios
  agregados a `characters` donde correspondía (Miriam y Faraón, el rey Darío, Mardoqueo/Amán/rey
  Asuero, etc.).
- **Verificado**: `npx tsc --noEmit` limpio; `ester-reina` y `moises-mar-rojo` confirmados en vivo
  en `/reproducir/[id]` (título, ilustración y duración correctas).
- **Las 9 historias del catálogo fundacional ahora tienen guion completo y consistente.**

## Producción de historias (audio) — cerrada (2026-07-21)

Con los 7 guiones ya reescritos, se generó narración real (ElevenLabs) para las 7 historias que
faltaban: `noe-arca` (7 segmentos), `moises-mar-rojo` (8), `hijo-prodigo` (6), `daniel-leones` (6),
`jesus-tormenta` (6), `jose-hermanos` (8), `ester-reina` (7) — 48 segmentos en total. Sumadas a
`david-goliat` y `buen-samaritano`, **las 9 historias del catálogo fundacional tienen ahora
narración real completa**. Verificado en `data/content-audio.json` (todas con `provider:
"elevenlabs"`, `cues` y `url` presentes) y en vivo en el reproductor (`jose-hermanos` confirmado
reproduciendo `/lumo-audio/jose-hermanos-0.mp3`, 206 Partial Content).

## Cierre de la etapa Vigilia (2026-07-21)

Migración completa de identidad, screen por screen, con el criterio auditoría → concepto →
aprobación → implementación → verificación real en cada una:

- **Landing** (`app/page.tsx`): reconstruida desde cero sobre la dirección "Vigilia" (noche cálida,
  hilo de luz, mundo compartido) — reemplaza por completo la versión clara/menta anterior.
- **Reproductor** (`/reproducir/[id]`): compartido entre historias y oraciones; ahora también
  gatea el acceso (`isGated`, `freeStoryId`, `hasAccess` en `lib/app-data.ts`) — una historia
  gratis, el resto pide Paywall.
- **Orar, Diario, Home, Explorar, Mi Camino, Perfil**: cada una repensada conceptualmente, no solo
  repintada (Diario pasó de historial a álbum; Mi Camino de dashboard de racha a narrativa
  curada; Explorar solo con catálogo real, sin señales de roadmap).
- **Onboarding**: de 6 pasos a 2 (nombre → llegada) — se eliminó el paso de "crear cuenta" (no
  existía backend real) y la edad del niño (sin uso en la app); ya no fabrica un primer recuerdo
  de Diario antes de vivir una historia real.
- **Paywall**: de lista de funciones a invitación emocional; conectado de verdad al gateo de
  acceso del reproductor.
- **Login**: evaluado y movido a la fase de Infraestructura — hoy no forma parte de ninguna
  experiencia real (nada enlaza a `/login`), se diseña junto con la autenticación real como un
  solo sistema (crear cuenta / iniciar sesión / restaurar acceso / cambiar de dispositivo / cerrar
  sesión / recuperación), no antes.
- **El mundo compartido**: 5 ilustraciones generadas (`world-home`, `world-mi-camino`,
  `world-diario`, `world-orar`, `world-explorar`) que comparten la misma luna, luz, niebla y
  luciérnagas — "cinco rincones del mismo universo", vía `components/app/world-backdrop.tsx`. El
  hilo de luz (`components/app/lumo-thread.tsx`) dejó de ser exclusivo de la Landing.
- **Auditoría final (2026-07-21)**: barrido completo del código (no de memoria) confirmando cero
  restos de "ritual"/multi-hijo/funciones futuras en copy visible, las 8 escenas de respaldo
  (`components/scenes/*`) recalentadas a la paleta cálida, y ningún componente visual suelto en
  tokens de la identidad anterior en las rutas de usuario reales.
- **Documentos de gobierno vigentes**: `BRAND-DNA.md` (12 principios + "Lumo no vende contenido,
  Lumo protege un momento"), `FICHA-ARTE.md` (Vigilia), `ROADMAP.md` (fases actualizadas).

## Rediseño de la app interna sobre mockup de referencia (2026-07-17)
El usuario envió un mockup completo (estilo app premium tipo Eden) con: splash, inicio, explorar,
reproductor, un CHAT con Lumo, "mi camino" (racha+logros+stats), orar, y modo noche. Se acordaron
3 decisiones antes de construir:
1. **Chat con IA (Lumo conversacional)**: pospuesto — requiere IA en runtime real (contradice la
   decisión de Sesión 1 de "sin IA en runtime" y tiene costo/riesgo de contenido para niños).
   NO construido. Si se retoma más adelante, es su propia sesión con su propio análisis de costo,
   seguridad de contenido y arquitectura (ver `30-INTEGRACION-IA.md`).
2. **Diario**: se mantiene en la barra inferior (no se reemplaza por "Favoritos" como en la
   referencia) — sigue siendo el diferenciador frente a Eden.
3. **Racha de días**: se implementó SIN romperse nunca — `weekDots()` en `lib/app-data.ts` muestra
   los días de la semana completados, pero un día sin marcar no resetea nada ni avisa con culpa.

**Construido:**
- Navegación nueva de 5 tabs: Inicio · Explorar · Mi camino · Diario · Perfil
  (`components/app/bottom-nav.tsx`)
- **Inicio** (`app/app/page.tsx`): saludo + avatar de Lumo, tarjeta de Versículo del día (con
  "Leer reflexión" que marca el versículo como leído), accesos rápidos (Orar/Explorar/Diario/Mi
  camino), ritual destacado del día, carrusel "Para ti hoy"
- **Explorar** (`app/app/explorar/page.tsx`, reemplaza Biblioteca): buscador + filtros (Todo,
  Antiguo/Nuevo Testamento, Personajes, Milagros de Jesús, Mujeres de la Biblia, Valores
  Cristianos) — el catálogo de 9 historias (`lib/story-catalog.ts`) ahora tiene `tags` para
  soportar estos filtros temáticos, más una historia nueva (Ester) para que "Mujeres de la
  Biblia" no esté vacía
- **Orar** (`app/app/orar/page.tsx`, nuevo): categorías (Agradecimiento/Petición/Perdón) +
  oraciones sugeridas (`lib/prayers.ts`) que se marcan como "rezadas"; "Crear mi propia oración"
  queda deshabilitado y marcado "(pronto)" — no fingimos una función que no existe
- **Mi camino** (`app/app/mi-camino/page.tsx`, nuevo): racha con puntos por día de la semana (sin
  romperse), 4 logros con condición real de desbloqueo (`ACHIEVEMENTS` en `lib/app-data.ts`),
  estadísticas (historias/oraciones/versículos completados — "Música" queda como "—" hasta que
  haya contenido real)
- **Perfil**: simplificado — los hitos se mudaron a "Mi camino", queda solo identidad + tradición
  de fe + privacidad + cerrar sesión
- `lib/app-data.ts`: nuevos campos `versesReadDates`, `prayersSaidIds` + funciones `markVerseRead`,
  `markPrayerSaid`, `weekDots`, y `ACHIEVEMENTS` con condiciones reales sobre datos existentes
- `lib/verses.ts` (nuevo): catálogo de versículos con significado + pregunta de reflexión, rota
  por día igual que las historias
- ⚠️ **"Música relajante"** de la referencia NO se construyó — no hay pistas de audio reales
  todavía; aparece como "—" en estadísticas en vez de simular algo inexistente

## Fase 3 — pulido visual final (2026-07-17)
- **Parallax de scroll** en `components/app/ambient-background.tsx`: colinas, árboles y el sol se
  desplazan a distinta velocidad que el contenido al hacer scroll (`framer-motion useScroll` +
  `useTransform`, sin target = trackea el scroll de toda la página) — sensación de profundidad.
- **Hojas cayendo**: 4 hojas SVG con caída + balanceo + rotación en loop infinito, escalonadas,
  muy sutiles (opacidad baja), respetan `prefers-reduced-motion` (se ocultan del todo si está activo).
- **Transiciones entre secciones de la landing** (`components/app/reveal.tsx`): fade+translateY al
  entrar en el viewport (`whileInView`, una sola vez), aplicado en Problema/Solución/Oferta/CTA final.
- **Micro-interacciones**: botones (`components/ui/button.tsx`) ahora escalan sutil al hover
  (1.015) y al presionar (0.97) además del `translate-y-px` que ya tenían; las tarjetas-póster de
  historias (`story-poster.tsx`) levantan y escalan levemente al pasar el mouse.
- Todo el motion nuevo respeta `useReducedMotion()` — se desactiva solo si el usuario lo pide a nivel SO.

## Poses de Lumo generadas (2026-07-17)
Las 3 poses (`lumo-frontal`, `lumo-feliz`, `lumo-volando`) están generadas, aprobadas y guardadas en
`/public/lumo-art/` + `data/landing-assets.json`. Verificado en el navegador: onboarding (paso 1 y
"volando"), perfil — se ve el render 3D real, no el SVG. `.env.local` del usuario ya tiene
`OPENAI_API_KEY` y `ADMIN_PASSWORD` configurados (no repetir ese pendiente).

## Lumo en 3D real vía IA (2026-07-17)
El SVG plano no logra el nivel de render 3D de la ficha del usuario (confirmado por el usuario:
"esa no es la misma luciérnaga" → causa raíz: estilo, no proporciones/colores). Se conectó el
pipeline de generación ya existente (antes solo para escenas de landing) al personaje:
- `lib/landing-sections.ts`: 3 poses nuevas — `lumo-frontal` (uso general), `lumo-feliz`
  (celebración/hitos), `lumo-volando` (onboarding/hero).
- `lib/lumo-style-guide.ts` reescrito con el diseño EXACTO de la ficha del usuario (render 3D tipo
  película animada, cuerpo dorado, ojos grandes, antenas con luz, alas translúcidas, abdomen que
  brilla y "nunca desaparece del todo", personalidad curioso/amable/valiente/empático/alegre/
  esperanzador) — se antepone automáticamente a cualquier generación.
- `components/app/lumo-portrait.tsx` (nuevo, client-side vía `/api/lumo-pose`): muestra la pose
  real si ya fue generada y aprobada; si no, cae en el SVG de `lumo.tsx` — mismo patrón que las
  escenas de landing. Reemplazado en los usos "grandes" de Lumo (onboarding, login, perfil, diario
  de historia); los usos pequeños dentro de las 6 escenas ilustradas siguen en SVG (son decorativos,
  no el retrato del personaje).
- Pendiente del usuario: agregar `OPENAI_API_KEY` en `.env.local` y entrar a `/admin/landing` para
  generar y aprobar las 3 poses — en cuanto existan, aparecen solas en toda la app sin tocar código.

## Rediseño de Lumo: luciérnaga mágica (2026-07-17, a pedido del usuario)
El usuario trajo una ficha de personaje completa (vistas, expresiones, poses, paleta, escala) para
"Lumo — Luciérnaga mágica" y pidió aplicarla. Se avisó una vez que esto revierte la decisión de la
Sesión 2 de evitar una luciérnaga literal (por ser una forma común en apps nocturnas), y con el
usuario confirmando, se aplicó como nuevo diseño oficial — detalle completo en `FICHA-ARTE.md` →
"Rediseño del personaje". `components/app/lumo.tsx` reescrito: cuerpo dorado, alas, antenas con
luz en la punta, ojos grandes con parpadeo periódico (nuevo), abdomen que brilla. Mismo sistema de
animación de antes (glow que respira, nunca llega a apagarse del todo). Personalidad ampliada:
curioso, amable, valiente, empático, alegre, esperanzador.

## Repaint v3: paleta viva + fondo ilustrado global (2026-07-17, a pedido del usuario)
El usuario rechazó la paleta anterior ("demasiado plana y apagada, un gran fondo beige") y pidió
algo inspirado en Eden: naturaleza + luz, con Lumo destacando mucho más. Cambios:
- **Fondo ilustrado global fijo:** `components/app/ambient-background.tsx` — cielo (celeste→salvia→
  crema en degradé), sol/luz cálida, estrellas sutiles, colinas superpuestas y árboles al borde.
  Vive UNA vez en `app/layout.tsx` (`position:fixed`, detrás de todo el contenido vía z-index) —
  ninguna pantalla necesita agregarlo, aparece en TODA la app automáticamente.
- **Paleta nueva** (`app/globals.css`): fondo de respaldo #E7EFEA · texto #1F3D2E (verde bosque,
  ya no marrón) · tarjetas blanco cálido #FFFCF5 con sombra propia (antes sin sombra, se perdían
  contra el fondo) · acento/marca dorado vivo #E0A438 (antes un dorado más apagado) · secundario
  salvia #E3EEE1 · nuevo token `--sky` #6FA8C7 (azul cielo, para variedad en badges/chips) ·
  `--growth` ahora es un verde salvia sólido #4E9270.
- **Lumo rediseñado** (`components/app/lumo.tsx`): ahora trae su propio halo cálido incorporado
  (antes dependía de que la pantalla que lo usaba le pusiera un círculo de fondo — se perdía si no)
  y colores de cuerpo más vivos (verdes medios en vez de casi-negros) — destaca en cualquier
  pantalla sin ayuda externa.
- Se eliminó un archivo duplicado obsoleto (`app/page 2.tsx`, un backup viejo sin uso real).

## PIVOTE DE PRODUCTO: Lumo como biblioteca de historias (2026-07-17)
El usuario, tras ver capturas reales de Eden Kids Bible Stories, decidió que Lumo debe ser desde
el inicio una biblioteca explorable (no solo "1 historia por día sin poder ver más"), manteniendo
el ritual diario como el centro de la experiencia y el diario espiritual como diferenciador
(Eden NO tiene diario). Aclaración explícita del usuario: NO copiar la interfaz de Eden — solo su
nivel de calidad visual, jerarquía de información y experiencia. Nada de video generado: el
reproductor es ilustración fija + audio, nunca video.

**Construido en esta ronda (catálogo + navegación + reproductor):**
- `lib/story-catalog.ts` — catálogo de 8 historias (Antiguo/Nuevo Testamento), cada una con
  `faithTradition: "cristiana"` ya en el dato (arquitectura lista para sumar otras tradiciones sin
  rediseñar) y sus escenas (ilustración + texto). Agregar una historia = agregar un objeto al
  array, nunca tocar componentes — así escala a cientos.
- **6 fondos ilustrados reutilizados como "moods"** (`components/scenes/mood-scene.tsx`) en vez de
  arte único por historia: cada escena de cada historia usa uno de los 6 fondos ya construidos
  (family/book/prayer/diary/night/threshold). Interino y honesto — cuando el admin genere arte
  propio por historia (extensión futura del panel `/admin/landing` a claves arbitrarias), se
  reemplaza sin cambiar la forma del dato.
- **Navegación nueva:** Inicio / Biblioteca / Diario / Perfil (reemplaza Hoy/Diario/Progreso/Familia
  de la Sesión 5 original). Progreso y Familia se fusionaron dentro de Perfil.
- **Inicio** (`app/app/page.tsx`): historia destacada del día (rota por el catálogo) a póster grande
  + carruseles "Volver a escuchar" (historias completadas) y "Nuevas historias" (por descubrir).
- **Biblioteca** (`app/app/biblioteca/page.tsx`): grid de tarjetas-póster con tabs Todas/Antiguo/Nuevo.
- **Portada de historia** (`app/app/historia/[id]/page.tsx`): póster grande, categoría, cantidad de
  escenas, favorito (corazón), botón Reproducir/Volver a escuchar.
- **Reproductor** (`app/reproducir/[id]/page.tsx`, ruta FUERA de `/app` para ser pantalla completa
  sin nav): ilustración a pantalla completa por escena, narración con Web Speech API (interino —
  reemplazar por voces reales grabadas subidas por admin cuando existan), texto sincronizado,
  transición crossfade entre escenas, controles play/pausa/anterior/siguiente, barra de progreso
  por escena. Música ambiental: el campo está listo en el diseño pero NO se generó audio sintético
  falso — se deja pendiente de pistas reales con licencia (Sesión 6), en vez de sonar mal.
- **Diario por historia** (`app/app/historia/[id]/diario/page.tsx`): pregunta de reflexión propia de
  cada historia (antes era genérica), voz o texto, guarda y celebra hitos.
- `lib/app-data.ts` reescrito (`lumo_app_v2`): `completedStoryIds`, `favoriteStoryIds`,
  `completeStory()`, `toggleFavorite()`, `isStoryCompleted()` — reemplaza la lógica vieja de 3
  historias fijas rotando.

**Pendiente (fase 3, ya acordada con el usuario — "primero catálogo y nav, luego reproductor, al
final pulido y animaciones"):** Hero de la landing a pantalla completa (el usuario dijo
explícitamente "todavía no me convence"), parallax suave, hojas moviéndose, Lumo parpadeando,
destellos de luz, transiciones fluidas entre secciones, micro-animaciones en botones/tarjetas en
TODA la app (no solo la landing).

## Ajustes post-Sesión 5 (a pedido del usuario, 2026-07-17)
- **Paleta relumbrada:** el usuario pidió algo menos oscuro/opaco. Nueva paleta cálida y luminosa —
  fondo crema #FBF3E7 · superficie blanca #FFFFFF · texto #2B2721 · acento #D98A2E · crecimiento #3F7A6B.
  Las 6 escenas ilustradas (`components/scenes/*`) MANTIENEN su cielo nocturno interno propio — la
  oscuridad ahora vive solo DENTRO de las ilustraciones ("ventana a la noche"), nunca en el chrome de
  la app. `FICHA-ARTE.md` queda desactualizada en el bloque de hex — pendiente de refrescar cuando
  se toque diseño de nuevo (no bloquea, la fuente de verdad en código ya está actualizada).
- **Pricing actualizado:** mensual $4.99 (antes $7.99) · anual $39.99/año mostrado como $3.33/mes
  (antes $59.99 → $4.99/mes), badge "4 meses gratis" (antes "2 meses gratis"). Actualizado en landing
  y `/paywall`.
- **Selector de edad tipo rueda:** `components/onboarding/age-wheel.tsx` — scroll-snap nativo,
  reemplaza la grilla de 7 botones.
- **Diario con voz:** `components/app/voice-recorder.tsx` (MediaRecorder → data URL). Toggle
  "Con la voz / Escribiendo" en el diario del onboarding Y en el ritual diario de `/app`. El audio
  se guarda hoy como base64 en localStorage (`diaryAudio` / `DiaryEntry.audioUrl`) — en Sesión 6 se
  sube a Supabase Storage y el campo pasa a ser la URL real, sin cambiar la forma del dato.
- **Celebración de hitos (NO racha):** el usuario pidió "rachas y victorias"; se le avisó que
  "racha que se rompe" contradice su propia regla NUNCA de la Sesión 1, y eligió mantener esa regla:
  se agregó celebración visible al alcanzar un hito (1/7/30/90 noches) en vez de una racha punitiva —
  `newlyReachedMilestone()` en `lib/app-data.ts`, pantalla de celebración en `/app` tras completar el
  ritual.

## Qué es esta app (3 líneas máximo)
App cristiana para familias con hijos de 4-10 años: biblioteca de historias bíblicas narradas (ilustración + audio, sin video) con un ritual diario de 10 minutos como centro — historia + oración/reto + diario espiritual del niño — y la biblioteca completa explorable en cualquier momento. Modelo: suscripción con onboarding-first (registro gratis → primera historia → paywall → trial 7 días → anual).

## Promesa central
"Esta app ayuda a mamás cristianas a crear una rutina nocturna de 10 minutos con sus hijos de 6 a 8 años — historia bíblica, conversación, oración y un diario espiritual — sin pantallas de más y sin reemplazar su rol como madre, para que ambos terminen el día sintiendo que vivieron un momento especial con Dios."

## Reporte de validación (Sesión 1)
- Veredicto: Excelente oportunidad
- Apps de referencia: Theo: Prayer & Meditation (400K familias en 10 semanas, 3.96★/690 reseñas, $59.99/año), Godly Kids (rutina diaria completa, modelo lifetime), Bedtime Bible Stories for Kids (740K descargas, solo audio pasivo)
- Lo que los usuarios odian de la competencia (nuestra oportunidad): cobros/cancelaciones confusas (Theo), apps que son solo "contenido" sin conexión real padre-hijo, nada de seguimiento del crecimiento espiritual del niño en el tiempo
- Brecha LATAM confirmada: sí — en español solo hay apps genéricas de lectura bíblica o devocionales sueltos, ninguna con el formato ritual nocturno completo (historia+charla+reto+oración+diario)
- Precio de referencia del mercado: $5-6/mes (~$60/año, Theo)

## Constitución del Producto
- Primera victoria: que mamá e hijo terminen los primeros 10 minutos sintiendo que vivieron un momento especial juntos — el niño pregunta "¿mañana hacemos otra historia?" y la mamá piensa "necesitaba esto". No debe sentirse como una app más, sino como un ritual familiar que trae paz y cercanía con Dios.
- Features del MVP (en orden de prioridad — decisión del usuario, NO se reordena):
  1. Historia bíblica narrada + reflexión + preguntas para conversar (el corazón de la experiencia)
  2. Oración guiada + mini desafío para vivir lo aprendido durante el día
  3. Diario espiritual del niño (voz o texto) — el mayor diferenciador, muestra a los padres cómo crece la fe del niño con el tiempo
  - Fuera del MVP (para después): imprimibles para colorear (desbloqueables al terminar la lección), música cristiana, cuentos para dormir
- Reglas NUNCA (principios del producto):
  1. Nunca manipular emocionalmente (sin "perdiste tu racha", sin culpa por no entrar un día)
  2. Nunca publicidad, especialmente en la experiencia del niño
  3. Nunca vender ni compartir datos del diario espiritual o de la familia — privado, propiedad exclusiva de los padres
  4. Nunca generar enseñanzas bíblicas/doctrinales solo con IA — todo el contenido principal (historias, reflexiones, oraciones, planes) creado o revisado por personas con conocimiento bíblico
  5. Nunca faltar al respeto a la tradición de fe de la familia — acompañar, no cambiar creencias ni mezclar doctrinas
  6. Nunca sustituir el rol de los padres — herramienta para facilitar, no niñera digital
  7. Nunca fomentar adicción — menos pantalla, más familia; preferir que la actividad continúe fuera del dispositivo
  - Filosofía: "La tecnología debe acercar a la familia a Dios y entre sí, nunca reemplazar esa relación."

## Dirección de Arte (Sesión 2 — APROBADA, cosa juzgada)
- FICHA-ARTE.md: SÍ — aprobada 2026-07-17
- ¿Hubo referencia visual del usuario?: parcial (Eden Kids Bible Stories como referencia conceptual de calidad cinematográfica, NO copiada — usuario pidió síntesis propia)
- Resumen: fondo #122420 · superficie #1D322C · acento (luz) #F0A94E · crecimiento #7FB89F · Display "Fraunces" · Body "Karla" · radio 16-20px
- Personalidad: Sereno (dominante) · Cálido · Entrañable
- Personaje de marca: "Lumo" — criatura nocturna inventada (no es firefly/búho/cordero literal) con una luz cálida en el pecho que respira en reposo y crece cuando la familia completa el ritual — la mecánica de progreso ES el personaje
- REGISTRO ANTI-REPETICIÓN: paleta #122420/#1D322C/#F0A94E + par tipográfico Fraunces/Karla vetados para el próximo proyecto del SO

## Avatar y venta (Sesión 1 — APROBADA, cosa juzgada)
- FICHA-AVATAR.md: SÍ — aprobada 2026-07-17 (el copy de venta se DERIVA de ella — 57)
- Resumen: "Andrea", madre 25-45 años, LATAM + comunidades hispanas en EE.UU., 1+ hijos entre 4-10 años · dolor #1 = "quiero acercar más a mis hijos a Dios pero no sé por dónde empezar" · deseo #1 = un ritual sencillo que ya venga listo, sin prepararlo cada día · nivel de consciencia 3, sofisticación 2-3 · mensaje centrado en el DESEO de fe familiar y recuerdos duraderos, NO en la culpa por pantallas (ajuste explícito del usuario para ampliar el mercado)

## Estrategia de monetización (Sesión 1 — decidido, NO cambiar sin validar)
- Modelo: Onboarding-first con registro gratis (nicho "Bienestar/rutina emocional diaria" de 02C — como Headspace/Calm)
- Justificación: hábito diario (no resultado puntual) → onboarding+trial convierte mejor que hard paywall; el diario del niño debe persistir desde la noche 1, por eso requiere cuenta temprano (no preview anónimo)
- Diseño del paywall: aparece tras completar la primera historia (mini-experiencia completa gratis) — lo que el niño guardó en esa sesión (diario) permanece accesible SIEMPRE para la familia, incluso sin pagar (decisión explícita del usuario)
- Trial: 7 días con tarjeta (default del SO)
- Pricing propuesto (benchmark Theo ~$5-6/mes; sin costo de IA en runtime → margen alto): mensual $7.99 (ancla) · anual $59.99 mostrado como "$4.99/mes" con badge "2 meses gratis" — el usuario puede ajustar con /precios cuando quiera

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Landing → Onboarding → Paywall → Login → App interna, TODAS construidas (Sesiones 3-5). Falta conectar servicios externos reales (Sesión 6)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida y elevada con la pasada de escaneabilidad mobile — 10 secciones canónicas (hero con headline de 10 palabras y mecanismo en el badge, problema con preguntas en tarjetas+ícono, agitación en 2 tarjetas con cifra destacada, solución en 3 pasos numerados, app por dentro con íconos, oferta $4.99/mes anual · $7.99/mes mensual, garantía "Ritual Cumplido", FAQ en acordeón, CTA final, footer legal con disclaimer de IA) · CTA repetido tras el mecanismo, tras el carrusel, en la oferta y en el cierre — todos apuntan a `/onboarding` (Modelo 2: la landing vende el registro gratis, el pago se pide después) · sticky CTA funcional (oculto cerca de oferta/cierre) · verificado tsc+build+dev sin errores, sin overflow horizontal (scrollWidth=innerWidth=375) · screenshots reales a 375px de cada sección revisados
  ⚠️ Pendiente: veredicto formal del subagente `revisor-visual` (/40 usabilidad, /20 craft) — esta sesión no logró exportar un screenshot sin distorsión con el método de captura headless disponible (confirmado que la distorsión era del tool, no del render real, vía scrollWidth=innerWidth); la landing NO debe declararse "100% lista" hasta correr ese veredicto con un mecanismo de captura confiable (ej. Playwright MCP)
- Onboarding: construido — 6 pasos (nombre del hijo → edad 4-10 → "construyendo tu ritual" con checklist animado → primera historia real con pregunta de Lumo + diario guardado → registro gratis por email (magic link mock) → "tu plan está listo") · barra de progreso fina 5-8%→100%, transición slide+fade entre pasos (50-DISENO-ONBOARDING-PAYWALL.md) · estado en localStorage versionado (`lib/onboarding-store.ts`, shape listo para migrar a Supabase en Sesión 6)
  - Corrección de secuencia vs. el placeholder inicial: el registro (cuenta) se movió DENTRO del onboarding (paso 5), no después del paywall — porque el diario del niño debe persistir desde la noche 1 (ya decidido en Sesión 1). `/login` quedó como puerta de entrada para USUARIOS QUE YA TIENEN CUENTA (returning), no como parte del alta inicial.
- Paywall: construido en `/paywall` — value stack con checks, selector anual/mensual, **Timeline del Trial** (Hoy · Día 5 aviso · Día 7 cobro — anatomía C4 de 50), CTA "Empezar mis 7 días gratis", salida "Ahora no", trust row (Garantía Ritual Cumplido + pago seguro)
- Login: construido en `/login` — 3 estados (formulario/enviando/enviado) del patrón magic-link de 26-AUTH-MODERNO.md, con countdown de reenvío de 60s (respeta el rate-limit real de 3/5min que se implementará con Supabase). Hoy es un MOCK (no envía correo real) — anotado en pantalla para no confundir al usuario en pruebas.
  ⚠️ Auth real (Supabase magic link, cookies HttpOnly, RLS) se conecta en Sesión 6 — hoy es simulación de UI/UX únicamente
  - Ruta `/onboarding`, `/paywall`, `/login` ya existen y se probaron end-to-end en el navegador sin errores de consola

## Ilustraciones cinematográficas de la landing (Sesión 3, ampliación)
- 6 escenas propias en el universo visual de Lumo (hero, historias-biblicas, oracion-familia,
  diario-espiritual, rutina-noche, registro-final) — dibujadas a mano en SVG + framer-motion
  (respiración, parallax suave, partículas de luz, respeta prefers-reduced-motion). Componentes en
  `components/scenes/*`. Personajes/escenarios 100% originales — ninguno copiado de Theo/Eden/Disney.
- Sistema de generación por IA construido y LISTO pero INACTIVO hasta que el usuario ponga las claves:
  - Proveedor elegido: OpenAI Images API (`gpt-image-1`) — ver justificación en el chat de esta sesión
  - Guía de estilo reutilizable: `lib/lumo-style-guide.ts` (paleta, personaje, iluminación, prohibiciones —
    se antepone automáticamente a cualquier prompt del admin)
  - Almacenamiento INTERINO (hasta Supabase en Sesión 6): PNG aprobado → `/public/lumo-art/*.png` +
    metadata en `data/landing-assets.json` (mismo shape de datos que tendrá la tabla `landing_assets`
    de Supabase — migrar más adelante no debería romper la landing ni el admin)
  - Panel: `/admin/landing` (prompt → generar preview → aprobar/regenerar/descargar/asignar a sección)
  - Rutas API: `app/api/admin/generate-image` (llama a OpenAI, devuelve 501 con mensaje claro si falta
    `OPENAI_API_KEY`) y `app/api/admin/landing-assets` (guarda lo aprobado)
  - Gate temporal de acceso: `/admin/login` con `ADMIN_PASSWORD` (cookie HMAC, Web Crypto — compatible
    con Edge Runtime). ⚠️ ES UN STOPGAP: reemplazar por Supabase Auth + rol admin real en 26/Sesión 6.
- Costo estimado: $0.02–$0.19 por imagen (gpt-image-1); ~$1-4 en total para las 6 escenas con reintentos.
  No se genera nada por visitante — solo cuando el admin aprueba manualmente.
- App interna: construida en `/app` (+ `/app/diario`, `/app/progreso`, `/app/familia`) con nav inferior fija (`components/app/bottom-nav.tsx`):
  - **Hoy** (`app/app/page.tsx`): flujo de 3 pasos (historia → oración+reto → diario) igual al de onboarding; si ya se completó hoy, muestra el recap de la respuesta guardada en vez de repetir el ritual
  - **Diario** (`/app/diario`): lista de respuestas guardadas con fecha e historia de origen; estado vacío diseñado (no "input+2 botones") para el caso sin entradas
  - **Progreso** (`/app/progreso`): noches de ritual acumuladas + hitos (1/7/30/90 noches) — nunca "racha rota", solo camino recorrido; la luz de Lumo crece visualmente con las noches
  - **Familia** (`/app/familia`): perfil del niño, tradición de fe (solo "Cristiana" por ahora), aviso de privacidad del diario, y "Cerrar sesión" funcional
  - Loop de retención (Hooked, documentado en `lib/app-data.ts`): Gatillo (hora de dormir, notificaciones reales en Sesión 6-7) → Acción (abrir el ritual) → Recompensa (luz de Lumo crece + diario guardado para siempre) → Inversión (el diario acumulado, sin culpa ni racha punitiva)
  - Estado en `lib/app-data.ts` (localStorage), migra automáticamente la primera entrada del onboarding — probado end-to-end en el navegador (ritual completo, recap, hitos, cerrar sesión) sin errores de consola
- Servicios externos: pendiente (Sesión 6)

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js App Router — decidido el 2026-07-17 (landing con SEO/contenido orgánico a futuro)
- Stack: React + TypeScript + Tailwind v4 + shadcn/ui + Lucide + Supabase + Vercel (default del SO)
- Multi-tradición de fe (requisito del usuario, no re-discutir): el contenido (historias, oraciones, retos) vive en tablas con columna `faith_tradition_id` (FK) — nunca mezclar contenido de distintas tradiciones. La familia elige su tradición en el onboarding (`profiles.faith_tradition_id`), y el RLS de lectura de contenido exige `content.faith_tradition_id = (select faith_tradition_id from profiles where id = (select auth.uid()))`. Lanzamiento: solo tradición "cristiana" cargada; el esquema ya soporta sumar otras sin migración estructural.
- Rutinas como tipo, no hardcodeadas a "noche" (requisito del usuario): tabla `routines` con columna `routine_type` (`noche` para el MVP; `mañana`, `musica`, `cuentos`, etc. a futuro) en vez de modelar todo alrededor de "nightly". Cada rutina agrupa sus piezas de contenido (historia, oración, reto) por `routine_id`.
- Auth: solo la madre tiene cuenta (Supabase Auth, magic link/OTP). El hijo NO tiene login — es un registro `child_profiles` con `parent_id references auth.users(id)`, RLS `using ((select auth.uid()) = parent_id)`. Patrón tipo "perfiles" (como Netflix) pero sin identidad propia del niño.
- Diario espiritual: tabla `journal_entries` (child_id, routine_id, respuesta texto/audio, fecha) — RLS estricta por `parent_id` del child_profile; JAMÁS expuesta a terceros ni usada para IA sin consentimiento explícito (regla NUNCA del usuario). La primera entrada (sesión gratis) NUNCA se bloquea aunque no haya pago — columna `unlocked_free = true` en esa entrada específica.
- IA en runtime: NINGUNA en el MVP. Todo el contenido (historias, narración, reflexiones, oraciones, retos) es curado/grabado por un equipo editorial vía panel admin, nunca generado en vivo por usuario — coincide con la regla NUNCA de "contenido doctrinal solo con IA". Se reevalúa a futuro solo para funciones no-doctrinales (ej. TTS de producción offline, nunca el texto religioso en sí).
- Hotmart: modelo "registro gratis → sube a Pro" (18 → Modelo 2B). Webhook busca por `user_id` (pasado como `src`/`sck` en el link de checkout) antes que por email, para evitar el bug de cuenta duplicada cuando el email de compra difiere del de registro.

## Sesiones completadas ✅
- Sesión 1 — Validación, FICHA-AVATAR aprobada, arquitectura (multi-tradición, multi-rutina, auth padre-hijo, sin IA runtime), pricing propuesto — 2026-07-17
- Sesión 2 — Identidad visual: investigación de 10 apps referentes (Duolingo, Pokémon Sleep, Finch, Khan Academy Kids, Sago Mini, Pok Pok, Homer, Lingokids, Disney, Eden), FICHA-ARTE.md aprobada con personaje "Lumo" — 2026-07-17
- Sesión 3 — Scaffold técnico (Next.js 16 + Tailwind v4 + shadcn/ui, tokens de Lumo aplicados) + página de ventas completa (10 secciones + 6 escenas cinematográficas + panel /admin/landing) construida y verificada — 2026-07-17 (veredicto visual formal pendiente, ver nota arriba)
- Sesión 4 — Onboarding (6 pasos), paywall (timeline del trial) y login (magic link mock) construidos y probados end-to-end en el navegador — 2026-07-17
- Sesión 5 — App interna (Hoy/Diario/Progreso/Familia) con loop de retención sin rachas punitivas, probada end-to-end — 2026-07-17
- Sesión 5b — Pivote a biblioteca de historias (tipo Eden): catálogo ampliado a 9 historias con tags (personajes/milagros/mujeres/valores), Explorar con grid de 6 categorías, reproductor por escenas con crossfade. Personaje Lumo rediseñado como luciérnaga 3D (ficha de referencia del usuario) generado por IA (OpenAI `gpt-image-1`) vía panel `/admin/landing` + script de generación masiva (`scripts/generate-story-art.mjs`). Se generaron 15 ilustraciones reales (9 portadas de historia + 6 categorías) que reemplazan las escenas abstractas en Home, Explorar, portada de historia y el reproductor. Decisiones confirmadas con el usuario: sin chat de IA en vivo (por ahora), se mantiene el tab Diario (no se reemplaza por Favoritos), la racha nunca se "rompe" ni resetea. — 2026-07-17
- Sesión 5c — Bug fix: `ArtAsset` (componente que muestra las ilustraciones generadas) tenía `relative` y `absolute` en conflicto en el mismo div, causando que las imágenes cargaran (200 OK) pero no se vieran (contenedor colapsaba a 0px de alto). Corregido quitando el `relative` hardcodeado; verificado con `tsc`, `build` y screenshots en Home, Explorar, portada de historia y reproductor — 2026-07-17
- Sesión 5d — Cambio de filosofía de contenido (decisión "cosa juzgada" del usuario): Lumo deja de pensarse como app de lectura/biblioteca de textos y pasa a ser una **plataforma de experiencias narradas audio-first** (referencia: Spotify + Audible + Calm + Theo). Cada pieza de contenido se modela como un "episodio" (`lib/content-catalog.ts`, tipo `ContentItem`) con metadata completa: tipo de contenido (historia/oración/devocional/serie/meditación/música/podcast/reto/curso/especial — extensible sin rediseñar pantallas), serie, temporada, número de episodio, duración, edad recomendada, nivel bíblico, narrador, personajes, valores, pasajes bíblicos, idioma, ilustración, audio principal, música, guion por segmentos y preguntas de conversación. Se migraron las 9 historias y se ampliaron las oraciones de 6 (por categoría) a 8 (por situación: antes de dormir, dar gracias, cuando tengo miedo, cuando estoy triste, antes de un examen, por mi familia, antes de comer, antes de comenzar el día), cada una con guion tipo experiencia guiada (intro de Lumo → reflexión → oración → cierre). `lib/story-catalog.ts` y `lib/prayers.ts` quedaron como vistas de compatibilidad sobre `content-catalog.ts` (cero cambios en las 7 pantallas que ya los consumían — verificado con `tsc`, `build` y screenshots de Explorar/Orar sin regresiones). **Pendiente (fases siguientes, no iniciar sin confirmar orden con el usuario):** rediseño audio-first de Home/Explorar/Diario/Mi camino (mini-reproductor persistente, "continuar escuchando", duración/narrador visibles, descargas, recomendaciones tipo Spotify/Netflix) + decisión de audio real. El usuario pidió investigar voces premium (ElevenLabs u otras) antes de programar nada de audio — investigación aún no realizada, es el próximo paso obligatorio antes de tocar el reproductor. — 2026-07-18

- Sesión 5e — Voz real de Lumo: investigado ElevenLabs (Multilingual v2, Voice Design, Sound Effects, Music) vs. alternativas — costo real es mínimo porque el contenido se produce una sola vez, no en runtime. Usuario creó su cuenta y una voz propia con Voice Design (femenina, cálida, narración infantil) — Voice ID `UV1PvCsFzKWpDz8VJiDc`, probada con un fragmento de "David y el gigante" y aprobada ("si"). Se generó con `scripts/generate-content-audio.mjs` la narración real de las 17 piezas del catálogo completo (65 segmentos de audio, ~4.2MB) guardada en `public/lumo-audio/` + registro en `data/content-audio.json`. Se creó `/api/content-audio` (lectura pública por id, mismo patrón que `/api/lumo-pose`) y se conectó el reproductor de historias (`app/reproducir/[id]/page.tsx`) para usar la voz real de Lumo, con Web Speech API como respaldo si algún segmento no tuviera audio — verificado en el navegador: se reproduce el audio real y avanza de escena automáticamente al terminar cada clip. Las oraciones (`/app/orar`) ya tienen su audio generado pero la pantalla sigue mostrando solo texto — pendiente de Sesión 5f (rediseñarla como experiencia guiada de audio, no como lista de texto). — 2026-07-18

- Sesión 5g — Guion cinematográfico real + biblioteca a escala (decisiones "cosa juzgada" del usuario): las escenas de 8-15s eran resúmenes, no storytelling — el usuario pidió escenas de 45-90s con narración descriptiva, diálogos, y Lumo como guía (intro/cierre, nunca narrador de corrido), no como toda la historia. Se reescribió "David y el gigante" completo con ese estándar (8 escenas: intro de Lumo + 6 escenas narrativas con diálogo real + cierre con la pregunta de reflexión) y se regeneró su audio real — duración medida: **~7 minutos** (no los 12-20 de "épica" que se había estimado a ojo; queda pendiente de decisión si se alarga o se reclasifica). Se agregó `SegmentRole` (`guia-intro`/`narracion`/`guia-cierre`) y `LengthCategory` (historia-corta 6-8min / historia-estandar 8-12 / historia-epica 12-20 / oracion-guiada 3-7 / momento-dormir 8-12 / devocional 5-8) al modelo. Se arregló además el UX del texto sincronizado en el reproductor (`app/reproducir/[id]/page.tsx`): por defecto ahora NO se muestra texto (solo ilustración + audio, verdadero audio-first), con un botón "Ver texto" opcional que abre una tarjeta acotada con scroll — antes el párrafo largo se superponía sin límite sobre la imagen. **Cambio de estrategia mayor**: el usuario rechazó la idea de un catálogo de "17 historias" — quiere una plataforma cuya arquitectura esté diseñada desde el día uno para 100-150 experiencias de audio organizadas en colecciones (como Theo/Spotify), y pidió explícitamente NO generar audio de todo el catálogo todavía, solo diseñar la biblioteca. Se creó `lib/content-library.ts`: `COLLECTIONS` (5: Historias Bíblicas, Oraciones Guiadas, Devocionales, Meditaciones, Series Especiales) y `SERIES` (52 series/sub-temas registrados con su `targetEpisodes` — 26 series de Historias Bíblicas del Génesis a Pablo, 12 devocionales por valor, 7 meditaciones, 7 series especiales de temporada — total ~143-160 episodios objetivo, sin inventar ningún episodio de mentira: una serie sin contenido producido simplemente no tiene episodios listados todavía, se mostrará "Próximamente" a nivel de serie cuando se construya esa parte de Explorar). `ContentItem` ahora tiene `collectionId`/`seriesId` en vez del viejo `series: string` libre; las 17 piezas reales existentes quedaron re-etiquetadas dentro de esta taxonomía (ej. david-goliat → colección "historias-biblicas", serie "david"). **Estado real de contenido: 17 piezas producidas (1 con el guion cinematográfico nuevo, 16 todavía con el formato corto viejo de 3-4 líneas) de ~150-160 planeadas — nada más se generó, ni guion ni audio, para las series nuevas.** — 2026-07-18

- Sesión 5i — Ajustes del reproductor + fidelidad bíblica (feedback del usuario tras probar David y Goliat): 3 cambios "cosa juzgada". (1) Lumo ya NO se presenta ("Hola, soy Lumo...") al inicio de cada episodio — rompía la inmersión; se quitó el segmento `guia-intro` de David y Goliat (queda el cierre reflexivo `guia-cierre`, que el usuario sí quiere mantener). Lumo presentándose queda reservado para introducir una serie completa (a futuro, no por episodio) — no implementado todavía, solo removido el patrón repetitivo. (2) Subtítulos ahora son progresivos estilo karaoke, nunca el guion completo de golpe: se regeneró el pipeline de audio (`scripts/generate-content-audio.mjs`) para usar el endpoint `with-timestamps` de ElevenLabs (marca de tiempo por carácter), agrupar en "cues" cortas (~55-85 caracteres) y guardarlas en `data/content-audio.json` (`segments: [{url, cues:[{text,start,end}]}]`). El reproductor (`app/reproducir/[id]/page.tsx`) ahora escucha `onTimeUpdate` del audio y muestra solo la cue activa — un botón "Mostrar/Ocultar subtítulos" reemplaza al viejo "Ver texto" (que mostraba el párrafo completo). (3) Fidelidad bíblica: al terminar cada historia aparece una pantalla de cierre "Esta historia está basada en [libro capítulo:versículos]" (usa `content.passages`) con un link real y funcional a BibleGateway para leer el pasaje completo, antes de continuar al diario. **BLOQUEADOR real, no resuelto**: la cuenta de ElevenLabs se quedó sin créditos a mitad de la regeneración de audio de David y Goliat con el nuevo pipeline (quota_exceeded, quedaban 80 de 10,000 créditos — este guion largo necesita ~800-1000 créditos por segmento) — **David y Goliat quedó sin audio real hasta que el usuario agregue créditos o suba de plan**; el código de subtítulos-karaoke y la pantalla de cierre están implementados y verificados estructuralmente (fallback a Web Speech API sin subtítulos cuando no hay audio real, sin crashear), pero NO se pudo verificar el karaoke con audio real todavía — es lo primero para probar apenas haya créditos. — 2026-07-18

- Sesión 5j — Ajustes finos post-feedback (todos "cosa juzgada"): (1) Referencias bíblicas completas con rango de versículos (ej. "1 Samuel 17:1–58", "Lucas 15:11–32") en vez de solo el capítulo, en las 9 historias; pantalla de cierre ahora agrega la línea "Esta historia está basada en las Escrituras. Te invitamos a leer el pasaje completo en familia." (2) Confirmado que los subtítulos ya eran estilo subtítulo de película (frase corta reemplaza a la anterior), no karaoke palabra-por-palabra — se acortó el tamaño de las frases (~22-45 caracteres, corte preferente en coma/punto) para que se sientan más naturales, como los ejemplos que dio el usuario. (3) Se eliminó Web Speech API por completo del reproductor — ya no es ni siquiera un respaldo. Si el audio real de una historia no está listo, se muestra una pantalla honesta "La narración con la voz de Lumo está en producción" (mismo principio "nunca fingir contenido" de toda la app) en vez de sintetizar voz de navegador. Verificado en el navegador con David y Goliat (sin audio real por el bloqueo de créditos de la sesión anterior): aparece correctamente la pantalla de "en producción", sin errores de consola. — 2026-07-18

- Sesión 5k — Modelo de costos de por vida + abstracción de proveedor de audio (decisiones "cosa juzgada"): Se recalculó el presupuesto de ElevenLabs basado en **caracteres reales, no en minutos estimados** — confirmado empíricamente que el modelo `eleven_multilingual_v2` con la voz de Lumo cobra **exactamente 1 crédito por carácter** (los 5,149 caracteres del guion de David y Goliat pidieron exactamente 5,149 créditos, segmento por segmento) y que el endpoint `with-timestamps` (subtítulos) NO tiene costo extra — mismo precio que TTS normal. Con esa tasa: catálogo inicial de 131 episodios ≈ 736,768 caracteres/créditos (generación base), + música/SFX como biblioteca reutilizable (no por episodio) ≈ 28,500 créditos. Se compararon 3 escenarios (conservador/realista/premium) y 3 planes de ElevenLabs (Creator/Pro/Scale) — el plan **Pro ($99, 1-2 meses)** gana en casi todos los escenarios; **Scale nunca conviene** (corrige una recomendación anterior equivocada de esta misma sesión). Se validó que producir por colecciones (la estrategia que pidió el usuario) cuesta prácticamente lo mismo en dólares que producir todo junto (~$198 vs ~$198) pero con muchísimo menor riesgo — confirma que batching es la estrategia correcta. Se armó también un modelo de crecimiento de varios años: estado estacionario (~10 episodios nuevos/mes + correcciones) ≈ 70,300 créditos/mes, cabe en Creator ($22/mes); palancas opcionales NO comprometidas todavía (nuevo idioma completo ≈ 920,960 créditos, variantes de edad para 20 historias insignia ≈ 281,200 créditos, expansión estacional año 2 ≈ 105,450 créditos). **Arquitectura**: se construyó `scripts/audio-providers/` con un contrato `AudioProvider` (`synthesize(text) -> {audioBuffer, cues}`) — `elevenlabs.mjs` es la implementación real (movida desde el script), y `openai-tts.mjs`/`google-tts.mjs`/`azure-tts.mjs`/`polly.mjs` son stubs que documentan el contrato pero lanzan error si se usan (no se implementaron especulativamente). Cambiar de proveedor = cambiar `AUDIO_PROVIDER` en `.env.local`, nunca tocar `generate-content-audio.mjs` ni ningún componente — la app y el script de generación nunca supieron el nombre de un proveedor específico en el código (ya estaba desacoplado del lado de consumo vía `/api/content-audio`; ahora también del lado de generación). El registro `data/content-audio.json` ahora guarda `provider` (antes `voiceId`) para trazabilidad histórica de qué motor generó cada pieza. Verificado con `tsc --noEmit` + `npm run build` limpios; no se generó ningún audio nuevo (instrucción explícita del usuario). — 2026-07-18

- Sesión 5l — LUMO CONTENT BIBLE (decisión "cosa juzgada" del usuario): antes de producir contenido nuevo, el usuario pidió fijar por escrito el estándar oficial de contenido. Se creó `LUMO-CONTENT-BIBLE.md` (mismo nivel que FICHA-ARTE.md/FICHA-AVATAR.md, gobierna todo contenido futuro): estructura de episodio, duración por tipo, cantidad/longitud de escenas (45-90s c/u), ritmo narrativo (alternar narración/diálogo/descripción/silencio), cuota mínima de diálogo, reglas de aparición de Lumo (cierre reflexivo siempre, intro de serie solo en el primer episodio, nunca saludo repetido por episodio), música/SFX como bibliotecas reutilizables, subtítulos tipo película (no karaoke), pantalla de referencia bíblica completa + link, pregunta de reflexión, checklist de aprobación de calidad, y el orden de producción obligatorio: (1) este documento, (2) un episodio piloto "gold standard" iterado hasta estar casi perfecto, (3) recién ahí producción por colecciones. **Ningún guion nuevo se escribe todavía** — el siguiente paso es elegir y producir el episodio piloto. — 2026-07-18

- Sesión 5m — Episodio piloto "gold standard": el usuario eligió escribir "El buen samaritano" desde cero (no reutilizar David y Goliat) para validar el LUMO-CONTENT-BIBLE.md sin arrastrar decisiones previas. Reescrito completo en `lib/content-catalog.ts`: 6 escenas narrativas + 1 cierre de Lumo, sin saludo repetido de Lumo (arranca directo con el maestro de la ley preguntándole a Jesús — Lucas 10:25-29, biblicamente fiel), diálogo real en cada escena, ritmo alternado narración/diálogo/pausa, ambientación sensorial. Verificado carácter por carácter contra el checklist de la sección 16: todas las escenas entre 50-65s (dentro de 45-90s), total 4,696 caracteres ≈ 6.17 min (dentro de "historia corta" 6-8min tras dos rondas de expansión — la primera versión dio solo 4.64min y 2 escenas por debajo del mínimo de 45s). `durationSeconds` actualizado a 370 (valor real, no el placeholder viejo). Pantalla de "en producción" verificada visualmente (sin audio real todavía, sin crashear). `tsc`+`build` limpios. **No se generó audio ni se gastaron créditos** — el guion está listo para revisión del usuario antes de aprobar y recién ahí generar el audio real.

- Sesión 5n — Ampliación mayor del Content Bible + experiencia completa (decisiones "cosa juzgada"): el usuario redefinió qué es un "gold standard" — no alcanza con aprobar el guion. Se agregaron a `LUMO-CONTENT-BIBLE.md`: **Sección 17 (Dirección artística e ilustraciones)** — filosofía (cada imagen cuenta la historia antes del audio), referencias de calidad (Pixar/Disney/DreamWorks/Wild Robot/Klaus/Arcane solo en composición), regla de oro (si no serviría de póster de película, no cumple el estándar), reglas de composición (nunca primer plano posando, mostrar la acción principal con profundidad), consistencia de personajes recurrentes, límites de aparición de Lumo en ilustraciones (no en todas, nunca roba protagonismo), y el cambio más grande: **ilustración por escena, no una portada reciclada para todo el episodio** (esto invalida el patrón actual de `ArtAsset` con una sola imagen por historia — pendiente de implementar cuando se produzca arte real por escena). **Sección 18 (Validación de experiencia completa)** — un episodio no se aprueba por partes: guion + narración + ilustraciones + música + SFX + subtítulos + ritmo + UX deben aprobarse juntos, nunca aisladamente. **Sección 19 (Experiencia de cierre enriquecida)** — el episodio no termina cuando termina el audio: referencia bíblica + reflexión + pregunta visible en pantalla + link al pasaje + sugerencia de episodio relacionado. Implementado y verificado visualmente en `app/reproducir/[id]/page.tsx`: la pantalla de cierre ahora muestra los 5 elementos (se agregó `related` — busca otra historia de la misma `seriesId`, con fallback a tags compartidas — confirmado que "El buen samaritano" sugiere correctamente "El hijo pródigo", ambas de la serie "parabolas"). Verificación visual se hizo con un cambio temporal (`finished` forzado a `true`) revertido inmediatamente después de la captura — no quedó ningún código de prueba en el archivo. `tsc`+`build` limpios en cada paso. **Pendiente, no iniciado**: producir las ilustraciones por escena (requiere generar nuevo arte con OpenAI para "El buen samaritano" siguiendo la Sección 17 — composición amplia, no retrato — antes de que el piloto pueda considerarse completo contra la Sección 18). — 2026-07-18

- Sesión 5o — Primer intento de arte por escena + 2 defectos reales encontrados (decisiones "cosa juzgada"): se generaron las 6 ilustraciones por escena + portada de "El buen samaritano" (`scripts/generate-scene-art.mjs`, nuevo — reutiliza la escena del samaritano ayudando de la portada vieja para la escena 4, generó 6 nuevas). Al revisar dentro del reproductor real (no solo los archivos sueltos) se encontraron 2 problemas que el usuario no aceptó como terminados: (1) **formato cuadrado recortado** — se generó todo en 1024x1024 y el reproductor es vertical 9:16, el recorte automático (`object-cover`) le quita profundidad justo al costado que más importaba, incluso a las 2 escenas que sí habían salido bien compuestas; (2) **ojos sobredimensionados y expresión de sorpresa permanente** — defecto clásico de IA genérica, no nivel Pixar. Ninguna imagen se aprobó. Se agregó a `LUMO-CONTENT-BIBLE.md` sección 17: subsección **"Rostros y expresión"** (regla estricta, casi verbatim del usuario: nunca ojos/pupilas sobredimensionados ni sorpresa permanente, emoción vía cejas/mirada/boca/postura, estilo Pixar/Disney no caricaturesco) y **"Formato y resolución"** (generación nativa vertical `1024x1536`, nunca cuadrada recortada después) + checklist de aprobación de ilustración. Se actualizaron `lib/story-style-guide.ts` (guía canónica, agrega `STORY_IMAGE_SIZE = "1024x1536"`) y `scripts/generate-scene-art.mjs` (guía inline + tamaño de generación + instrucción de encuadre reforzada `WIDE_SHOT` repetida en cada prompt, porque `gpt-image-1` ignoraba "composición amplia" sin una restricción concreta de distancia/tamaño). **No se generó ninguna imagen nueva todavía** — el usuario pidió actualizar la guía primero; el código y los prompts ya están listos para el próximo intento. `tsc`+`build` limpios. — 2026-07-18

- Sesión 5o-bis — Iteración de ojos + reversión a "una sola ilustración por episodio" (decisiones "cosa juzgada"): con la instrucción reforzada de la Sesión 5o, se probaron 3 escenas nuevas de a una (escena 0: maestro de la ley y Jesús; escena 5: Jesús y el maestro pensativo; escena 1: el herido en el camino) — las 3 pasaron el test de "tapar la boca" en todos los rostros, incluidos personajes secundarios y niños de fondo (el primer intento de la escena 0 había fallado ahí — el usuario detectó que el protagonista podía salir bien pero los niños de fondo seguían con ojos redondos tipo IA; se agregó una regla explícita de que la corrección aplica a TODOS los rostros del cuadro, no solo al protagonista). El usuario además generó su propia versión de la escena 0 (fuera de este pipeline, en otra sesión/herramienta) y la trajo al proyecto como la referencia de calidad definitiva — se copió a `public/lumo-art/story-buen-samaritano-scene-0.png` y se registró en `data/landing-assets.json`. **Luego, con 3 escenas ya validadas, el usuario cambió de estrategia de fondo**: en vez de una ilustración por escena, quiere **una sola ilustración principal espectacular por episodio** (mejor invertir tiempo/créditos en una portada extraordinaria que en varias buenas-pero-no-extraordinarias; ilustración por escena o animación queda como evolución futura, no el foco ahora). Se actualizó `LUMO-CONTENT-BIBLE.md` sección 17 y sección 5 (estructura de episodio) para reflejar esto. Se revirtió `app/reproducir/[id]/page.tsx` para usar un solo slug `story-{id}` (no `story-{id}-scene-{index}`). Se reemplazó `scripts/generate-scene-art.mjs` (per-escena, ahora obsoleto, eliminado) por `scripts/generate-hero-art.mjs` (un solo ítem por episodio, con las reglas de ojos/expresión y formato vertical ya incorporadas de fábrica). **No se generó ninguna imagen nueva en este último paso** — solo arquitectura/documentación, tal como pidió el usuario. Quedan como archivos huérfanos (no referenciados por ningún código, inofensivos) las 5 imágenes por-escena generadas en el intento anterior (`story-buen-samaritano-scene-{1,2,3,4,5}.png`, excepto la escena 0 que el usuario adoptó como su cover). `tsc`+`build` limpios. — 2026-07-19

- Sesión 5p — Portada única generada y en producción: el usuario eligió generar una portada nueva (no reusar la escena 0 adoptada) representando el momento más icónico de la parábola — el samaritano vendando al herido, con el burro cargado y el camino con profundidad al atardecer. Generada con `scripts/generate-hero-art.mjs` (primer uso del pipeline nuevo), verificada visualmente: pasa el test de ojos/expresión en ambos personajes, buena profundidad y composición. Reemplaza `story-buen-samaritano.png` (la portada vieja pre-Content-Bible queda respaldada en `/tmp/story-buen-samaritano-backup-pre-hero.png`, fuera del proyecto). Verificado en el reproductor real (`/reproducir/buen-samaritano`, pantalla "en producción" ya que no hay audio): se ve la nueva portada, sin errores de consola. `data/landing-assets.json` actualizado. — 2026-07-19

- Sesión 5q — Prompt maestro único de identidad visual (decisión "cosa juzgada" definitiva): el usuario ya no quiere iterar prompts distintos por ilustración — escribió (y luego refinó él mismo) un **prompt maestro único** que define TODA la identidad visual de Lumo (estilo cinematográfico 3D, proporciones humanas ligeramente estilizadas, ojos proporcionados con párpados definidos, textura en piel/cabello/telas, iluminación cálida dorada/tierra/ámbar, profundidad de 3 planos, composición que cuenta una historia, cámara cinematográfica, vertical 9:16 nativo, lista explícita de "nunca generar"). Este prompt NUNCA menciona personajes ni escenas — cada historia solo agrega un bloque de 4 campos (Personajes/Acción/Escenario/Emoción) al final, sin tocar el resto. Se consolidó en `LUMO-CONTENT-BIBLE.md` sección 17 (reemplaza las subsecciones dispersas de Composición/Rostros/Formato por este único bloque canónico) y en código: `lib/story-style-guide.ts` (`STORY_STYLE_GUIDE` + `buildStoryPrompt(storyBlock)`, ahora recibe el bloque de 4 campos, no una descripción libre) y `scripts/generate-hero-art.mjs` (copia inline idéntica + `buildStoryBlock()` helper). El comentario en ambos archivos advierte: si se edita uno, editar el otro en la misma sesión — son una sola fuente de verdad duplicada por razones técnicas (Node no puede importar el `.ts` directo). El ejemplo de "El buen samaritano" (ya producido y aprobado) quedó comentado en `ITEMS` como referencia, no se vuelve a correr. **No se generó ninguna imagen nueva** — solo arquitectura y documentación, tal como pidió el usuario. `tsc`+`build` limpios. — 2026-07-19

- Sesión 5r — GOLD STANDARD COMPLETO: "El Buen Samaritano" con las 8 partes de la Sección 18 (decisión "cosa juzgada" — plan Creator de ElevenLabs, 121,000 créditos/mes, contratado): (1) **Narración real** generada (`node scripts/generate-content-audio.mjs buen-samaritano`, 7 segmentos con timestamps). (2) **Música ambiental**: se construyó por primera vez la biblioteca reutilizable de 6 pistas por mood (`scripts/generate-music-library.mjs`, endpoint `POST /v1/music` de ElevenLabs, 30s c/u, prompt base compartido + línea de mood) — verificados los endpoints con pruebas chicas antes de generar todo. (3) **Efectos de sonido**: biblioteca reutilizable inicial de 5 SFX (`scripts/generate-sfx-library.mjs`, endpoint `/v1/sound-generation`) — `viento-desierto` y `tela-vendaje` vinculados a los 2 momentos clave del guion vía el nuevo campo `sfx?: string` en `ContentSegment`. (4) Se creó `/api/audio-library` (lectura pública, mismo patrón que los otros endpoints de assets) y se conectó `app/reproducir/[id]/page.tsx`: música en loop a volumen 0.15 que cambia de pista según el `mood` de la escena activa, SFX puntual a volumen 0.45 disparado una vez por segmento. **Verificado en el navegador con datos reales** (no simulado): narración real reproduciéndose, música cambiando de "book" a "night" al avanzar de escena, SFX `viento-desierto` disparado y terminado correctamente — confirmado inspeccionando los 3 elementos `<audio>` en vivo. Pantalla de cierre ya verificada en sesiones anteriores. Guion e ilustración ya aprobados. **Las 8 partes de la Sección 18 están completas y verificadas por primera vez en un episodio.** Se documentó todo en `LUMO-CONTENT-BIBLE.md` sección 21 (nueva) — "Ficha de producción de referencia": voice ID, modelo, voice_settings, algoritmo de subtítulos, endpoints y prompts exactos de música/SFX, niveles de mezcla (narración~1.0/música 0.15/SFX 0.45) — este episodio es ahora el estándar por defecto para todo lo que se produzca después. `tsc`+`build` limpios (se encontró y resolvió una corrupción de caché de `.next` por el patrón ya conocido de esta sesión: parar el servidor completo, `rm -rf .next`, reiniciar limpio). — 2026-07-19

- Sesión 5s — Auditoría completa + ROADMAP oficial + replanteo de estrategia de contenido (decisiones "cosa juzgada" mayores): el usuario pidió parar y reordenar el proyecto. Se hizo una auditoría honesta de las 4 secciones pedidas (terminado/incompleto/prioridad-beta/roadmap), verificada contra el código real (ej. confirmado con `data/landing-assets.json` que las 6 escenas de la Landing siguen siendo el SVG a mano original — nunca se generaron con IA, a diferencia del resto de la app; confirmado con `data/content-audio.json` que solo "El buen samaritano" tiene las 8 partes completas, las otras 8 historias + 8 oraciones tienen audio del formato viejo corto). El usuario ajustó el roadmap propuesto: **se creó `ROADMAP.md`** (nueva fuente oficial de fases) — Landing Page es la Fase 1 (prioridad absoluta, no se avanza sin aprobación), seguida de Onboarding/Home/Explore/Prayer/Diary/Story Player/My Journey-Perfil, y **la infraestructura definitiva (Supabase, auth, Hotmart) se pospone a Fase 9, al final** — se construye primero toda la experiencia visual/funcional sobre localStorage. Regla de trabajo fijada: por cada fase → analizar → proponer → implementar → mostrar → revisar → aprobar → recién then la siguiente. **Estrategia de contenido replanteada**: los ~150 episodios quedan como visión de largo plazo, NO el objetivo actual — se agregó `LUMO-CONTENT-BIBLE.md` sección 22, "Catálogo fundacional de lanzamiento": 29 episodios totales (10 historias — las 9 existentes + 1 nueva "Rut" para no dejar vacía la categoría "Mujeres de la Biblia" que hoy solo tiene a Ester —, 8 oraciones ya escritas, 6 devocionales de los 12 planeados a largo plazo, 5 meditaciones de las 7 planeadas), cada número justificado contra huecos reales del catálogo/Explorar, no elegido al azar. Costo calculado: 147,350 créditos de producción + 29,470 de reserva de regrabación (20%) + 10,000 de experimentación = 186,820 total, repartido en 2 meses (~93,410/mes de 121,000 disponibles, ~23% de margen sin usar cada mes — nunca se gasta el 100% solo porque está disponible). **No se escribió ni generó ningún contenido nuevo en esta sesión** — fue puramente análisis y planificación, tal como pidió el usuario. — 2026-07-19

## Próximas sesiones 📋
- Sesión 5t (inmediata, pendiente de confirmación del usuario): arrancar Fase 1 del `ROADMAP.md` — Landing Page. Analizar estado actual (ya auditado: 6 escenas SVG a mano sin reemplazar, sección "La app por dentro" con texto placeholder obsoleto), proponer mejoras, implementar, mostrar, esperar aprobación antes de tocar cualquier otra pantalla.
- Después de Landing (con aprobación): producir el catálogo fundacional (`LUMO-CONTENT-BIBLE.md` sección 22) en paralelo a las fases de pantallas siguientes, priorizando lo que cada fase necesita quede listo (ej. las 8 oraciones antes de la Fase 5 Prayer).
- Sesión 6: Integraciones reales y seguridad
- Sesión 7: Testing, animaciones, pulido y rigor de entrega
- Sesión 8: Adquisición, lanzamiento y backoffice

## Pendientes del usuario (acciones que el usuario debe hacer)
- [x] ~~OPENAI_API_KEY / ADMIN_PASSWORD~~ — hecho 2026-07-17, panel /admin funcionando
- [ ] Si querés, generar por IA las 6 escenas de la landing también (hoy usan las dibujadas a mano) — mismo panel `/admin/landing`, opcional
- [ ] Cuentas de Hotmart/Supabase/Vercel, comprar dominio y pegar claves — se avisará y guiará cuando lleguemos a la Sesión 6

## Notas para la próxima sesión
- El usuario tiene un fuerte compromiso con los principios éticos del producto (no manipulación, no publicidad, no IA sin revisión humana en contenido doctrinal) — respetarlos en CADA decisión de diseño/negocio futura, especialmente en la construcción del loop de retención (24) y el paywall (no usar tácticas de culpa/urgencia).
- Contenido bíblico/doctrinal: recordar que el MVP necesita historias+reflexiones+oraciones reales revisadas por criterio bíblico — no se puede generar todo con IA sin supervisión; definir en Sesión 1 el proceso de creación de contenido (banco de historias curado vs IA+revisión).
