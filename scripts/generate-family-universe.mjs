// Script de experimento AISLADO (2026-07-22) — universo visual del "ritual familiar" (landing +
// futura biblioteca de marca), DISTINTO del universo bíblico de STORY_STYLE_GUIDE. No toca
// generate-hero-art.mjs ni story-style-guide.ts. Genera una escena a la vez para validación
// iterativa. Ver conversación del 2026-07-22 sobre universo visual familiar.
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

const BASE_STYLE = `
Ilustración 3D estilizada, no fotorrealista — formas simplificadas, superficies con textura suave
tipo escultura pintada, iluminación volumétrica suave. Debe leerse como un fotograma de una película
animada de autor, nunca como un render de videojuego ni una ilustración plana 2D.

Filosofía de luz: una única fuente de luz práctica y cálida por escena, que actúa como personaje —
dirige la mirada, define qué está a salvo y qué queda en sombra. Nunca luz ambiente pareja.

Paleta: ámbar, madera, crema, terracota, moduladas sobre el color real del entorno (la luz tiñe, no
reemplaza). Sombras con temperatura fría sutil, nunca sombras negras planas.

Composición: instante a mitad de acción, nunca pose ni mirada a cámara. Cámara a altura íntima.
Cada imagen implica un segundo antes y un segundo después.

Lente: equivalente a 35-50mm, profundidad de campo suave, sin distorsión de gran angular.

Esperanza como resultado: el punto de partida puede ser cansancio, pero la sensación final es paz,
alivio o cercanía — nunca melancolía sin resolver.

Evidencia de vida: 1-2 detalles domésticos reales y específicos que prueben que una familia vive ahí
— nunca desorden, siempre humanidad.

Nunca generar: mirada a cámara, sonrisas posadas, iconografía religiosa literal (cruces, halos, manos
juntas en plegaria clásica), pantallas de dispositivo iluminadas o con UI visible, luz ambiente
plana, textura fotorrealista de piel/tela, casas de catálogo/inmobiliaria, texto o logotipos.

Textura de render: mate y pintada, NO glossy — evitar brillo especular marcado en piel, cabello u
ojos, evitar catchlights definidos tipo cristal, evitar el acabado "gran estudio de animación premium"
(look Pixar/Disney de alta gama). El acabado correcto es más cercano a una ilustración pintada con
volumen suave: pigmento y sombra, no reflejo. Referencia de calibración: la escena "El umbral" ya
producida — mismo nivel de brillo, mismo tipo de superficie.
`.trim();

