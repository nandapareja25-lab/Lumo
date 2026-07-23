// Genera la ÚNICA ilustración principal de un episodio (LUMO-CONTENT-BIBLE.md sección 17: "una
// sola ilustración principal por episodio", no una por escena). Esa misma imagen se usa como
// portada en Explorar/Home y como fondo fijo durante toda la reproducción del audio. Guarda en
// /public/lumo-art y registra en data/landing-assets.json bajo el slug `story-{id}`.
//
// El STORY_STYLE_GUIDE de acá abajo es el prompt maestro de identidad visual — idéntico al de
// lib/story-style-guide.ts. Si se edita uno, editar el otro en la misma sesión. Nunca se varía
// entre historias; cada historia solo agrega su bloque de 4 campos (ver ITEMS).
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const ROOT = process.cwd();

function loadEnvLocal() {
  const raw = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
  }
}
loadEnvLocal();

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Falta OPENAI_API_KEY en .env.local");
  process.exit(1);
}

const STORY_STYLE_GUIDE = `
Ilustración de largometraje animado 3D — nunca fotorrealista, nunca un render publicitario, nunca
una fotografía. La dirección artística es cálida, emotiva y atemporal.

Personajes estilizados: proporciones naturales pero simplificadas, con rasgos legibles y muy
expresivos incluso en miniatura. Rostros cálidos y llenos de vida, evitando el fotorrealismo y el
exceso de detalle — formas simples y limpias antes que texturas complejas. La emoción se lee
primero, el detalle queda en segundo plano.

Los personajes deben sentirse cercanos y humanos, nunca caricaturescos al punto de perder
naturalidad, y nunca con el aspecto plástico o genérico típico de imágenes de IA genéricas.

Los materiales (piel, cabello, telas) se resuelven con formas simples y pintadas, no con detalle
fotográfico ni texturas hiperrealistas. El entorno debe sentirse vivo y creíble sin competir con
el personaje.

La iluminación cuenta la historia — cálida, del hogar, nunca espectacular ni artificial —
dominada por tonos ámbar, madera, crema y terracota. Azules muy suaves solo cuando la escena
específicamente lo pida. La escena transmite profundidad con un primer plano, plano medio y fondo
diferenciados, siempre con lenguaje de cámara de película animada — nunca un lente dramático ni
una composición publicitaria o fotográfica.

Cada ilustración es un instante que está ocurriendo, nunca una pose. Los personajes no posan ni
sonríen para el espectador — están dentro de la escena, viviendo el momento. Cada imagen debe
sentirse como un fotograma real de una película: quien la mira debería poder imaginar lo que pasó
un segundo antes y lo que va a pasar un segundo después.

Las imágenes deben generarse en formato vertical nativo 9:16, compuestas específicamente para
dispositivos móviles, sin recortes posteriores.

Nunca generar:
- texto o tipografía;
- logotipos o marcas de agua;
- personajes mirando directamente a cámara sin motivo narrativo, o posando para el espectador;
- fotorrealismo, apariencia de render publicitario o de fotografía;
- detalle o textura excesiva que compita con la emoción principal de la escena;
- apariencia plástica o de juguete;
- fondos vacíos o sin profundidad;
- composiciones donde el rostro ocupe casi toda la imagen.
`.trim();

/** Cada historia es solo estos 4 campos — nunca se toca el resto del estilo. */
function buildStoryBlock({ personajes, accion, escenario, emocion }) {
  return `Personajes: ${personajes}\nAcción: ${accion}\nEscenario: ${escenario}\nEmoción: ${emocion}`;
}

/**
 * El "mundo compartido" de las 5 escenas de ambiente de la app (Home/Mi Camino/Diario/Orar/
 * Explorar) — repetido palabra por palabra en cada una de las 5, para que sean 5 rincones del
 * mismo universo y no 5 ilustraciones independientes (aprobado por el usuario 2026-07-20).
 */
