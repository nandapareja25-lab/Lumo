# Dashboard de producción — Lumo

Actualizado tras cada episodio. Estado real, no proyectado. Formato ampliado 2026-07-23 para
reflejar el nuevo requisito de ilustraciones por escena (ver `production/ILLUSTRATION-AUDIT.md`
para el detalle de por qué los 6 episodios de abajo muestran "1/1 · necesita expansión").

| Episodio | Texto | Ilustraciones (hechas/previstas) | Personajes usados | Versión visual | Integración | Pendientes/errores |
|---|---|---|---|---|---|---|
| S1E1 — Buenas noticias en Belén | ✅ Aprobado | 2/2 · completo | maria v1, jose-de-nazaret v1, jesus-bebe v1, angel-anunciacion v1 | Todos v1 | ✅ En reproductor | — (resuelto 2026-07-23) |
| S1E2 — Los sabios que siguieron una estrella | ✅ Aprobado | 1/1 · necesita expansión | maria v1, jesus-nino-pequeno v1, sabio-oro v1, sabio-incienso v1, sabio-mirra v1 | Todos v1 | ✅ En reproductor | Personajes de los 3 sabios sin Character Card formal |
| S1E3 — El niño que sorprendió a los maestros | ✅ Aprobado | 1/1 · prioridad baja de expansión | jesus-12-anos v1, maestro-del-templo v1 | Todos v1 | ✅ En reproductor | — |
| S1E4 — El anciano que esperó toda su vida | ✅ Aprobado | 1/1 · completo (Ana resuelta editorialmente, no visual) | simeon v1, maria v1, jesus-bebe v1 | Todos v1 | ✅ En reproductor | — (resuelto 2026-07-23) |
| S1E5 — Un viaje en medio de la noche | ✅ Aprobado | 1/1 · prioridad baja de expansión | jose-de-nazaret v1, maria v1, jesus-bebe v1 | Todos v1 | ✅ En reproductor | Paleta podría inclinarse más a tensión/peligro (pendiente no bloqueante, ya anotado) |
| S1E6 — La vuelta a casa | ✅ Aprobado | 1/1 · prioridad baja de expansión | jose-de-nazaret v1, maria v1, jesus-nino-pequeno v1 | Todos v1 | ✅ En reproductor | — |

**Temporada 1 de "La vida de Jesús": 6/6 episodios con texto e integración aprobados. 2/6
completos bajo el nuevo estándar (S1E1, S1E4), 1/6 con expansión pendiente identificada (S1E2),
3/6 de prioridad baja (S1E3, S1E5, S1E6 — escena única continua, ver ILLUSTRATION-AUDIT.md).**

## Oraciones — regeneradas por completo bajo el sistema unificado (2026-07-23)

| Oración | Ilustración | Estilo | Reemplazo |
|---|---|---|---|
| Antes de dormir | ✅ Nueva | CLAUDE.md (antes: sistema propio "fotografía emocional") | PNG viejo eliminado |
| Dar gracias | ✅ Nueva | CLAUDE.md | PNG viejo eliminado |
| Cuando tengo miedo | ✅ Nueva | CLAUDE.md | PNG viejo eliminado |
| Cuando estoy triste | ✅ Nueva | CLAUDE.md | PNG viejo eliminado |
| Antes de un examen | ✅ Nueva (nota: cuaderno abierto en vez de cerrado, no bloqueante) | CLAUDE.md | PNG viejo eliminado |
| Por mi familia | ✅ Nueva | CLAUDE.md | PNG viejo eliminado |
| Antes de comer | ✅ Nueva | CLAUDE.md | PNG viejo eliminado |
| Antes de comenzar el día | ✅ Nueva | CLAUDE.md | PNG viejo eliminado |

Las 8 no usan personajes con nombre del registro (familias genéricas sin marcadores religiosos ni
culturales específicos, según su propósito) — sí siguen las mismas proporciones heroicas, esquema
de 3 luces y catchlight que el resto del proyecto.

**Costo acumulado de la sesión: ~$4.60 de ~$40 disponibles** (8 oraciones + 1 escena nueva de
S1E1, todas aprobadas en el primer intento).

## Registro de personajes (resumen — detalle completo en `lib/character-registry.ts`)

- **12 aprobados** con Character Card formal: lumo, david, goliat, noe, buen-samaritano,
  moises, hijo-prodigo, padre-prodigo, daniel, jesus (adulto), jose, ester.
- **11 pendientes de ficha** (encontrados en producción real, documentados con lo ya generado):
  maria, jose-de-nazaret, jesus-bebe, jesus-nino-pequeno, jesus-12-anos, simeon, sabio-oro,
  sabio-incienso, sabio-mirra, maestro-del-templo, angel-anunciacion.

## Revisión de continuidad de temporada (heredado, sin cambios)

Aprobada con 2 ajustes de guion aplicados (salto temporal E2→E3 aclarado con "damos un salto de
varios años"; ambigüedad cronológica E4 vs E5 suavizada). Pendiente menor no bloqueante: la
paleta de E5 podría inclinarse más hacia tensión/peligro que hacia misterio/noche.

## Notifications Team — pendientes registrados, no bloqueantes (2026-07-23)

No bloquean a Content Team. Ver `production/notifications/FASE0-PROPUESTA.md`.

- Pasar de 2 a un mínimo de 5 variantes de texto por categoría.
- Revisar si el límite de 12 horas de anti-spam cumple realmente las reglas definidas.
- Implementar horario elegido por cada familia (hoy es un horario único fijo para todos).
- No enviar categorías que la familia no haya aprobado explícitamente.
- Mantener español neutro en todos los mensajes (auditar variantes nuevas cuando se agreguen).
- Seguir evitando rachas, culpa y reenganche agresivo en cualquier variante futura.
