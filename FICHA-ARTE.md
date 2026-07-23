# FICHA DE DIRECCIÓN DE ARTE — Ritual Espiritual Familiar (Lumo)

## Referencia del usuario (CONTRATO — protocolo 16)
- ¿Hay imagen(es) de referencia del usuario?: SÍ (parcial) → pin de Pinterest de la app "Eden – Kids Bible Stories" (no se pudo cargar el píxel directo, se investigó la app real vía web); el usuario aclaró que lo que le atrajo fue LA SENSACIÓN de calidad cinematográfica, no la técnica 3D en sí ni el estilo exacto de Eden — por eso se construyó una síntesis propia, no una copia.
- Extracción: N/A — no aplica extracción literal de hex/tipografía de la imagen (el usuario pidió explícitamente NO copiar a Eden). Lo que SÍ se tomó como contrato conceptual: iluminación cálida cinematográfica, expresividad de personajes, calma (no infantil-estridente).
- Prohibiciones anti-IA que la referencia levanta: ninguna adicional — se mantiene la disciplina de paleta acotada (11 colores) como anti-genérico.

## Identidad derivada (FUSIÓN de 10 referencias analizadas — 16 PASO 0.2bis + banco del 54 para el dispositivo)
- TABLA DE LÍDERES:
  - Eden (Kids Bible Stories) → calidad de iluminación cinematográfica (luz cálida, profundidad), NO su técnica 3D ni su falta de mascota
  - Pok Pok Playroom (Apple Design Award) → disciplina de paleta (11-12 colores), todo pintado/ilustrado a mano (no vector frío), cero presión/gamificación agresiva
  - Finch → el personaje debe sentirse VIVO por micro-detalle (respira, parpadea) y su progreso ES la historia (no puntos/monedas)
  - Pokémon Sleep (Snorlax) → un personaje grande/tranquilo/acogedor funciona para lo nocturno
  - Khan Academy Kids → personalidad clara y acotada desde el día uno, que permite sumar "elenco" después sin romper identidad
  - Sago Mini → calidez sin trucos de retención (coherente con la regla NUNCA del usuario)
  - Duolingo/Duo → el personaje debe poder vivir fuera de la app (redes, merchandising) desde el diseño inicial
  - Descartado explícitamente en la Sesión 2: firefly literal (sobreusado en apps nocturnas), búho (ya es Duo), cordero (demasiado atado a una sola tradición de fe)
  - ⚠️ REVERTIDO más adelante por el usuario (ver "Rediseño del personaje" abajo): trajo una ficha de personaje propia y detallada de una luciérnaga y decidió usarla — su personalidad y diseño concretos superan el riesgo de "sobreusado" que se había señalado. Cosa juzgada nueva.
- Combinación tipográfica: Display Fraunces (serif cálida, ejes SOFT/WONK) + Body Karla (humanista, legible) — combinación de calidez editorial validada en 29 para nichos de bienestar/storybook
- Arquetipo: el Sabio + el Inocente · Mundo del sujeto: noche, luz cálida en la oscuridad, bosque, calma contemplativa — símbolo elegido deliberadamente porque trasciende una sola tradición de fe (requisito de arquitectura multi-tradición)
- Dispositivo ownable: "Lumo", criatura nocturna inventada (no imita ningún animal real 1:1) con una luz cálida en el pecho que respira en reposo y crece con el ritual completado por la familia — la mecánica de progreso ES el personaje, no un sistema de puntos aparte

## Personalidad compilada
- 3 adjetivos: Sereno (dominante), Cálido, Entrañable
- Compilación: spring suave (bounce bajo, 0.05-0.10) · duración base ~400-500ms · exclamaciones máx 1/pantalla · celebración nivel N1-N2 (nunca N3/confetti — la celebración es la luz de Lumo creciendo) · radio tendencial 16-20px