const SHARED_WORLD =
  "Es la misma noche, el mismo cielo, la misma luz que en las otras escenas de este mundo. Una luna creciente pálida y cálida, siempre en la parte superior izquierda del encuadre, con un halo suave. Cielo nocturno índigo profundo con un leve tono ciruela, más cálido cerca del horizonte, estrellas dispersas y discretas. La luz principal de la escena es siempre cálida y dorada, viniendo desde la izquierda o arriba-izquierda, con sombras suaves cayendo hacia la derecha — la luz de luna es fría y plateada, y solo actúa como relleno tenue, nunca protagonista. Niebla baja, fina, de tono gris cálido, que nunca sube más allá del suelo o las superficies inferiores. Pequeñas luciérnagas doradas flotan dispersas en la escena, como si vinieran del mismo lugar y solo visitaran este rincón del mundo.";

// Un solo item por episodio. Agregar acá cuando corresponda producir contenido nuevo (ver
// LUMO-CONTENT-BIBLE.md sección 20) — vaciar/comentar los ya producidos para no regenerarlos
// sin querer y gastar créditos de nuevo.
const ITEMS = [
  {
    slug: "hero",
    personajes:
      "una madre y su hija (niña de unos 7 años) acurrucadas juntas en una cama; y Lumo, siguiendo ESTE diseño exacto (no un insecto realista, no una versión genérica): cuerpo ovalado dorado cálido (tono miel/ámbar #F2BB4E) muy redondeado tipo peluche, sin cuello marcado, ojos MUY grandes en proporción a la cara color café oscuro con un brillo blanco, sonrisa pequeña y simple con mejillas de rubor cálido, dos antenas finas curvas que terminan en una lucecita cálida cada una, un par de alas translúcidas color crema con venas sutiles plegadas detrás del cuerpo, y un abdomen inferior redondeado que emite un brillo dorado/amarillo cálido (#FFE066) que nunca desaparece por completo — del tamaño de la palma de la mano de un niño, flotando cerca de la cama",
    accion: "Lumo narrando una historia, la madre y la hija escuchando con atención y calidez, sonriendo",
    escenario: "una habitación acogedora de noche, luz cálida de lámpara, ventana con estrellas de fondo",
    emocion: "calidez, cercanía familiar, calma antes de dormir",
  },
  {
    slug: "world-home",
    personajes: "ninguna figura humana en el encuadre; la luz cálida en las ventanas insinúa a una familia adentro",
    accion: "humo suave saliendo de la chimenea, luciérnagas doradas flotando cerca de la casa como si fuera su origen",
    escenario: `${SHARED_WORLD} Una casa de madera pequeña y acogedora en la ladera de una colina — el lugar al que siempre se vuelve, el corazón de este mundo —, con dos o tres ventanas encendidas de luz dorada, un sendero corto de piedra hacia la puerta, árboles altos a los costados.`,
    emocion: "hogar, el lugar al que siempre se vuelve",
  },
  {
    slug: "world-mi-camino",
    personajes: "ninguna figura humana; el sendero mismo es el protagonista",
    accion: "la niebla se espesa levemente hacia el fondo disolviendo el sendero en vez de terminarlo, luciérnagas marcando el borde del camino",
    escenario: `${SHARED_WORLD} El mismo sendero de piedra y tierra saliendo de una casa que no se ve en el encuadre, subiendo entre árboles altos y oscuros, perdiéndose en la niebla y la oscuridad de la distancia — sin mostrar destino, sin ninguna construcción visible, solo la sensación de que el camino continúa más allá del encuadre.`,
    emocion: "continuidad, un viaje que sigue",
  },
  {
    slug: "world-diario",
    personajes: "ninguna figura humana; un cuaderno de tapa de cuero abierto a mitad de página con una pluma apoyada de costado, como si alguien acabara de dejarlo así, no preparado para una foto",
    accion: "la llama de una vela proyecta un resplandor tembloroso sobre la madera, motas de luz suspendidas en el aire, una o dos luciérnagas rondando cerca de la ventana por afuera",
    escenario: `${SHARED_WORLD} Un rincón cálido dentro de esa misma casa, junto a una ventana pequeña con la misma noche de afuera visible, una vela encendida como única fuente de luz cercana. La composición prioriza el resplandor de la vela y el aire cálido de la habitación por sobre la mesa, que ocupa poco espacio del encuadre.`,
    emocion: "intimidad, un momento guardado sin querer posar",
  },
  {
    slug: "world-orar",
    personajes: "ninguna figura humana; una sola ventana pequeña con luz cálida sugiere que alguien está adentro, en silencio",
    accion: "quietud total, un par de luciérnagas cerca de la única ventana encendida",
    escenario: `${SHARED_WORLD} Una capilla diminuta y humilde —más refugio de madera y piedra que edificio religioso, nada monumental—, casi escondida entre los mismos árboles altos y oscuros del sendero, apenas visible entre las ramas, cabe casi entera detrás de un árbol grande en primer plano.`,
    emocion: "recogimiento, un lugar apartado que casi no se nota hasta que se lo busca",
  },
  {
    slug: "world-explorar",
    personajes: "ninguna figura humana",
    accion: "quietud, niebla muy suave y uniforme, dos o tres luciérnagas muy tenues",
    escenario: `${SHARED_WORLD} El mismo cielo y la misma luz, vistos desde más lejos y más arriba — montañas bajas y oscuras en el horizonte, siluetas de árboles distantes, sin casa, sin sendero, sin capilla. La escena más simple y silenciosa de las cinco, con muy poco detalle.`,
    emocion: "un fondo que respira pero no reclama atención, para que las ilustraciones de las historias protagonicen",
  },
  // Ejemplo (ya producido y aprobado — no se re-corre):
  // {
  //   slug: "story-buen-samaritano",
  //   personajes: "el samaritano (barba oscura, turbante verde oliva, túnica color arena) y el viajero herido (joven, cabello oscuro, túnica desgastada con heridas visibles)",
  //   accion: "el samaritano limpiándole el rostro con un paño",
  //   escenario: "camino rocoso entre Jerusalén y Jericó, atardecer, burro cargado cerca",
  //   emocion: "compasión",
  // },

  // Ilustraciones de las 8 oraciones (aprobadas 2026-07-22, ver ROADMAP.md/ESTADO.md). Ninguna
  // muestra a Lumo (su voz ya está en el audio; ninguna escena tiene una acción narrativa que
  // justifique su presencia visual). Ninguna posa para cámara. Regla editorial del lote: cada
  // imagen debe funcionar como una fotografía emocional por sí sola — alguien que nunca escuche
  // el audio debería sentir calidez humana igual, sin que la imagen necesite "explicar" la
  // oración. Piloto aprobado para generar primero: prayer-cuando-tengo-miedo — el resto espera
  // revisión del piloto antes de correr.
  {
    slug: "prayer-antes-de-dormir",
    personajes:
      "un niño o niña de unos 6-8 años acostado en la cama con los ojos entrecerrándose; un adulto (padre, madre o cuidador) inclinado a su lado; ninguno mira a cámara",
    accion:
      "el adulto le acomoda la manta o le acaricia suavemente el cabello mientras el niño se queda dormido, ambos con la mirada baja, sin posar",
    escenario:
      "una habitación cálida de noche, luz tenue de un velador junto a la cama, ventana con cielo nocturno de fondo",
    emocion:
      "alivio y paz — el cierre tranquilo del día. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-dar-gracias",
    personajes:
      "un niño o niña mostrándole a un adulto algo pequeño con orgullo — un dibujo recién hecho o una flor recogida —; el adulto sonriendo, mirando el objeto, no a cámara",
    accion:
      "el niño extiende el objeto con las dos manos; el adulto se agacha levemente para mirarlo de cerca",
    escenario: "un rincón cotidiano y cálido de la casa, luz suave de tarde",
    emocion:
      "gratitud que nace de notar lo pequeño, alegría compartida. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-cuando-tengo-miedo",
    personajes:
      "un niño o niña abrazado fuerte por un adulto; ambos de perfil o de espaldas parciales, sin mirar a cámara",
    accion:
      "el adulto rodea al niño con los brazos en una habitación en penumbra, con la luz cálida de un velador de mesa de noche o la luz que entra desde un pasillo cercano — nunca una fuente de luz abstracta o sin origen reconocible",
    escenario:
      "una habitación de noche con sombra de hogar (nunca amenazante), la luz del velador o del pasillo como única fuente cálida cerca de los dos",
    emocion:
      "consuelo que da paso a valentía — se muestra la seguridad, no el miedo, y esa esperanza nace de algo reconocible del hogar, no de un resplandor sin explicación. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-cuando-estoy-triste",
    personajes:
      "un niño o niña apoyado contra un adulto, ambos mirando hacia una ventana; ninguno mira a cámara",
    accion:
      "los dos en silencio, mirando cómo una luz cálida de atardecer empieza a entrar por la ventana",
    escenario:
      "interior cálido, al final de la tarde o un atardecer temprano — nunca de noche a amanecer —, la luz de la ventana como único punto brillante de la escena",
    emocion:
      "consuelo silencioso, esperanza que empieza a aparecer — no tristeza dramática. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-antes-de-un-examen",
    personajes:
      "un niño o niña sentado a una mesa con un cuaderno ya cerrado frente a él; un adulto con una mano apoyada en su hombro, sin señalar ni explicar nada",
    accion:
      "el adulto solo acompaña con la mano en el hombro o una mirada tranquila; el niño mira el cuaderno cerrado, no a cámara",
    escenario: "un rincón de escritorio con luz cálida de lámpara",
    emocion:
      "confianza tranquila — \"ya hiciste lo que podías\", no ansiedad ni repaso. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-por-mi-familia",
    personajes:
      "el núcleo familiar completo (adultos y uno o más niños) reunidos alrededor de una mesa pequeña — no un abrazo grupal",
    accion: "todos juntos en la mesa, mirándose entre ellos, no a cámara, en un gesto natural de cercanía",
    escenario: "un living o comedor cálido de noche, luz cálida central sobre el grupo",
    emocion:
      "pertenencia y amor — la única de las 8 que muestra al grupo entero. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-antes-de-comer",
    personajes:
      "una familia sentada a la mesa con la comida ya servida, justo antes de empezar a comer; nadie tiene cubiertos en la mano",
    accion:
      "un instante de pausa compartida antes del primer bocado — manos quietas sobre la mesa o entrelazadas, ningún gesto de estar ya comiendo",
    escenario: "una mesa familiar con luz cálida de sobremesa",
    emocion:
      "gratitud simple, alegría cotidiana compartida. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
  {
    slug: "prayer-antes-de-comenzar-el-dia",
    personajes:
      "un niño o niña y un adulto en una cocina o cerca de una ventana grande, a primera hora de la mañana",
    accion:
      "una actividad simple y tranquila, sin posar — la luz de la mañana es la protagonista de la escena, no la comida ni los objetos",
    escenario: "luz de mañana entrando por una ventana grande — la única escena diurna de las 8",
    emocion:
      "esperanza y energía tranquila — un día todavía lleno de posibilidades. La imagen debe funcionar como una fotografía emocional por sí sola, transmitiendo calidez humana incluso sin escuchar el audio.",
  },
];

async function generateOne({ slug, ...fields }) {
  const fullPrompt = `${STORY_STYLE_GUIDE}\n\n${buildStoryBlock(fields)}`;
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
      size: "1024x1536", // vertical (9:16), ver LUMO-CONTENT-BIBLE.md sección 17
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

  const onlySlugs = process.argv.slice(2);
  const items = ITEMS.filter((it) => onlySlugs.length === 0 || onlySlugs.includes(it.slug));

  if (items.length === 0) {
    console.log("Nada para generar — agregá un item a ITEMS en este script, o pasá un slug por argv.");
    return;
  }

  for (const item of items) {
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