const SCENES = {
  "umbral": `
Microhistoria: un padre agotado sube una escalera cargando a su hijo medio dormido — el último
tramo del día antes del descanso. El niño ya cedió al sueño; el padre todavía no.

Sujetos y gesto: hombre adulto cargando a un niño con los brazos alrededor de su cuello, cabeza del
niño apoyada en su hombro, ojos cerrados. El padre a mitad de un paso ascendente, mirada hacia
arriba (hacia la luz), no hacia cámara. Cansancio visible en la postura pero gesto de sostén firme.

Espacio: escalera interior de una casa habitada, barandal de madera con uso real, pared con desgaste
sutil.

Encuadre y altura de cámara: plano general/medio, cámara a mitad de la escalera, ligeramente por
debajo del sujeto, mirando hacia el rellano superior.

Luz: fuente única cálida desde una puerta entreabierta en el piso superior — el resto de la
escalera en penumbra progresiva hacia abajo.

Colores del entorno: madera oscura de la escalera, pared en tono crema envejecido, ropa en tonos
neutros terracota/azul apagado teñidos parcialmente por la luz cálida.

Profundidad y composición: primer plano en penumbra, sujeto iluminándose progresivamente, fondo de
luz cálida difusa arriba — composición diagonal ascendente.

Evidencia de vida: un par de zapatillas chicas abandonadas a los pies de la escalera.

Formato vertical retrato.
`.trim(),

  "presencia-compartida": `
Microhistoria: madre e hija sentadas en el piso de un living, a mitad de una conversación tranquila
— ninguna mira a cámara. Una guirnalda de luces cálidas fuera de foco al fondo funciona como segunda
capa de luz, nunca como la principal.

Sujetos y gesto: mujer adulta y niña sentadas una junto a la otra en el piso, apoyadas casi hombro
con hombro. La niña con la cabeza ligeramente girada hacia la madre, a mitad de una frase — boca
entreabierta, no sonrisa posada. La madre con la mirada baja, hacia la niña, mano apoyada cerca sin
gesto forzado.

Espacio: piso de un living habitado, alfombra con textura real, sofá desenfocado detrás con una
manta tejida sin acomodar, estante con libros y una foto enmarcada.

Encuadre y altura de cámara: plano medio-cerrado, cámara al ras del piso, a la altura de ambas
figuras sentadas.

Luz: lámpara de pie baja fuera de cuadro o en el borde del encuadre, iluminando los rostros desde un
costado — mitad del rostro en sombra suave. La guirnalda de fondo queda desenfocada y secundaria.

Colores del entorno: madera cálida del piso, sofá en tono neutro terracota apagado, un acento de
color distinto (verde o azul apagado) en la ropa de la niña.

Profundidad y composición: primer plano nítido en las dos figuras, fondo con guirnalda y sofá
desenfocados — mucho aire en la mitad superior del encuadre para dejar lugar a texto superpuesto.

Evidencia de vida: un peluche apoyado en el piso cerca de ellas, una manta a medio doblar en el sofá.

Formato vertical retrato.
`.trim(),

  "leyendo-juntos": `
Microhistoria: un padre y su hijo leyendo un libro juntos en un sillón de living gastado por el uso
— el padre a mitad de señalar algo en la página, el hijo mirando el libro, no a cámara.

Sujetos y gesto: hombre adulto y niño sentados juntos en un sillón, el libro abierto entre los dos.
El padre con el dedo apoyado sobre una página, a mitad de una explicación. El niño con la cabeza
apoyada cerca del brazo del padre, atención puesta en el libro.

Espacio: sillón de living con textura de uso real (no nuevo), mesa baja cerca con objetos domésticos.

Encuadre y altura de cámara: plano medio-cerrado, cámara a la altura del sillón, ligeramente de
frente pero sin que nadie mire hacia el lente.

Luz: lámpara de pie lateral cálida, dejando la mitad del sillón en penumbra suave.

Colores del entorno: tapizado del sillón en tono madera/oliva apagado, ropa del niño en terracota,
manta doblada sobre el respaldo en tono crema.

Profundidad y composición: foco en el espacio compartido entre ambos y el libro, fondo de living
desenfocado.

Evidencia de vida: una taza a medio tomar y un camión de juguete de madera sobre la mesa baja.

Formato horizontal.
`.trim(),

  "arropar-cama": `
Microhistoria: un padre termina de arropar a su hijo ya dormido — la mano ajustando la manta, a
mitad de inclinarse hacia atrás para retirarse.

Sujetos y gesto: hombre adulto inclinado sobre una cama, una mano ajustando el borde de una manta,
niño acostado con los ojos cerrados, un peluche bajo el brazo. El padre a mitad de movimiento, no
posando.

Espacio: habitación infantil habitada — repisa con libros y un peluche, mesa de noche con una
lámpara.

Encuadre y altura de cámara: plano horizontal ancho, cámara a la altura de la cama, con espacio
negativo a un lado para texto superpuesto.

Luz: única fuente cálida de una lámpara de mesa de noche.

Colores del entorno: ropa de cama en tono azul grisáceo apagado, madera cálida del mobiliario,
acentos crema.

Profundidad y composición: primer plano en la cama iluminada, fondo de la habitación en penumbra
suave.

Evidencia de vida: un libro cerrado y un auto de juguete sobre la mesa de noche.

Formato horizontal ancho.
`.trim(),

  "testimonio": `
Microhistoria: madre e hija muy cerca una de la otra en un sofá, a mitad de un gesto de cercanía
cotidiana — no posando para una foto, sino sorprendidas en un instante de quietud compartida.

Sujetos y gesto: mujer adulta y niña abrazadas de costado, la niña con la cabeza apoyada en el pecho
o el hombro de la madre, ambas con la mirada baja o hacia un punto fuera de cámara — nunca mirando
al lente ni sonriendo hacia afuera. Un teléfono puede estar apoyado sobre la manta entre ellas, boca
abajo o con la pantalla completamente apagada — nunca encendido, nunca sostenido en alto, nunca
fuente de luz de la escena.

Espacio: sofá de living con una manta tejida gruesa cubriendo las piernas de ambas.

Encuadre y altura de cámara: plano vertical cerrado, cámara a la altura del sofá.

Luz: lámpara cálida fuera de cuadro como única fuente — el teléfono, si aparece, queda en penumbra
total, sin brillo propio.

Colores del entorno: manta en tono terracota/marrón tejido, ropa en tonos neutros cálidos.

Profundidad y composición: primer plano cerrado en ambas figuras, mucho espacio negativo en la parte
inferior del encuadre para una cita superpuesta con scrim oscuro parcial.

Evidencia de vida: una taza apoyada cerca, fuera de foco.

Formato vertical retrato.
`.trim(),

  "bodegon-juguetes": `
Microhistoria: una canasta de mimbre con juguetes queda al pie de una ventana después de que la
familia ya se fue a dormir — sin personas, sugiere que alguien vivió ahí momentos antes.

Sujetos y gesto: ninguno.

Espacio: rincón de una habitación con una ventana con cortina liviana, piso de madera, un estante
bajo desenfocado al costado.

Encuadre y altura de cámara: plano horizontal, cámara a la altura de la canasta, mucho espacio
negativo alrededor para texto superpuesto.

Luz: luz cálida rasante entrando por la ventana (atardecer) como única fuente.

Colores del entorno: madera cálida del piso, cortina en tono crema, manta color terracota asomando
de la canasta.

Profundidad y composición: canasta con juguetes (peluche, auto de madera, libro) en primer plano
nítido a un costado del encuadre, resto del encuadre en penumbra suave y vacío.

Evidencia de vida: peluche, auto de juguete de madera y libro asomando de la canasta, manta a medio
caer.

Formato horizontal.
`.trim(),
};

async function main() {
  const sceneKey = process.argv[2] || "umbral";
  const scene = SCENES[sceneKey];
  if (!scene) throw new Error(`Escena desconocida: ${sceneKey}`);

  const fullPrompt = `${BASE_STYLE}\n\n${scene}`;
  console.log(`Generando escena "${sceneKey}"...`);

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
  const filename = `familia-${sceneKey}.png`;
  writeFileSync(path.join(dir, filename), Buffer.from(b64, "base64"));
  console.log(`✓ guardado en public/lumo-art/${filename}`);
}

main();
