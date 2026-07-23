# ROADMAP OFICIAL — Lumo

Fuente única de verdad del orden de desarrollo. No se avanza a la siguiente fase sin aprobación
explícita del usuario. Cambios acá son decisiones "cosa juzgada" — se registran acá y en
ESTADO.md.

## Forma de trabajar

**Desde el 2026-07-21, el criterio de avance cambió de "pantalla por pantalla" a "funcionalidad
por funcionalidad"** (decisión explícita del usuario) — la etapa de diseño visual (Vigilia) está
cerrada; ahora cada frente de la etapa de Infraestructura/Contenido/Lanzamiento (producción de
oraciones, producción de historias, sistema de pagos, sistema de cuentas, etc.) se trabaja como
su propia unidad, no atada a una pantalla en particular. El método sigue siendo el mismo:

1. Auditoría del estado actual de esa funcionalidad (qué existe, qué falta, qué es real vs. simulado).
2. Propuesta de arquitectura concreta.
3. Aprobación explícita del usuario.
4. Implementación.
5. Verificación real (nunca "debería funcionar").

No se avanza a la siguiente funcionalidad sin aprobación explícita.

## ✅ Etapa de exploración de producto — CERRADA el 2026-07-22

Entre el 2026-07-22 y el cierre de esta etapa, el usuario pausó toda implementación nueva para
definir qué es Lumo antes de seguir agregándole funciones. De ahí nacieron, en orden:

1. **`LUMO-FILOSOFIA.md`** — documento nuevo, de mayor autoridad que `BRAND-DNA.md` y este
   roadmap. Define por qué existe Lumo (no un vacío de contenido, sino la brecha entre la
   intención de un padre agotado y su energía real al final del día). Incluye su propia regla de
   enmienda (sección 0): no cambia por buenas ideas, solo si se descubre que una convicción
   fundamental estaba equivocada.
2. **`BRAND-DNA.md` principios 1 y 2** (el resto renumerado 3-14): "El adulto es el anfitrión del
   momento" y "El recuerdo pertenece a la familia" — la decisión fundacional de que el usuario
   real de Lumo es el padre/madre agotado, no el niño, que solo participa del momento.
3. **Investigación de mercado real** (Bible App for Kids, Hallow, Glorify, Pray.com, Abide,
   apps de "Bedtime Bible Stories", Sam/Bible Chat Kids) — ninguna combina adulto-anfitrión +
   recuerdo-sobre-métricas + anti-gamificación como postura. Conclusión: Lumo no compite por
   tiempo de pantalla, compite por tiempo de presencia — espacio hoy desatendido, no copiado de
   nadie.
4. **Auditoría crítica de 10 ideas pendientes** contra `LUMO-FILOSOFIA.md`, con una regla de
   triage nueva (Integridad / Expresión / Producto — ver abajo).

### Sistema de gobierno del producto — congelado desde 2026-07-22

No se abren documentos nuevos ni se amplían estos tres, salvo evidencia muy fuerte de que una
convicción fundamental es incorrecta:

1. **`LUMO-FILOSOFIA.md`** — por qué existe Lumo. Mayor autoridad.
2. **`BRAND-DNA.md`** — cómo se expresa esa filosofía.
3. **`ROADMAP.md`** (este documento) — qué se construye y cuándo.

### Regla de triage (permanente) — clasificar antes de evaluar

Toda idea nueva se clasifica primero en una de estas tres categorías, **antes** de decidir si pasa
por el filtro completo:

- **Integridad**: corrige una promesa o una verdad del producto. Se corrige directamente como
  tarea — no compite por espacio mental con funciones nuevas, no se prioriza como "idea".
- **Expresión**: mejora cómo Lumo ya expresa una decisión tomada (paleta, ilustración, pulido del
  personaje) — pertenece a `BRAND-DNA.md`, no reabre nada de `LUMO-FILOSOFIA.md`.
