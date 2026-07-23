# VISUAL QA GUIDE — Control de Calidad Visual de Lumo

**Estado: SUPERADO por `CLAUDE.md` (2026-07-22).** Sus criterios ya no reflejan la dirección de arte
vigente (ver `CLAUDE.md` §10 para el checklist oficial actual) — queda como historial.

**Complementaba a `ART-BIBLE.md`.** La Art Bible definía cómo debía verse Lumo. Esta guía definía cómo
detectar cuando una imagen no cumplía ese estándar — con criterios objetivos, no con el criterio del
momento. Toda ilustración nueva (historia, oración, escena familiar o landing) pasa por esta guía
antes de incorporarse al producto.

---

## Cómo usar esta guía

1. Genera la imagen a tamaño completo y también en miniatura (80px de ancho) — algunos criterios
   solo se evalúan en miniatura.
2. Recorre los 10 criterios de la sección siguiente, uno por uno, marcando ✅ / ⚠️ / ❌.
3. Aplica el veredicto final (sección "Regla de decisión").
4. Si el resultado es ❌ en algún criterio, no se aprueba — se ajusta y se vuelve a evaluar desde
   cero, no solo en el criterio que falló (un ajuste puede afectar otro).
5. Registra el resultado (sección "Ficha de evaluación") para construir memoria — esto evita
   repetir el mismo error de generación en el futuro.

---

## Los 10 criterios

### 1. ¿La emoción se entiende en menos de un segundo?

Qué se evalúa: si al ver la imagen (a tamaño completo) por primera vez, sin leer texto ni pensar,
se identifica de inmediato qué siente el personaje protagonista.

- ✅ **Aprobado**: en "El umbral", el padre tiene cejas caídas y hombros vencidos — se lee cansancio
  con cuidado en menos de un segundo, sin necesidad de ver la escena completa.
- ⚠️ **Aceptable**: la emoción se entiende, pero requiere mirar la cara con atención porque el
  cuerpo no acompaña el gesto (postura neutra con rostro expresivo) — pasa, pero se anota para
  reforzar en la próxima escena similar.
- ❌ **Rechazado**: rostro en reposo/neutro, o una sonrisa genérica que podría pertenecer a
  cualquier escena — no hay una emoción específica que identificar.

### 2. ¿Funciona correctamente a 80px?

Qué se evalúa: la prueba de miniatura obligatoria del Art Bible (sección 5 / 12 / 15).

- ✅ **Aprobado**: a 80px de ancho, se distingue quién es el personaje, qué siente, y el color de
  acento de la categoría sigue siendo reconocible.
- ⚠️ **Aceptable**: se distingue la emoción y el personaje, pero un detalle secundario (una prenda,
  un objeto de evidencia de vida) se pierde — aceptable si ese detalle no es central a la historia.
- ❌ **Rechazado**: a 80px la imagen se vuelve una mancha de color sin lectura clara — típicamente
  por exceso de detalle de fondo compitiendo con el personaje, o por un encuadre demasiado abierto
  para el formato.

### 3. ¿El personaje pertenece claramente al universo visual de Lumo?

Qué se evalúa: coherencia de proporciones, materiales y luz contra `ART-BIBLE.md` secciones 2-5.

- ✅ **Aprobado**: mismas proporciones de cabeza/cuerpo, mismo tratamiento de piel y luz que el
  resto del elenco ya aprobado (ej. las cinco escenas familiares validadas esta sesión).
- ⚠️ **Aceptable**: el personaje es reconocible como parte de Lumo pero el nivel de brillo/pulido
  del render se desvía levemente del resto del catálogo — aceptable solo si es una primera prueba
  de un lote nuevo, no para producción final.
- ❌ **Rechazado**: el personaje parece de otro "estudio" — esto pasó literalmente esta sesión con
  el primer lote de escenas familiares (proporción y brillo tipo "gran estudio de animación premium"
  distinto a "El umbral"), y tuvo que regenerarse.

### 4. ¿La composición dirige la mirada?

Qué se evalúa: si hay un punto focal claro y un recorrido de lectura (regla de tercios, líneas de
fuerza) — Art Bible sección 7.

- ✅ **Aprobado**: en "El silencio de después", el pasillo oscuro conduce el ojo directamente hacia
  el rectángulo de luz de la puerta — no hay ambigüedad sobre dónde mirar primero.
- ⚠️ **Aceptable**: hay un punto focal, pero compite levemente con un segundo elemento de brillo o
  contraste similar — se aprueba si el elemento secundario no es una distracción real en contexto
  de uso (ej. dentro de una tarjeta chica donde igual se recorta).
- ❌ **Rechazado**: el personaje está centrado de frente sin ningún elemento que guíe la mirada más
  allá de él — composición "de foto carnet", no de cine.

### 5. ¿La iluminación ayuda a contar la historia?

Qué se evalúa: si la luz tiene una fuente dominante identificable y esa fuente tiene sentido
narrativo (Art Bible sección 5).

- ✅ **Aprobado**: la lámpara de "Leyendo juntos" no solo ilumina — separa al padre y al hijo del
  resto del living en penumbra, reforzando que ese es el único punto de atención emocional.
- ⚠️ **Aceptable**: la fuente de luz es identificable pero no aporta significado adicional más allá
  de iluminar — correcto técnicamente, sin ser memorable.
- ❌ **Rechazado**: luz ambiente pareja sin fuente identificable, o múltiples fuentes de igual
  intensidad que aplanan la escena — la luz no dirige nada ni construye atmósfera.

### 6. ¿El fondo acompaña sin competir?

