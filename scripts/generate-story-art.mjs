// Script de un solo uso (ya corrido — histórico): generó las 15 portadas iniciales de historias y
// categorías vía OpenAI Images API. Para generar la ilustración principal de contenido NUEVO, usar
// scripts/generate-hero-art.mjs (guía de estilo actualizada con las reglas de ojos/expresión y
// formato vertical de LUMO-CONTENT-BIBLE.md sección 17 — este archivo no las tiene).
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const ROOT = process.cwd();

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) process.env[match[1]] = match[2];
    }
  } catch {
    // sin .env.local, seguimos con process.env tal cual esté
  }
}
loadEnvLocal();

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Falta OPENAI_API_KEY en .env.local");
  process.exit(1);
}

const STORY_STYLE_GUIDE = `
Estilo de render: render 3D estilo película animada infantil premium (calidad tipo largometraje
animado moderno) — NUNCA un dibujo vectorial plano ni clip-art. Volumen suave, iluminación cálida
y cinematográfica, colores dorados/ámbar predominantes con acentos de azul cielo suave o verde
salvia, profundidad de campo real, composición de "portada de libro ilustrado premium".

Personajes bíblicos: expresivos, cálidos, amigables, con proporciones suaves y amigables para
niños (nunca aterradores ni violentos, incluso en escenas de conflicto — mostrar el momento de
esperanza/coraje, no la amenaza). Ropa y escenografía con inspiración histórica del Medio Oriente
antiguo, sin ser hiperrealista.

Composición: una escena central clara, protagonista bien iluminado, fondo con profundidad
(desenfocado sutilmente), nunca texto ni letras dentro de la imagen.

PROHIBIDO SIEMPRE:
- Texto, letras, palabras o números dentro de la imagen.
- Logos, marcas de agua, marcas comerciales.
- Cualquier estilo reconocible de Disney, Pixar, Theo, Eden Kids Bible Stories, u otra IP protegida.
- Violencia gráfica, imágenes de miedo o amenaza directa — todo debe sentirse seguro y esperanzador.
`.trim();

const ITEMS = [
  {
    slug: "story-david-goliat",
    prompt:
      "Un joven pastor pequeño con una honda en la mano, de pie con valentía frente a la silueta lejana de un gigante, en un valle iluminado por un atardecer dorado.",
  },
  {
    slug: "story-noe-arca",
    prompt:
      "Un hombre bondadoso de barba blanca junto a un arca de madera enorme, con parejas de animales entrando en fila, bajo un cielo con nubes doradas.",
  },
  {
    slug: "story-buen-samaritano",
    prompt:
      "Un viajero ayudando con ternura a otro hombre herido sentado en un camino de piedra, vendándole el brazo, con un burro cerca y luz cálida de atardecer.",
  },
  {
    slug: "story-moises-mar-rojo",
    prompt:
      "Un hombre mayor con un bastón en alto frente a un camino seco abierto entre dos enormes paredes de mar, con un grupo de personas cruzando con asombro, luz dorada brillando desde arriba.",
  },
  {
    slug: "story-hijo-prodigo",
    prompt:
      "Un padre de mediana edad corriendo con los brazos abiertos para abrazar a un joven que vuelve a casa con ropa gastada, frente a una casa cálida iluminada al atardecer.",
  },
  {
    slug: "story-daniel-leones",
    prompt:
      "Un joven sereno sentado dentro de un foso de piedra, rodeado de leones grandes pero tranquilos y dóciles, con un rayo de luz cálida entrando desde arriba.",
  },
  {
    slug: "story-jesus-tormenta",
    prompt:
      "Una figura serena de pie en una pequeña barca de madera en medio de un mar agitado, con la mano extendida con calma hacia las olas, mientras el cielo se abre con luz dorada.",
  },
  {
    slug: "story-jose-hermanos",
    prompt:
      "Un hombre joven con ropas finas y coloridas abrazando con calidez a sus hermanos mayores, en un ambiente de reconciliación cálido con luz dorada de atardecer.",
  },
  {
    slug: "story-ester-reina",
    prompt:
      "Una joven reina con vestido elegante y corona sencilla, de pie con valentía y gracia frente a un trono, con luz cálida entrando por ventanas altas.",
  },
  {
    slug: "category-antiguo",
    prompt:
      "Un arca de madera antigua flotando en el mar bajo un cielo dorado con animales asomándose, composición de portada de libro.",
  },
  {
    slug: "category-nuevo",
    prompt:
      "Una cruz de madera simple en una colina al atardecer, con luz cálida dorada detrás, composición serena de portada de libro.",
  },
  {
    slug: "category-personajes",
    prompt:
      "Un grupo cálido de personajes bíblicos de distintas edades reunidos y sonriendo, con luz dorada suave, composición de portada de libro.",
  },
  {
    slug: "category-milagros",
    prompt:
      "Una pequeña barca de pescadores en un mar en calma con una luz dorada brillante descendiendo del cielo, sensación de asombro.",
  },
  {
    slug: "category-mujeres",
    prompt:
      "Una mujer bíblica valiente y serena, con vestimenta de la época, de pie con dignidad bajo una luz cálida, composición de portada de libro.",
  },
  {
    slug: "category-valores",
    prompt:
      "Dos manos sosteniendo con ternura un corazón brillante y cálido, ilustración suave y esperanzadora, sin texto.",
  },
];

async function generateOne({ slug, prompt }) {
  const fullPrompt = `${STORY_STYLE_GUIDE}\n\nEscena específica a ilustrar:\n${prompt}`;
  console.log(`Generando ${slug}...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${slug}: ${res.status} ${detail}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${slug}: sin b64_json en la respuesta`);

  const dir = path.join(ROOT, "public", "lumo-art");
  mkdirSync(dir, { recursive: true });
  const filename = `${slug}.png`;
  writeFileSync(path.join(dir, filename), Buffer.from(b64, "base64"));

  return { slug, url: `/lumo-art/${filename}`, prompt: fullPrompt };
}

async function main() {
  const dataPath = path.join(ROOT, "data", "landing-assets.json");
  const assets = JSON.parse(readFileSync(dataPath, "utf-8"));

  for (const item of ITEMS) {
    try {
      const result = await generateOne(item);
      assets[result.slug] = {
        url: result.url,
        prompt: result.prompt,
        approvedAt: new Date().toISOString(),
      };
      writeFileSync(dataPath, JSON.stringify(assets, null, 2));
      console.log(`✓ ${item.slug} guardado`);
    } catch (err) {
      console.error(`✗ ${item.slug} falló:`, err.message);
    }
  }

  console.log("Listo.");
}

main();