- **Producto**: cambia realmente lo que Lumo es o hace. **Solo esta categoría pasa por el filtro
  completo Filosofía → BRAND-DNA → ROADMAP** (`LUMO-FILOSOFIA.md`: ¿reduce o aumenta el costo de
  presencia?). No descartar la categoría completa por la implementación más común del mercado —
  preguntar qué necesidad humana real resuelve que el átomo de Lumo (una voz narrando algo, de
  noche, en familia) no resuelva ya.

### Resultado del triage de las 10 ideas (2026-07-22)

- **Tareas de integridad, pendientes** (no compiten con features): revisar/corregir "10 minutos"
  en el copy de la landing; verificar que `durationSeconds` de cada historia/oración coincida con
  el audio real generado.
- **Expresión, quedan donde ya estaban** (no son ideas nuevas): mejorar el color marrón, mejorar
  las ilustraciones (unidad editorial ya prevista), mejorar la luciérnaga (con el riesgo señalado
  de no convertirla en protagonista).
- **Descartadas, hasta que aparezca evidencia nueva**: encontrar "un diferenciador más fuerte" (ya
  resuelto con investigación real), Meditaciones, Rosario.
- **Preguntas abiertas — NO son features pendientes, no vuelven al roadmap automáticamente**:
  - *Series*: ¿puede existir una forma de serialidad donde cada noche termine con paz y no con
    suspenso?
  - *Canciones*: ¿resuelven una necesidad humana distinta de la que ya cubren historias y
    oraciones?
  
  Se retoman solo cuando exista evidencia real o contenido que las justifique — no antes.

Con la filosofía y el gobierno del producto cerrados, la etapa siguiente vuelve a ser
implementación, no exploración. Toda propuesta futura parte de este sistema (Filosofía → BRAND-DNA
→ ROADMAP) y no lo cuestiona salvo razón excepcional.

### Orden de trabajo (desde 2026-07-22) — "terminamos lo que decidimos antes de decidir algo nuevo"

- **Fase 1 — Integridad** ✅ CERRADA el 2026-07-22 (ver "Etapa actual — Infraestructura, contenido
  y lanzamiento" abajo para el detalle: duraciones reales corregidas + "10 minutos" del landing
  corregido).
