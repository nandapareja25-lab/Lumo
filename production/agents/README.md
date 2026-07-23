# Pipeline de producción de contenido — Lumo

8 roles, cada uno con un contrato de responsabilidad único. El estado real de cada episodio
vive en `production/STATUS.json` — nunca en la memoria de una conversación, para que el
proceso se pueda retomar sin repetir episodios ya terminados.

## Roles

| Rol | Hace | No hace |
|---|---|---|
| `content-planner` | Planifica temporadas/episodios, personajes, escenas, enseñanza, dependencias | No escribe texto final ni genera imágenes |
| `story-writer` | Narración, reflexión, pregunta familiar, desafío, gancho, referencias | No se auto-aprueba |
| `editorial-reviewer` | Valida claridad, edad, continuidad, relleno, lenguaje inclusivo, fidelidad, duración, spoiler del gancho | Nunca revisa texto que escribió — **siempre corre como invocación independiente, sin ver el razonamiento del escritor** |
| `visual-director` | Elige personajes/escenas, ensambla el prompt con `MASTER-PROMPT-SYSTEM.md`, chequea contra Golden Masters | No genera la imagen final |
| `image-producer` | Llama de verdad a la API de imágenes, guarda el archivo real, valida formato/dimensiones/peso, registra modelo | No puede marcar "generada" sin archivo real en disco |
| `visual-reviewer` | Revisa el archivo real contra Golden Master, personajes, escena, composición, anatomía, texto accidental, proporciones | Nunca revisa una imagen que generó — **invocación independiente** |
| `catalog-integrator` | Inserta SOLO contenido aprobado en `lib/content-catalog.ts`, corre `tsc`, verifica que todo archivo referenciado exista | No inserta nada con estado distinto de `visual_review: approved` |
| `production-manager` | Mantiene `production/STATUS.json`, coordina el orden de fases, decide cuándo un lote está bloqueado | No escribe contenido ni aprueba nada él mismo |

## Regla de independencia

`editorial-reviewer` y `visual-reviewer` son las dos únicas fases que se ejecutan como
**invocación de subagente separada** (sin contexto de cómo se escribió/generó lo que revisan) —
son los dos puntos del pipeline donde la independencia real importa. El resto de las fases
(planificación, ensamblaje de prompt, llamada a la API, integración) son deterministas —
correrlas como "otro agente" no agrega independencia real, así que se ejecutan directamente.

## Pipeline

```
plan → escritura → revisión editorial (independiente) → dirección visual →
generación real de imagen → revisión visual (independiente) → integración → pruebas
```

## Estados posibles (`production/STATUS.json`)

`planned` → `writing` → `editorial_review` → `visual_planning` → `image_generation` →
`visual_review` → `integration` → `approved` | `blocked`

Un episodio `blocked` registra el motivo exacto y no bloquea al resto del lote.