## Brand kit final (v3 — repintado 2026-07-17, reemplaza los valores oscuros originales)
- Fondo de respaldo: #E7EFEA (detrás vive el escenario ilustrado fijo — ver `ambient-background.tsx`: cielo celeste→salvia→crema, sol, estrellas, colinas, árboles) · Tarjetas: #FFFCF5 (blanco cálido, con sombra propia) · Texto 1º: #1F3D2E (verde bosque) · Texto 2º: #5B6F60
- Acento/marca (luz de Lumo): #E0A438 (dorado vivo — CTA principal, luz del personaje, indicadores de progreso) · Secundario — crecimiento: #4E9270 (verde salvia sólido, hitos/éxito) · Nuevo: #6FA8C7 (azul cielo, variedad en badges/chips)
- Semánticos: éxito #4E9270 · error #B5432E · info #6FA8C7
- Escenas ilustradas nocturnas (`components/scenes/*`) MANTIENEN su paleta oscura interna propia (fondo #122420 etc.) — esa oscuridad vive solo dentro de esas ilustraciones ("ventana a la noche"), nunca en el chrome de la app
- Display: Fraunces (pesos 400/500/600) · Body: Karla (pesos 400/500/700) · Escala: display 26-32px / title 18-20px / body 14.5-16px / label 10-11px
- Radio: 16-20px · Profundidad: sombras difusas cálidas (nunca duras) + glow radial en el personaje · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: Lumo (receta propia, no del banco 54 — personaje-mecánica en vez de patrón de UI)
- Motion signature: easing suave tipo ease-out lento · respiración de Lumo en loop de 2.4-3.2s · sin confetti — celebración = glow radial creciendo

## Rediseño del personaje (2026-07-17, a pedido del usuario — CONTRATO)
El usuario trajo una ficha de personaje propia y completa (vistas frontal/3-4/perfil/trasera,
expresiones, poses, paleta de colores, escala junto a un niño de referencia) para "Lumo — Luciérnaga
mágica". Se aplicó como contrato de diseño en `components/app/lumo.tsx`:
- Forma: luciérnaga (ya no una criatura abstracta sin especie) — cuerpo dorado ovalado, alas
  translúcidas, dos antenas curvas con una lucecita en la punta de cada una, abdomen inferior que
  brilla (la "luz" de Lumo, animada con el mismo loop de respiración de antes).
- Cara: ojos grandes cafés con brillo blanco, sonrisa simple, parpadeo periódico (nuevo — antes no
  parpadeaba, solo respiraba el glow).
- Paleta del personaje (de la ficha): cuerpo principal dorado, detalles marrón-dorado, luz/abdomen
  amarillo-dorado brillante, ojos café oscuro, alas crema translúcida.
- Personalidad ampliada (de la ficha): curioso, amable, valiente, empático, alegre, esperanzador —
  compatible con los 3 adjetivos ya compilados (Sereno/Cálido/Entrañable), los complementa.
- Nota de la ficha del usuario a respetar siempre: "la luz de Lumo nunca desaparece, solo cambia de
  intensidad" — ya es así en el código (el glow nunca llega a opacidad 0).

## Trazabilidad y vetos
- Protocolo: se presentaron 3 direcciones iniciales (A Storybook Premium / B Animación Cinematográfica / C Naturaleza Mágica) — el usuario trajo una referencia externa (Eden) a mitad de proceso, lo que llevó a una 4ª síntesis final que fusiona lo mejor de las 3 + 10 apps referentes globales (Duolingo, Pokémon Sleep, Finch, Khan Academy Kids, Sago Mini, Pok Pok, Homer, Lingokids, Disney, Eden). Opción elegida: síntesis final "Lumo" (evolución de la dirección C, con calidad de iluminación de Eden). Página comparativa inicial: `direcciones-abc.html`. Propuesta final: `direccion-final-lumo.html` (ambas como artifacts de la sesión, no archivadas en el repo del proyecto).
- Paleta derivada de: fusión de referencias (29 + mundo del sujeto 0.45), no de un banco de dirección único
- Registro anti-repetición: paleta #122420/#1D322C/#F0A94E + par tipográfico Fraunces/Karla quedan vetados para el próximo proyecto del SO
- Modo (oscuro) DERIVADO por: el nicho "ritual nocturno" + la matriz de 29 ("oscuro casi nunca en kids, salvo modo cuento antes de dormir") — este es exactamente ese caso

## Idioma UI: Español (LATAM) · Fecha de cierre de la ficha: 2026-07-17 · Aprobada por el usuario: SÍ