- **Fase 2 — Completar lo ya decidido, solo dentro del producto/repo actual** (reordenada
  2026-07-22 — razón del usuario: *"quiero validar y terminar la experiencia antes de agregar la
  complejidad operativa de convertirla en un producto conectado"*):
  1. Ilustraciones de oraciones.
  2. Limpieza de infraestructura y código muerto.
  3. Revisión final de contenido, audio, copy y navegación.
  4. QA completo de la experiencia local.

  **Explícitamente fuera de Fase 2, van al final (Fase 2.5), recién cuando 1-4 estén cerrados**:
  autenticación, Resend, pagos, persistencia real de acceso, configuración/despliegue en Vercel —
  ninguna auditoría de proveedores ni propuesta de arquitectura de producción (Stripe, Resend,
  bases de datos) hasta entonces. Mientras tanto, `hasAccess`, login y pagos siguen locales/
  simulados, sin que eso interfiera con el resto de la experiencia.
- **Fase 3 — Construcción**: solo al terminar la Fase 2 completa se vuelve a evaluar
  funcionalidad nueva. Series y Canciones siguen como preguntas abiertas (no backlog, no tareas) —
  no reaparecen hasta que exista evidencia real que justifique reabrir la conversación.

## Etapa "Vigilia" (identidad visual) — ✅ CERRADA el 2026-07-21

No se retoma trabajo de identidad visual salvo ajustes puntuales — ver `ESTADO.md` sección "Cierre
de la etapa Vigilia" para el detalle completo de qué se hizo y qué se auditó. Tabla de referencia:

| Módulo | Estado |
|---|---|
| Landing Page | Vigilia real implementada en `app/page.tsx`. |
| Reproductor (`/reproducir/[id]`) | Compartido entre historias y oraciones. Gatea acceso (`isGated`, `freeStoryId`, `hasAccess`). |
| Orar | Arquitectura audio-first. |
| Diario | Concepto de "álbum de momentos" — se llena recién siendo suscriptor. |
| Home | Escena única en vez de dashboard *(revertido parcialmente el 2026-07-22 — ver nota abajo)*. |
| Explorar | Solo catálogo real de lanzamiento, sin señales de roadmap futuro. |
| Mi Camino | Narrativa curada en vez de dashboard de racha/logros. |
| Perfil | Pantalla utilitaria; se corrigió el botón que borraba todo sin avisar. |
| Onboarding | Bajó de 6 pasos a 2 (nombre → llegada); termina entrando a Home. |
| Paywall | Mensaje emocional en vez de lista de funciones; conectado de verdad al gateo de acceso. |
| Login | Movido a la fase de Infraestructura — no forma parte de ninguna experiencia real hoy. |

**Nota (2026-07-22)**: el usuario pidió explícitamente revertir parte de la decisión de Home —
quiere el catálogo completo por secciones ahí mismo ("Mostrar el catálogo completo ahí mismo"),
no solo la escena de esta noche con links de salida. Se implementó: Home mantiene la escena de
"esta noche" arriba (sin cambios), y debajo agrega las mismas secciones que Explorar (Oraciones /
Categorías / Historias), reutilizando los mismos componentes (`PrayerPoster`, `StoryPoster`,
`EXPLORE_CATEGORY_CARDS`, extraído a `lib/explore-categories.ts` para no duplicar data entre las
dos pantallas). Las tarjetas de categoría en Home deep-linkean a
`/app/explorar?categoria=<id>`, que ahora lee ese query param y arranca ya filtrado. Se marca como
reversión consciente, no como corrección de un error — la decisión original de Vigilia sigue
siendo válida como registro histórico de por qué se hizo así en su momento.

## Etapa actual — Infraestructura, contenido y lanzamiento (desde 2026-07-21)

El foco deja de ser "rediseñar Lumo" y pasa a ser "terminar Lumo". Funcionalidades identificadas
(cada una es su propia unidad de auditoría → arquitectura → aprobación → implementación; el orden
se decide explícitamente antes de arrancar cada una, no se asume):

- [x] **Producción de oraciones — audio** ✅ CERRADA el 2026-07-21 — narración real (ElevenLabs)
  generada para las 8 oraciones (31 segmentos), verificada en vivo en el reproductor. Ver
  `ESTADO.md` sección "Producción de oraciones (audio) — cerrada" para el detalle completo.
  **Pendiente aparte, unidad propia**: arte de las 8 oraciones (`illustrationSlug` tipo
  `prayer-*`) — hoy sin registrar, cae al fallback `MoodScene` (oficial hasta que esa unidad se
  complete).
- [x] **Reescritura de guiones de Historias** ✅ CERRADA el 2026-07-21 — las 7 historias con
  guiones stub (`noe-arca`, `moises-mar-rojo`, `hijo-prodigo`, `daniel-leones`, `jesus-tormenta`,
  `jose-hermanos`, `ester-reina`) reescritas a la altura narrativa de `david-goliat`/
  `buen-samaritano`, bajo la regla editorial "caminar junto a los personajes, no contar lo que
  pasó". Las 9 historias del catálogo fundacional tienen ahora guion completo y consistente. Ver
  `ESTADO.md` sección "Reescritura de guiones de Historias — cerrada" para el detalle.
- [x] **Producción de historias — audio** ✅ CERRADA el 2026-07-21 — las 9 historias del catálogo
  fundacional tienen narración real (ElevenLabs). Ver `ESTADO.md` sección "Producción de historias
  (audio) — cerrada" para el detalle.
- [x] **Ilustraciones de oraciones** ✅ CERRADA el 2026-07-22 — las 8 generadas (1024×1536,
  ninguna muestra a Lumo, regla de "fotografía emocional", nadie mira a cámara), registradas en
  `data/landing-assets.json` y verificadas en Explorar y en el reproductor. Único ajuste aceptado
  tal cual pese a duda editorial: `prayer-antes-de-comenzar-el-dia` tiene más objetos de cocina en
  cuadro de lo ideal (bowl/jarra/pan) — el usuario decidió dejarla así.
  **Segunda pasada de dirección artística (mismo día)**: el usuario rechazó el estilo "cinemático
  3D realista" original (demasiado fotorrealista, no coincidía con las 15 ilustraciones de
  historias ya existentes) y pidió que las oraciones fueran indistinguibles de esa familia visual.
  Se analizaron 3 referencias reales (`story-david-goliat`, `story-noe-arca`,
  `story-daniel-leones`) y se reescribió `STORY_STYLE_GUIDE` (`lib/story-style-guide.ts` +
  copia idéntica en `scripts/generate-hero-art.mjs`) para describir intención artística (personajes
  estilizados, formas simples, nunca fotorrealista) en vez de rasgos físicos literales — más 2
  reglas nuevas: la emoción se lee primero que el detalle (debe funcionar en miniatura), y cada
  imagen es un instante ocurriendo, nunca una pose (fotograma de película, no publicidad). Las 8
  oraciones se regeneraron con esta guía corregida y quedaron visualmente consistentes con el
  catálogo de historias — verificado en Explorar.