Qué se evalúa: nivel de detalle y contraste del fondo relativo al personaje, según el formato
(Art Bible sección 12).

- ✅ **Aprobado**: en una tarjeta de catálogo, el fondo es un wash simple y desenfocado — todo el
  detalle y nitidez está en el personaje.
- ⚠️ **Aceptable**: el fondo tiene un elemento nítido secundario (una ventana, un mueble) pero en
  menor contraste que el personaje — aceptable en formatos grandes (hero), no en miniaturas.
- ❌ **Rechazado**: el fondo tiene el mismo nivel de detalle y nitidez que el personaje — típico
  error de "escenografía de catálogo" que compite en vez de subordinarse.

### 7. ¿La escena transmite una microhistoria?

Qué se evalúa: si se percibe un antes y un después implícitos (Art Bible principio 9).

- ✅ **Aprobado**: en "Arropar cama", el gesto de la mano ajustando la manta y el padre a mitad de
  inclinarse hacia atrás implican claramente que un instante atrás estaba más cerca, y un instante
  después se va a ir.
- ⚠️ **Aceptable**: se percibe una acción, pero es genérica (un personaje "caminando", "sentado")
  sin un instante específico que la ancle — pasa si el resto de la escena compensa con emoción clara.
- ❌ **Rechazado**: el personaje posa — de pie, mirando al frente, sin ninguna acción en curso. No
  hay antes ni después que completar.

### 8. ¿Podría confundirse con otra app o tiene identidad propia?

Qué se evalúa: reconocibilidad sin logo ni texto (Art Bible, objetivo general).

- ✅ **Aprobado**: la combinación de luz cálida de una fuente + espacio doméstico o bíblico habitado
  + gesto a mitad de acción + paleta ámbar modulada se reconoce como Lumo sin ver ningún texto.
- ⚠️ **Aceptable**: la escena es correcta pero suficientemente genérica (ej. un primer plano de
  manos sin contexto) que podría pertenecer a cualquier app de bienestar — aceptable solo para un
  detalle secundario dentro de una pieza más grande, nunca como imagen principal.
- ❌ **Rechazado**: la escena podría pasar por cualquier app de storytelling infantil genérica —
  esto fue exactamente el motivo del pilotaje de libro-ilustrado que se descartó esta sesión: no
  fallaba técnicamente, pero no tenía identidad propia distinguible.

### 9. ¿Respeta la lista de prohibidos del Art Bible?

Qué se evalúa: verificación directa contra `ART-BIBLE.md` sección 14.

- ✅ **Aprobado**: cero elementos de la lista de prohibidos presentes.
- ⚠️ **Aceptable**: no aplica — este criterio no admite término medio.
- ❌ **Rechazado**: cualquier presencia de mirada a cámara sin motivo, iconografía religiosa
  literal, dispositivo iluminado, texto/logo, o anacronismo. Ejemplo real de esta sesión: la primera
  versión de la escena "Testimonio" tenía un teléfono visiblemente encendido en la mano de la madre
  — rechazada y regenerada por esta razón exacta.

### 10. ¿Hay evidencia de vida visible?

Qué se evalúa: al menos 1-2 detalles domésticos/cotidianos reales y específicos (Art Bible sección
11, principio 10).

- ✅ **Aprobado**: la zapatilla abandonada al pie de la escalera en "El umbral", o el camión de
  madera y la taza en "Leyendo juntos".
- ⚠️ **Aceptable**: hay un detalle, pero es genérico y podría estar en cualquier escena (un cojín
  sin marca de uso) — pasa, pero se anota para pedir más especificidad la próxima vez.
- ❌ **Rechazado**: la escena está "limpia" como foto de catálogo inmobiliario, sin ningún objeto
  que sugiera que alguien vive ahí.

---

## Regla de decisión

- **Cualquier ❌ en los criterios 1, 3, 7 o 9** → rechazo automático, no se aprueba bajo ninguna
  circunstancia (son los que más rompen identidad o violan reglas explícitas).
- **Cualquier ❌ en 2, 4, 5, 6, 8 o 10** → rechazo, pero es un ajuste de composición/luz puntual, no
  necesariamente hay que rehacer todo el personaje.
- **1-2 ⚠️ en total** → aprobado, con nota registrada para mejorar en el próximo lote.
- **3 o más ⚠️** → no se aprueba todavía — aunque ningún criterio reprobó individualmente, la suma
  indica que la pieza está por debajo del estándar general.

---

## Ficha de evaluación (plantilla)

```
Imagen: ____________________   Fecha: ____________
Formato de destino: [ ] ícono  [ ] tarjeta  [ ] hero

1. Emoción en <1s .................. [ ✅ / ⚠️ / ❌ ]
2. Funciona a 80px .................. [ ✅ / ⚠️ / ❌ ]
3. Pertenece al universo Lumo ....... [ ✅ / ⚠️ / ❌ ]
4. Composición dirige la mirada ..... [ ✅ / ⚠️ / ❌ ]
5. Iluminación cuenta la historia ... [ ✅ / ⚠️ / ❌ ]
6. Fondo acompaña sin competir ...... [ ✅ / ⚠️ / ❌ ]
7. Hay microhistoria ................ [ ✅ / ⚠️ / ❌ ]
8. Identidad propia (no genérica) ... [ ✅ / ⚠️ / ❌ ]
9. Respeta lista de prohibidos ...... [ ✅ / ⚠️ / ❌ ]
10. Evidencia de vida ................ [ ✅ / ⚠️ / ❌ ]

Veredicto: [ APROBADA / APROBADA CON NOTA / RECHAZADA ]
Nota (si aplica): ___________________________________
```
