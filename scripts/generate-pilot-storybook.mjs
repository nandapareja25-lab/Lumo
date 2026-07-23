// Script de experimento AISLADO (2026-07-22) — NO toca STORY_STYLE_GUIDE canónico ni
// generate-hero-art.mjs. Genera una sola ilustración piloto con lenguaje de libro ilustrado
// pintado, para comparar en la app real contra la versión 3D actual antes de decidir si se
// adopta como nueva dirección visual. Ver ROADMAP.md / conversación del 2026-07-22.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const ROOT = process.cwd();
const raw = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
for (const line of raw.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Falta OPENAI_API_KEY en .env.local");
  process.exit(1);
}

const PILOT_STYLE_GUIDE = `
Ilustración de libro ilustrado contemporáneo, pintada a mano — acuarela y gouache sobre papel con
textura visible, nunca un render 3D ni una fotografía. La pincelada debe ser visible y honesta,
no vectorial ni digital-limpia.

Personajes con proporciones suaves y expresivos, pero resueltos con manchas de color y luz, no con
modelado tridimensional — como una lámina de libro infantil de calidad literaria, no una escena de
película animada.

Paleta: noche azul profundo, luz cálida de vela o lámpara, tierra y madera, papel crudo y crema, un
verde salvia suave como acento de esperanza — nunca colores saturados o brillantes de pantalla.

Composición de lámina de libro: un instante sostenido, no un fotograma de cámara — sin profundidad
de campo fotográfica, sin lente de cine. La luz es la única guía de foco, con sombras suaves de
acuarela.

Cada ilustración es un momento que un adulto sostiene para compartir con un niño — nunca una escena
que un niño mira o protagoniza solo. Los personajes no posan ni miran directamente a cámara sin
motivo narrativo.

Nunca generar:
- texto, tipografía o logotipos;
- render 3D, aspecto fotográfico o publicitario;
- bordes duros o vectoriales, brillo digital artificial;
- personajes mirando directamente a cámara sin motivo narrativo.
`.trim();

// Misma escena ya aprobada de "Cuando tengo miedo" — único cambio es el lenguaje visual.
const SCENE_BLOCK = `
Personajes: un niño o niña abrazado fuerte por un adulto; ambos de perfil o de espaldas parciales,
sin mirar a cámara.
Acción: el adulto rodea al niño con los brazos en una habitación en penumbra, con la luz cálida de
un velador de mesa de noche.
Escenario: una habitación de noche con sombra de hogar (nunca amenazante), la luz del velador como
única fuente cálida cerca de los dos.
Emoción: consuelo que da paso a valentía — se muestra la seguridad, no el miedo.
`.trim();

async function main() {
  const fullPrompt = `${PILOT_STYLE_GUIDE}\n\n${SCENE_BLOCK}`;
  console.log("Generando piloto libro-ilustrado...");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1536",
      quality: "medium",
      n: 1,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status} ${detail}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("sin b64_json en la respuesta");

  const dir = path.join(ROOT, "public", "lumo-art");
  mkdirSync(dir, { recursive: true });
  const filename = "pilot-storybook-cuando-tengo-miedo.png";
  writeFileSync(path.join(dir, filename), Buffer.from(b64, "base64"));
  console.log(`✓ guardado en public/lumo-art/${filename}`);
}

main();