- [x] **Segunda pasada de oraciones (dialecto/duración/bug de subtítulos)** ✅ CERRADA el
  2026-07-22 — ver `ESTADO.md` sección "Segunda pasada de oraciones" para el detalle completo.
  `antes-de-comer` (50s) y `antes-de-comenzar-el-dia` (55s) quedan tal cual, aceptado
  explícitamente por el usuario aunque estén debajo del piso de 60s — son las oraciones
  naturalmente más breves del lote.
- [x] **Tarea de integridad — copy "10 minutos" en la landing** ✅ CERRADA el 2026-07-22 — el
  audio real de una historia promedia ~4.2 min (rango 2.4-6.4 min), no 10. Se quitó el número
  falso de `app/page.tsx` ("Un momento cada noche que acerca a tu familia a Dios") y de la meta
  `description` en `app/layout.tsx`. Verificado en vivo.
- [x] **Tarea de integridad — verificar `durationSeconds` real de historias/oraciones** ✅ CERRADA
  el 2026-07-22 — medido con `ffprobe` contra los mp3 reales de las 17 historias/oraciones con
  audio generado; los 17 valores estaban sobreestimados (ej. `jose-hermanos` decía 400s, el audio
  real mide 269s) y se corrigieron en `lib/content-catalog.ts`. Verificado con `tsc --noEmit`
  limpio.
