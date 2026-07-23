# Registro de personajes — Lumo

Índice de todos los personajes del proyecto. Antes de crear un personaje nuevo, revisar esta
tabla para no repetir slug ni color de acento. Cada fila apunta a su Character Card completa
en este mismo directorio (`characters/[slug].md`) — este archivo es solo el índice, no repite
el contenido de la ficha.

| Slug | Nombre | Color de acento | Ficha |
|---|---|---|---|
| `lumo` | Lumo (mascota) | `#FFD740` | `characters/lumo.md` |
| `david` | David | `#C1642E` | `characters/david.md` |
| `goliat` | Goliat | `#7A5C3E` | `characters/goliat.md` |
| `noe` | Noé | `#6E7F4E` | `characters/noe.md` |
| `buen-samaritano` | El buen samaritano | `#5B7A9E` | `characters/buen-samaritano.md` |
| `moises` | Moisés | `#C9973E` | `characters/moises.md` |
| `hijo-prodigo` | El hijo pródigo | `#8A6A4E` | `characters/hijo-prodigo.md` |
| `padre-prodigo` | El padre (hijo pródigo) | `#7A8450` | `characters/padre-prodigo.md` |
| `daniel` | Daniel | `#4A5C8A` | `characters/daniel.md` |
| `jesus` | Jesús | `#D4A13D` | `characters/jesus.md` |
| `jose` | José | `#7A5C8A` | `characters/jose.md` |
| `ester` | Ester | `#C1668A` | `characters/ester.md` |

**Pendientes de una próxima pasada (personajes secundarios/grupos, fuera del alcance de la
producción del 2026-07-22):** Saúl, Eliab, esposa de Noé, el maestro de la ley, el sacerdote,
el levita, Miriam, Faraón, el rey Darío, los discípulos, los hermanos de José, Jacob,
Mardoqueo, el rey Asuero, Amán.

---

## Convención de slug

- Minúsculas, kebab-case, sin acentos ni caracteres especiales (`moises`, no `Moisés`).
- Único en todo el proyecto — es el identificador estable del personaje, se usa en nombres de
  archivo (`CLAUDE.md` §8.2) y en esta tabla. No cambia una vez asignado, aunque el personaje
  cambie de nombre visible.
- Un personaje = una fila acá + un archivo `characters/[slug].md` con su Character Card
  completa (template en `CLAUDE.md` §5.1).

## Cómo agregar un personaje nuevo

1. Elegir un slug que no esté en esta tabla.
2. Crear `characters/[slug].md` con el template de `CLAUDE.md` §5.1.
3. Agregar una fila acá con slug, nombre, color de acento y la ruta del archivo.
4. Verificar que el color de acento no se repita con ninguna fila existente.