- [ ] **Exploración de identidad visual (EN CURSO, no es una migración todavía)** — abierta el
  2026-07-22 tras encontrar una tensión real entre la filosofía de Lumo y el lenguaje visual
  actual (render 3D cinematográfico): la ilustración se siente "cine infantil" mientras la
  tipografía/tono son "editorial adulto contemplativo" — dos registros que no hablan con una sola
  voz. Se comparó la dirección actual contra una hipótesis de "libro ilustrado pintado" (acuarela/
  gouache, sin render 3D) en 6 ejes (calidez, contemplación, presencia del adulto, relación con la
  tipografía, diferenciación competitiva, longevidad) — las 6 favorecen el libro ilustrado, y 3 de
  ellas (presencia del adulto, contemplación, tipografía) son isomorfas a principios ya ratificados
  en `BRAND-DNA.md`/`LUMO-FILOSOFIA.md`, no solo preferencia estética. Se generó un piloto aislado
  (`scripts/generate-pilot-storybook.mjs`, NO toca `STORY_STYLE_GUIDE` canónico) y se probó en vivo
  en el reproductor/Explorar (swap temporal de `illustrationSlug`, ya revertido — catálogo
  canónico intacto). **División de trabajo acordada**: Claude lidera dirección artística, lenguaje
  visual, escenas, emoción, reglas editoriales y criterios de consistencia; el usuario itera el
  prompt técnico de generación por su cuenta hasta encontrar una imagen que "se sienta Lumo" — el
  prompt maestro nace por ingeniería inversa de esa imagen, no al revés. Solo cuando eso pase se
  actualiza `FICHA-ARTE.md`/`BRAND-DNA.md` formalmente y se decide si se migra el catálogo. Hasta
  entonces, el catálogo de render 3D sigue siendo el vigente — esto es exploración, no migración.

  **Corrección de dirección de arte dentro del mismo lenguaje visual (2026-07-22)**: tras probar el
  piloto de libro ilustrado, el usuario concluyó que el problema no es el lenguaje 3D estilizado en
  sí — es la dirección de color/luz/atmósfera del sistema actual. Se mantiene el render 3D
  estilizado; se corrigen 5 problemas concretos identificados en `STORY_STYLE_GUIDE`:
  1. Se simplificó forma Y material a la vez — hay que devolver fidelidad de material (piel con
     translucidez en bordes, telas con peso real) sin perder la simplicidad de forma.
  2. Los planos son casi todos primeros planos muy cerrados, sin aire compositivo.
  3. La regla de "paleta dominada por ámbar/tierra/dorado" aplica a toda la imagen (luz y sombra
     por igual), aplanando todo al mismo tono.
  4. Correlato del punto 3: falta contraste cálido/frío (luz cálida + sombra o ambiente más fresco).
  5. Se usa la misma plantilla de luz (cuarto oscuro + una lámpara chica) para toda emoción, sin
     distinguir escenas de consuelo/miedo (pozo de luz chico, correcto) de escenas de
     gratitud/esperanza (deberían tener mucha más superficie iluminada).

  **Dos principios editoriales nuevos, para guiar la iteración del usuario sobre el prompt
  técnico** (no se tocó `STORY_STYLE_GUIDE` ni ningún script de generación — son reglas de
  dirección, el usuario decide cuándo convertirlas en prompt):
  - **La identidad vive en el comportamiento de la luz, no en el color**: ninguna escena está
    obligada a teñirse de ámbar — un cielo puede ser azul, una pared blanca, un bosque verde, una
    habitación gris, y seguir siendo inconfundiblemente Lumo si la luz se comporta siempre igual
    (cálida, suave, de una sola fuente, íntima, con motivo narrativo). La luz modula los colores
    del mundo, pero no los reemplaza — no se busca realismo, sino que cada elemento conserve su
    identidad cromática dentro de un lenguaje estilizado. Reemplaza la restricción de paleta
    actual por una restricción de comportamiento de luz.
  - **Variedad cinematográfica del catálogo**: el catálogo, visto en conjunto, debe presentar una
    variedad deliberada de escalas de plano, composiciones, perspectivas y atmósferas — alternando
    planos abiertos/cerrados, interior/exterior, distintos momentos del día cuando la historia lo
    permita, distinta altura/ángulo de cámara, y aire deliberado en la composición. El objetivo es
    que el catálogo se sienta como fotogramas reales de una misma película, no la misma
    composición repetida con distintos personajes.

  **Lienzo claro adoptado en toda la app (2026-07-22)**: tomando como referencia visual (no de
  marketing/estructura) la landing de Theo (theopray.com/es) — lienzo luminoso, separación clara
  entre UI e ilustración — se probó un piloto en Home reemplazando el fondo oscuro por un blanco
  cálido (`#FAFAF8`, no crema ni blanco puro). El usuario lo aprobó ("la app se siente más ligera,
  moderna, las ilustraciones tienen más protagonismo") y pidió extenderlo a toda la app, no
  quedarse solo en Home. Se aplicó a Home, Explorar, Mi Camino, Diario, Orar, Perfil e Historia:
  se quitó `WorldBackdrop` (fondo de mundo oscuro de borde a borde) de las 5 pantallas que lo
  usaban, fondo/texto pasaron a `#FAFAF8`/`#2A1F17`, texto secundario a `#6B5A4A`, acento gold
  oscurecido a `#B8791F` para mantener contraste sobre el fondo claro, tarjetas pasaron a blanco
  con sombra suave (`rgba(42,31,23,0.18)`) para dar sensación de profundidad. El nav inferior
  (`components/app/bottom-nav.tsx`) pasó a un solo estilo claro para toda la app (ya no depende de
  la ruta). Las pantallas de ilustración a pantalla completa (reproductor durante la reproducción,
  estados "gateado"/"pendiente de audio") mantienen su tratamiento oscuro existente — la
  ilustración + degradé oscuro para legibilidad del texto blanco no cambió, porque ahí la
  ilustración sigue siendo la superficie dominante, no el lienzo. Verificado visualmente en las 7
  pantallas, `tsc --noEmit` limpio.

  **Landing pública migrada también (mismo día)**: `app/page.tsx` y `components/app/
  landing-pricing.tsx` pasaron al mismo lienzo `#FAFAF8`/texto `#2A1F17`/acento oscurecido
  `#B8791F`. Las dos secciones de imagen a pantalla completa (hero con la madre y su hija, y "El
  buen samaritano" como fotograma) mantuvieron su tratamiento oscuro — mismo criterio que en el
  resto de la app: donde la ilustración domina la pantalla, se queda oscura; donde domina el
  lienzo, es clara. Bug real encontrado y corregido en el proceso: el título del hero heredó el
  color de texto oscuro del wrapper y quedó ilegible sobre la foto nocturna — se le puso color
  explícito claro (`#F6ECD9`) porque ese texto específico sigue estando sobre una imagen oscura,
  no sobre el lienzo. Verificado visualmente de punta a punta (hero, escena, reproductor mockup,
  precio, FAQ, footer), `tsc --noEmit` limpio. **Pendiente de decisión del usuario**:
  `components/app/world-backdrop.tsx` quedó sin ningún uso en pantallas reales — candidato a la
  limpieza de infraestructura.
- [ ] **Sistema de pagos** — reemplazar el `unlockAccess()` simulado de Paywall por integración
  real (Hotmart u otra pasarela).
- [ ] **Sistema de cuentas** — Supabase, autenticación real (crear cuenta / iniciar sesión /
  restaurar acceso / cambiar de dispositivo / cerrar sesión / recuperación — un solo sistema, Login
  se diseña acá), sincronización real reemplazando localStorage.
- [ ] **Limpieza de infraestructura de código** — borrar componentes muertos (`landing-scene.tsx`,
  `reveal.tsx`, `sticky-cta.tsx`), consolidar un `LumoButton` compartido (el gradiente cálido está
  duplicado en varios archivos), unificar tokens/gradientes, quitar la clase `.dark` vestigial de
  `globals.css`.
- [ ] **Preparación de lanzamiento** — checklist de go-live cuando el resto esté listo.

Regla explícita del usuario (2026-07-20): no refactorizar infraestructura compartida mientras
todavía se estén migrando pantallas — ya no aplica (la migración de pantallas terminó), pero queda
registrada como precedente.

Regla explícita del usuario (2026-07-21): la autenticación (crear cuenta / iniciar sesión /
restaurar acceso / cambiar de dispositivo / cerrar sesión / recuperación) se diseña como un solo
sistema cuando exista infraestructura real — no se resuelven esas piezas por separado antes.

## Estrategia de contenido (vigente desde 2026-07-19)

**Los 150 episodios son la visión de largo plazo, NO el objetivo actual.** El objetivo ahora es una
**colección fundacional pequeña, coherente y premium** para el lanzamiento — ver
`LUMO-CONTENT-BIBLE.md` sección 22 para el detalle completo (catálogo mínimo + plan de créditos).
No se retoma el objetivo de 150 hasta después del lanzamiento, con aprobación explícita del
usuario.

**Regla de contenido de temporada (2026-07-22, sin implementar — no hay episodios producidos
todavía)**: la colección "Series Especiales" (Adviento, Navidad, Semana Santa, Pascua, planes de
varios días — ver `lib/content-library.ts`) solo debe mostrarse en Home/Explorar durante su
temporada real de calendario, nunca todo el año junto al contenido evergreen. Se construye el
filtro por fecha desde el primer episodio que se produzca de esta colección, no después.

---

*Creado: 2026-07-19. Reemplaza cualquier plan de fases anterior mencionado en ESTADO.md.*
