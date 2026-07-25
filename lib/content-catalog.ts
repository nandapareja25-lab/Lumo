/**
 * Catálogo unificado de contenido — Lumo es una plataforma de experiencias narradas
 * (audio-first), no una biblioteca de textos. Cada pieza de contenido (historia, oración,
 * y a futuro devocional/serie/meditación/música/podcast/reto/curso/especial) se modela como
 * un "episodio" con la misma forma de datos, para poder sumar tipos nuevos sin rediseñar
 * pantallas ni componentes.
 *
 * `audioUrl`/`musicUrl` en null significa "producción de audio pendiente" — hoy el reproductor
 * cae a Web Speech API como narración interina (ver app/reproducir/[id]/page.tsx). Cuando exista
 * audio real (grabado o generado con una voz premium consistente para Lumo), solo hay que llenar
 * esos campos acá, sin tocar ningún componente.
 */
import type { CollectionId } from "./content-library";

export type ContentType =
  | "historia"
  | "oracion"
  | "devocional"
  | "meditacion"
  | "musica"
  | "podcast"
  | "reto"
  | "curso"
  | "especial"
  /** Historia original inspirada en valores — no tiene origen bíblico (colección "cuentos-con-valores"). */
  | "cuento"
  /** Frase breve y positiva (colección "afirmaciones"). */
  | "afirmacion"
  /** Devocional diario atado a un pasaje específico del Evangelio (colección "evangelio-diario") —
   * a diferencia de "devocional" (Reflexiones, valor genérico) siempre parte de un pasaje puntual,
   * y tiene dos variantes de tono por día (`tone`), no una sola pieza (decisión 2026-07-24). */
  | "evangelio";

export type SceneMood = "family" | "book" | "prayer" | "diary" | "night" | "threshold";

/**
 * Quién habla en el segmento: Lumo actúa como guía (abre y cierra la experiencia, nunca narra
 * la historia de corrido), "narracion" es el cuerpo cinematográfico de la historia/oración en sí
 * (con diálogos entre personajes incluidos como parte del mismo texto narrado).
 */
export type SegmentRole = "guia-intro" | "narracion" | "guia-cierre";

/** Un segmento del guion — pensado para durar ~45–90s de audio real, no un micro-fragmento. */
export type ContentSegment = {
  role: SegmentRole;
  caption: string;
  mood: SceneMood;
  audioUrl?: string | null;
  /** Nombre de un efecto de sonido de la biblioteca reutilizable (ver lib/audio-library.ts) que
   * suena una vez al entrar a este segmento — usar con moderación, 1-2 por episodio (sección 13). */
  sfx?: string;
  /** Qué `Illustration.id` de `ContentItem.illustrations` se muestra durante este segmento.
   * Si falta, cae a la primera ilustración del array (o al illustrationSlug legado). */
  illustrationId?: string;
};

/**
 * Una ilustración real (no el fallback MoodScene) asociada a un momento narrativo puntual de
 * un episodio — arquitectura para múltiples ilustraciones por episodio (2026-07-23), no solo
 * una portada. Ver production/notifications no aplica acá; el pipeline real vive en
 * production/agents/README.md y el registro de personajes en lib/character-registry.ts.
 */
export type IllustrationApprovalStatus = "draft" | "approved" | "rejected";

export type Illustration = {
  id: string;
  /** A qué escena/momento del guion corresponde (identificador libre, ej. "s1e1-anuncio-pastores"). */
  sceneId: string;
  /** Orden de aparición dentro del episodio. */
  order: number;
  /** Descripción breve del fragmento/momento narrativo que representa. */
  narrativeMoment: string;
  approvalStatus: IllustrationApprovalStatus;
  /** Ruta al archivo de prompt usado (scripts/_prompts/...). */
  promptFile: string;
  /** slug de personaje (lib/character-registry.ts) -> versión usada en esta ilustración. */
  characterVersions: Record<string, string>;
  image300: string;
  image600: string;
};

/** Devuelve la ilustración real que corresponde a un segmento, o undefined si el episodio
 * todavía no tiene ilustraciones por escena (cae al illustrationSlug legado vía <ArtAsset>). */
export function illustrationForSegment(content: ContentItem, segmentIndex: number): Illustration | undefined {
  if (!content.illustrations || content.illustrations.length === 0) return undefined;
  const segment = content.segments[segmentIndex];
  if (segment?.illustrationId) {
    const match = content.illustrations.find((i) => i.id === segment.illustrationId);
    if (match) return match;
  }
  return content.illustrations[0];
}

export type ContentTag = "personajes" | "milagros" | "mujeres" | "valores";

export type AgeRange = "4-6" | "7-10" | "4-10";

export type BiblicalLevel = "principiante" | "intermedio" | "avanzado";

/** Estándar de duración del proyecto (reemplaza "cantidad de historias" como métrica). */
export type LengthCategory =
  | "historia-corta" // 6-8 min
  | "historia-estandar" // 8-12 min
  | "historia-epica" // 12-20 min
  | "oracion-guiada" // 3-7 min
  | "momento-dormir" // 8-12 min
  | "devocional" // 5-8 min
  | "episodio-serie" // 2-5 min — episodios de Series (hábito diario)
  | "evangelio-diario" // 2-3 min — Evangelio del día/noche
  | "cuento-valores"; // 4-5 min — Cuentos con valores (colección "cuentos-con-valores")

export type ContentItem = {
  id: string;
  contentType: ContentType;
  title: string;
  subtitle: string;
  description: string;
  category: "antiguo" | "nuevo" | "general";
  /** A qué colección pertenece (ver lib/content-library.ts) — permite a Explorar navegar por colección/serie sin importar el tipo de contenido. */
  collectionId: CollectionId;
  /** Serie dentro de la colección (ej. "david", "moises") — opcional para contenido sin sub-serie (ej. oraciones situacionales). */
  seriesId?: string;
  season?: number;
  episodeNumber?: number;
  lengthCategory: LengthCategory;
  durationSeconds: number;
  ageRange: AgeRange;
  biblicalLevel?: BiblicalLevel;
  narrator: string;
  characters: string[];
  tags: ContentTag[];
  passages: string[];
  language: "es";
  /** Slug usado por <ArtAsset> para buscar la ilustración generada (data/landing-assets.json). */
  illustrationSlug: string;
  audioUrl: string | null;
  musicUrl: string | null;
  segments: ContentSegment[];
  conversationQuestions: string[];
  resources?: string[];
  /** Solo episodios de Series (hábito diario): reto breve para vivir hoy lo que se acaba de escuchar. */
  dailyChallenge?: string;
  /** Solo episodios de Series: el gancho de cierre ("Mañana descubrirás...") que invita a volver. */
  nextEpisodeHook?: string;
  /** Solo contentType "evangelio": variante de tono del día — arranque/energía vs. cierre/calma.
   * Dos entradas por día (mismo pasaje en `passages`, texto distinto), no una sola pieza. */
  tone?: "manana" | "noche";
  /** Ilustraciones reales por escena (arquitectura 2026-07-23). Vacío/ausente = todavía solo
   * tiene la portada vía illustrationSlug — ver production/ILLUSTRATION-AUDIT.md. */
  illustrations?: Illustration[];
};

export const CONTENT: ContentItem[] = [
  {
    id: "david-goliat",
    contentType: "historia",
    title: "David y el gigante",
    subtitle: "Con fe, hasta lo más grande se puede enfrentar",
    description: "David era el más joven de sus hermanos, pero enfrentó al gigante Goliat con una honda, una piedra y mucha fe.",
    category: "antiguo",
    collectionId: "historias-biblicas",
    seriesId: "david",
    episodeNumber: 1,
    lengthCategory: "historia-epica",
    durationSeconds: 386,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["David", "Goliat", "Saúl", "Eliab"],
    tags: ["personajes", "valores"],
    passages: ["1 Samuel 17:1–58"],
    language: "es",
    illustrationSlug: "story-david-goliat",
    illustrations: [
      {
        id: "story-david-goliat-i1",
        sceneId: "story-david-goliat",
        order: 1,
        narrativeMoment: "David enfrenta a Goliat con serena determinación.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-david-goliat-v2.txt",
        characterVersions: { "david": "v2" },
        image300: "/lumo-art/story-david-goliat-v2_300.webp",
        image600: "/lumo-art/story-david-goliat-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "En las colinas de Belén, el sol apenas empezaba a calentar la hierba cuando David terminó de contar sus ovejas por tercera vez esa mañana. Ninguna faltaba. Se sentó sobre una piedra grande, sacó su honda de cuero y, sin apuntar a nada en particular, la hizo girar en el aire, una y otra vez, hasta que el silbido se volvió parte del paisaje, como el canto de los pájaros.\n\nDavid era el menor de ocho hermanos. Los mayores ya habían ido a la guerra, siguiendo al rey Saúl, y a él le tocaba quedarse cuidando el rebaño. No le molestaba. Ahí, solo entre las ovejas, David cantaba canciones para Dios que nadie más escuchaba, y sentía que Dios sí lo escuchaba a él.\n\n—Algún día —le dijo una vez a su padre, Isaí— me gustaría hacer algo grande por Dios.\n\nIsaí sonrió y le revolvió el cabello.\n\n—Ya lo estás haciendo, hijo. Cuidas lo que te confiaron. Eso también es grande.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Muy lejos de allí, en el valle de Ela, las cosas no se sentían nada tranquilas. Dos ejércitos acampaban en colinas opuestas, separados por un valle angosto, y cada mañana ocurría lo mismo.\n\nUn gigante llamado Goliat, tan alto como tres hombres uno sobre otro, salía de las filas filisteas con su armadura de bronce brillando como fuego, y gritaba con una voz que hacía temblar las piedras:\n\n—¡Elijan a un hombre, y que baje a pelear contra mí! ¡Si me vence, seremos sus esclavos! ¡Pero si yo venzo, ustedes serán los nuestros!\n\nSilencio. Ni un soldado israelita se movía. Cuarenta días llevaba Goliat gritando lo mismo, y cuarenta días el ejército entero, incluido el rey Saúl, agachaba la mirada, sin que nadie se atreviera a responder.\n\n—Nadie puede contra él —susurró un soldado joven, escondido tras su escudo—. Es demasiado grande. Es imposible.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Isaí envió a David hasta el campamento a llevarles pan y queso a sus hermanos. Cuando David llegó, alcanzó a ver a Goliat gritando su desafío de siempre, y algo dentro de él se removió, incómodo.\n\n—¿Quién se cree este filisteo —preguntó David a los soldados que tenía cerca— para desafiar al ejército del Dios viviente?\n\nSu hermano mayor, Eliab, lo escuchó y se enojó.\n\n—¿Qué haces aquí? —le reclamó—. ¿Quién cuida esas pocas ovejas que dejaste solas? Sé por qué viniste: solo quieres ver la batalla.\n\n—¿Qué hice ahora? —respondió David, sin bajar los brazos—. Solo hice una pregunta.\n\nPero la pregunta ya había llegado a oídos del rey Saúl, y Saúl mandó llamar a este muchacho que se atrevía a hablar así.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "—Que no se desanime nadie por causa de este filisteo —le dijo David al rey, de pie frente a él, sin temblar—. Yo iré a pelear contra él.\n\nSaúl lo miró de arriba abajo, casi con lástima.\n\n—No puedes ir tú contra este filisteo —le dijo—. Eres solo un muchacho, y él ha sido guerrero toda su vida.\n\n—Su siervo cuidaba las ovejas de su padre —respondió David con calma— y cuando venía un león, o un oso, y se llevaba una oveja del rebaño, yo salía tras él, lo golpeaba, y la rescataba de su boca. El Dios que me libró de las garras del león y del oso, también me librará de la mano de este filisteo.\n\nSaúl se quedó en silencio un largo momento. Luego suspiró.\n\n—Ve, entonces —dijo—. Y que el Señor esté contigo.\n\nQuiso ponerle su propia armadura de bronce y su espada, pero David, al caminar unos pasos con todo ese peso encima, negó con la cabeza.\n\n—No puedo andar con esto —dijo, quitándosela—. No estoy acostumbrado.\n\nEn cambio, tomó su bastón de pastor, su honda de siempre, y fue hasta el arroyo. Ahí, escogió cinco piedras lisas, redondas, del tamaño justo, y las guardó en su bolsa.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Goliat vio acercarse a David y soltó una carcajada que resonó por todo el valle.\n\n—¿Soy acaso un perro —gritó—, para que vengas contra mí con un palo? ¡Ven aquí, y les daré tu carne a las aves del cielo y a las fieras del campo!\n\nDavid se detuvo, sostuvo la mirada del gigante, y respondió con una voz que no temblaba:\n\n—Tú vienes contra mí con espada, lanza y jabalina. Pero yo vengo contra ti en el nombre del Señor de los ejércitos, el Dios de Israel, al que tú has desafiado. Hoy el Señor te entregará en mis manos, y todo el mundo sabrá que hay un Dios en Israel.\n\nGoliat avanzó, pesado, seguro de sí mismo. David corrió hacia él —no lejos, no escondido, sino directo hacia el valle— metió la mano en su bolsa, sacó una piedra, la puso en la honda, y la hizo girar en el aire con un silbido que ya conocía de memoria.\n\nLa soltó.\n\nLa piedra voló recta, golpeó al gigante justo en la frente, y Goliat cayó al suelo con un estruendo que hizo temblar la tierra bajo los pies de los dos ejércitos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Un silencio enorme cubrió el valle entero. Y luego, un grito — no de miedo esta vez, sino de alegría — se levantó desde las filas israelitas, que corrieron adelante celebrando la victoria que Dios les había dado.\n\nDavid se quedó de pie un momento, mirando sus propias manos, todavía temblando un poco, no de miedo, sino de asombro.\n\n—No fui yo —susurró, mirando al cielo—. Fuiste tú.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué historia, ¿no? David no era el más fuerte, ni el más grande. Pero tenía algo mucho más importante: confiaba en Dios de verdad, incluso frente a un gigante.\n\n¿Alguna vez tuviste miedo de algo que parecía enorme? ¿Qué fue lo que te ayudó a sentirte valiente?",
      },
    ],
    conversationQuestions: ["¿Alguna vez tuviste miedo de algo grande? ¿Qué te ayudó a sentirte valiente?"],
  },
  {
    id: "noe-arca",
    contentType: "historia",
    title: "Noé y el arca",
    subtitle: "Confiar en Dios, incluso cuando nadie más te cree",
    description: "Dios le pidió a Noé que construyera un arca enorme, aunque no había ni una nube en el cielo — y Noé confió.",
    category: "antiguo",
    collectionId: "historias-biblicas",
    seriesId: "noe",
    episodeNumber: 2,
    lengthCategory: "historia-estandar",
    durationSeconds: 230,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Noé", "esposa de Noé"],
    tags: ["personajes", "valores"],
    passages: ["Génesis 6–9"],
    language: "es",
    illustrationSlug: "story-noe-arca",
    illustrations: [
      {
        id: "story-noe-arca-i1",
        sceneId: "story-noe-arca",
        order: 1,
        narrativeMoment: "Noé junto a la entrada del arca con los animales.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-noe-arca-v2.txt",
        characterVersions: { "noe": "v2" },
        image300: "/lumo-art/story-noe-arca-v2_300.webp",
        image600: "/lumo-art/story-noe-arca-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Noé vivía en una época en la que casi nadie se acordaba de Dios. Pero él sí. Todas las mañanas salía a caminar entre sus animales y hablaba con Dios como quien habla con un amigo cercano.\n\nUn día, mientras cortaba madera junto a su casa, Dios le habló:\n\n—Noé, construye un arca. Un barco enorme, con tres pisos, tan grande como para que quepan tú, tu familia, y dos de cada animal que existe. Va a llover como nunca antes llovió, y quiero cuidarlos a todos.\n\nNoé se quedó mirando el cielo. No había ni una sola nube.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "—¿Un barco? —le preguntó su esposa esa noche, mientras Noé le contaba lo que había escuchado—. ¿Aquí, tan lejos del mar?\n\n—Eso me dijo Dios —respondió Noé—. Y yo le creo.\n\nDurante años, Noé cortó madera, midió tablas, y clavó cada pieza del arca bajo un sol que no anunciaba ninguna lluvia. Los vecinos pasaban y se reían.\n\n—¿Para qué construyes un barco, Noé, si no hay ni una gota de agua? —le gritaban, entre risas.\n\nNoé no discutía. Seguía martillando, tabla tras tabla, confiando en que Dios cumpliría su palabra, aunque nadie más le creyera.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Cuando el arca estuvo terminada, pasó algo increíble: los animales empezaron a llegar solos, caminando en parejas hacia la rampa del barco. Leones junto a ovejas, elefantes junto a conejos, pájaros de todos los colores. Noé los recibía a todos, guiándolos adentro con calma.\n\n—Entren, entren —les decía, como si los conociera de toda la vida.\n\nCuando el último animal entró, Noé, su esposa, sus hijos y sus familias entraron también. Y entonces, Dios mismo cerró la puerta del arca detrás de ellos.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa misma noche empezó a llover. Al principio, gotas suaves contra el techo de madera. Después, una lluvia tan fuerte que no se veía nada más allá del arca. Llovió durante cuarenta días y cuarenta noches, sin parar ni un momento.\n\nAdentro, en la oscuridad, se escuchaba el sonido de los animales acomodándose, y el crujido del arca meciéndose sobre el agua que subía y subía, cubriendo todo lo que antes había sido tierra firme.\n\nNoé abrazó a su familia, y aunque el mundo entero parecía haber desaparecido bajo el agua, sintió una paz extraña: Dios los había puesto justo ahí adentro, a salvo.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Pasaron muchos días flotando sobre el agua, sin ver tierra por ningún lado. Noé soltó una paloma para ver si encontraba un lugar seco donde posarse, pero la paloma volvió, sin nada.\n\nUna semana después, la volvió a soltar. Esta vez, la paloma regresó con una rama de olivo en el pico — la señal de que, en algún lugar, el agua ya se estaba retirando.\n\nCuando por fin el arca tocó tierra firme, Noé abrió una ventana y respiró un aire distinto: limpio, nuevo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Toda la familia y todos los animales salieron del arca, después de tanto tiempo, y pisaron tierra seca otra vez. El sol brillaba como nunca, y en el cielo, justo sobre ellos, apareció un arcoíris enorme, con todos sus colores.\n\n—Esa es mi promesa —le dijo Dios a Noé—. Cada vez que veas un arcoíris, acuérdate: yo siempre voy a cuidar de ustedes.\n\nNoé miró el arcoíris, y después miró a su familia, sana y salva a su lado, y supo que había valido la pena confiar, aunque nadie más le hubiera creído.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué historia, ¿no? Noé confió en Dios durante años, aunque nadie a su alrededor entendía por qué. Y esa confianza cuidó a toda su familia.\n\n¿Alguna vez hiciste algo difícil porque confiabas en que era lo correcto, aunque otros no lo entendieran?",
      },
    ],
    conversationQuestions: ["¿Alguna vez hiciste algo difícil porque confiabas en que era lo correcto?"],
  },
  {
    id: "buen-samaritano",
    contentType: "historia",
    title: "El buen samaritano",
    subtitle: "Ayudar a quien lo necesita, aunque no lo conozcas",
    description: "Un maestro de la ley pregunta quién es su prójimo, y Jesús responde con la historia de un hombre herido y del único que se detuvo a ayudarlo.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "parabolas",
    episodeNumber: 3,
    lengthCategory: "historia-corta",
    durationSeconds: 337,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "el maestro de la ley", "el samaritano", "el sacerdote", "el levita"],
    tags: ["valores"],
    passages: ["Lucas 10:25–37"],
    language: "es",
    illustrationSlug: "story-buen-samaritano",
    illustrations: [
      {
        id: "story-buen-samaritano-i1",
        sceneId: "story-buen-samaritano",
        order: 1,
        narrativeMoment: "El samaritano vendando al hombre herido en el camino.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-buen-samaritano-v2.txt",
        characterVersions: { "buen-samaritano": "v2" },
        image300: "/lumo-art/story-buen-samaritano-v2_300.webp",
        image600: "/lumo-art/story-buen-samaritano-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "book",
        caption:
          "Cerca de Jerusalén, un maestro de la ley se acercó a Jesús. No venía a aprender — venía a ponerlo a prueba.\n\n—Maestro —dijo, con una media sonrisa—, ¿qué debo hacer para heredar la vida eterna?\n\nJesús lo miró con calma, sin apuro.\n\n—¿Qué dice la ley? —preguntó—. Tú la conoces bien. ¿Qué lees ahí?\n\nEl hombre respondió de memoria, casi sin pensarlo: —Amarás al Señor tu Dios con todo tu corazón, con toda tu alma, con todas tus fuerzas... y a tu prójimo como a ti mismo.\n\n—Bien dicho —contestó Jesús—. Haz eso, y vivirás.\n\nPero el maestro de la ley quería quedar bien delante de los demás. Así que insistió:\n\n—¿Y quién es mi prójimo?\n\nJesús guardó silencio un momento. Después empezó a contar una historia.",
      },
      {
        role: "narracion",
        mood: "night",
        sfx: "viento-desierto",
        caption:
          "El camino de Jerusalén a Jericó bajaba casi 1,000 metros entre rocas afiladas y curvas cerradas, un camino angosto donde el sonido de tus propios pasos rebotaba en la piedra. Era conocido por algo más: ahí se escondían los bandidos, entre las grietas, esperando.\n\nUn hombre viajaba solo, con su bolso al hombro, sin sospechar que unos ojos lo seguían desde una roca alta.\n\nLo atacaron sin aviso. Le arrancaron la ropa, le quitaron todo lo que llevaba, y lo golpearon una y otra vez hasta dejarlo tirado a un costado del camino, medio muerto, bajo un sol que ya empezaba a quemar la piel.\n\nEl viento levantaba el polvo seco entre las rocas. El hombre apenas podía respirar, apenas podía moverse. Y el camino, que un minuto antes parecía tranquilo, ahora se sentía completamente vacío — como si el mundo entero se hubiera ido.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Pasó un tiempo largo. El sol se movió en el cielo. Al fin, alguien apareció a lo lejos, caminando despacio: un sacerdote, todavía con las ropas de su servicio en el templo de Jerusalén.\n\nSe acercó, paso a paso. Vio el cuerpo tirado en el suelo, la sangre ya oscura y seca sobre la ropa rota, una respiración tan débil que casi no se notaba.\n\nAminoró el paso, dudando.\n\n—Si lo toco y ya está muerto —pensó, casi en voz alta—, quedaré impuro. No podré cumplir con mis deberes en el templo esta semana. Además, seguro alguien más viene detrás de mí.\n\nSin decir una palabra, sin siquiera acercarse del todo, cruzó hacia el otro lado del camino, tan lejos como pudo. Apuró el paso. No volvió a mirar atrás — como si no mirar pudiera hacer que lo que había visto dejara de ser verdad.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Más tarde, cuando el sol ya empezaba a bajar, pasó un levita — alguien que también servía en el templo, ayudando a los sacerdotes.\n\nSe acercó lo suficiente para ver la sangre en la ropa del herido, para escuchar el quejido bajito que todavía salía de su boca. Dudó un instante. Dio un paso hacia él.\n\nPero enseguida se detuvo.\n\n—Tengo prisa —se dijo, casi en voz alta, como para convencerse a sí mismo—. Me esperan en Jericó antes de que anochezca. Seguro alguien más se detiene a ayudarlo, alguien con más tiempo que yo.\n\nY siguió caminando, cada vez más rápido, sin mirar hacia atrás, como si apurar el paso pudiera borrar lo que sus propios ojos acababan de ver.",
      },
      {
        role: "narracion",
        mood: "prayer",
        sfx: "tela-vendaje",
        caption:
          "Por último, apareció un samaritano — de un pueblo que los judíos evitaban, con el que ni siquiera se hablaban en tiempos normales.\n\nPero cuando lo vio, no pensó en las diferencias entre ambos. Sintió compasión, así, de golpe, sin pensarlo dos veces.\n\nSe bajó de su burro. Se arrodilló junto al hombre, limpió sus heridas con aceite y vino, y las cubrió con tela, con cuidado, como quien cuida a alguien de su propia familia.\n\nLo subió a su propio animal y caminó a su lado hasta una posada cercana. Esa noche, no lo dejó solo.\n\nAl día siguiente, antes de partir, sacó unas monedas y se las entregó al dueño de la posada.\n\n—Cuida de él —le pidió—. Y si gastas más que esto, yo te lo pagaré cuando vuelva por aquí.\n\nEl hombre que nadie conocía se había convertido, para ese viajero herido, en la única esperanza de todo el camino.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Jesús terminó la historia y se quedó mirando al maestro de la ley, que ya no sonreía como al principio.\n\n—Dime —le preguntó Jesús—: de los tres que pasaron por ese camino, ¿cuál de ellos fue el prójimo del hombre que cayó en manos de los bandidos?\n\nEl maestro de la ley se quedó callado un momento largo. No podía decir \"el sacerdote\", ni \"el levita\" — los dos habían cruzado la calle para evitarlo. Al final respondió, casi en voz baja, como si le costara decirlo:\n\n—El que tuvo compasión de él.\n\nNi siquiera podía nombrar al samaritano en voz alta.\n\n—Ve —le dijo Jesús, con una calidez que no tenía nada de reproche— y haz tú lo mismo.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "A veces creemos que ayudar es solo para la gente que ya conocemos, o que se parece a nosotros. Pero el samaritano nos enseña que el amor de verdad no pregunta primero quién es el otro.\n\n¿Cómo puedes ayudar esta semana a alguien que quizás no conoces tan bien?",
      },
    ],
    conversationQuestions: ["¿Cómo puedes ayudar a alguien esta semana, aunque no lo conozcas bien?"],
  },
  {
    id: "moises-mar-rojo",
    contentType: "historia",
    title: "Moisés cruza el mar",
    subtitle: "Dios abre caminos donde parece que no los hay",
    description: "El pueblo de Moisés quedó atrapado entre el ejército y el mar — hasta que Dios abrió un camino seco entre las aguas.",
    category: "antiguo",
    collectionId: "historias-biblicas",
    seriesId: "moises",
    episodeNumber: 4,
    lengthCategory: "historia-epica",
    durationSeconds: 316,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Moisés", "Miriam", "Faraón"],
    tags: ["personajes", "milagros"],
    passages: ["Éxodo 14:1–31"],
    language: "es",
    illustrationSlug: "story-moises-mar-rojo",
    illustrations: [
      {
        id: "story-moises-mar-rojo-i1",
        sceneId: "story-moises-mar-rojo",
        order: 1,
        narrativeMoment: "Moisés con el mar dividido y el pueblo cruzando.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-moises-mar-rojo-v2.txt",
        characterVersions: { "moises": "v2" },
        image300: "/lumo-art/story-moises-mar-rojo-v2_300.webp",
        image600: "/lumo-art/story-moises-mar-rojo-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "El pueblo caminaba desde hacía días, todos juntos, cargando lo poco que habían podido llevarse. Durante años habían sido esclavos en Egipto, obligados a trabajar sin descanso — y ahora, por fin, eran libres. De día, una columna de nube los guiaba por el camino; de noche, una columna de fuego alumbraba el campamento para que nadie tuviera miedo de la oscuridad.\n\n—¿A dónde vamos? —le preguntó un niño a su madre, mirando esa nube enorme flotando delante de todos.\n\n—A la tierra que Dios nos prometió —respondió ella, apretándole la mano—. Dios mismo nos está mostrando el camino.\n\nAdelante de todos caminaba Moisés, con su hermana Miriam a su lado, guiando al pueblo que Dios le había confiado.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Pero en Egipto, el Faraón empezó a arrepentirse.\n\n—¿Qué hemos hecho? —dijo, furioso, a sus generales—. ¡Dejamos ir a todos nuestros esclavos!\n\nMandó preparar sus carros de guerra, seiscientos de sus mejores carros, y salió con todo su ejército a perseguir al pueblo que se había ido.\n\nEl pueblo acampaba junto al mar Rojo, descansando por fin, cuando alguien miró hacia atrás y vio una nube de polvo enorme levantándose en el horizonte.\n\n—¡Es el ejército del Faraón! —gritó, y el grito corrió de familia en familia como un escalofrío.\n\nAdelante, el mar. Atrás, los carros de guerra acercándose cada vez más rápido. No había a dónde correr.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "El pánico se extendió por todo el campamento. Algunos lloraban, otros gritaban, y muchos corrieron hasta donde estaba Moisés.\n\n—¿No había tumbas suficientes en Egipto —le reclamó uno—, que nos trajiste a morir aquí, en el desierto? ¡Mejor hubiera sido seguir siendo esclavos, que morir así!\n\nMoisés sintió el miedo de todos encima suyo, pesado como una piedra. Pero respiró hondo, y levantó las manos para que lo escucharan.\n\n—No tengan miedo —dijo, con una voz que intentaba ser firme aunque por dentro también temblaba—. Quédense quietos, y vean cómo Dios los salva hoy. A los egipcios que ven ahora, no volverán a verlos nunca más. El Señor va a pelear por ustedes; ustedes solo tienen que estar tranquilos.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Entonces Dios le habló a Moisés:\n\n—Extiende tu bastón sobre el mar.\n\nMoisés caminó hasta la orilla, con todo el pueblo conteniendo la respiración detrás de él, y levantó su bastón sobre las aguas.\n\nUn viento fuerte empezó a soplar — no un viento cualquiera, sino uno que venía directo del cielo, y que sopló toda la noche, sin detenerse. Poco a poco, ante los ojos de todos, el mar comenzó a abrirse: las aguas se levantaron como dos paredes, una a cada lado, y entre ellas quedó un camino de tierra seca, tan ancho como para que todo el pueblo pudiera cruzar junto.\n\nNadie dijo una palabra. Solo se escuchaba el viento, y el sonido de las aguas quietas, esperando.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Moisés dio el primer paso sobre la tierra seca, y el pueblo entero empezó a cruzar detrás de él, entre esas dos paredes de agua que no caían.\n\nLos niños miraban hacia arriba, asombrados, tomados fuerte de la mano de sus padres. Algunos estiraban los dedos para casi tocar el agua, sin animarse del todo. Las familias cruzaban juntas, cargando lo que tenían, sin dejar de mirar hacia adelante, hacia el otro lado.\n\nDetrás de ellos, ya se veían las antorchas del ejército egipcio llegando a la orilla — pero el pueblo de Dios seguía caminando, paso a paso, por un camino que minutos antes había sido mar.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "El ejército del Faraón, al ver el camino abierto, se lanzó detrás del pueblo, con todos sus carros y caballos. Pero las ruedas de los carros empezaron a atascarse en la tierra húmeda, y el avance se hizo cada vez más difícil.\n\n—¡Alejémonos! —gritó uno de los soldados egipcios—. ¡El Dios de Israel está peleando por ellos!\n\nPara entonces, el último israelita ya había puesto el pie en la otra orilla, a salvo.\n\nDios le habló otra vez a Moisés:\n\n—Extiende tu mano sobre el mar de nuevo.\n\nMoisés obedeció, y las paredes de agua, que habían esperado pacientes toda la noche, volvieron a su lugar, cerrando el camino para siempre.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Del otro lado, a salvo, el pueblo entero miró hacia atrás y vio el mar tranquilo otra vez, como si nada hubiera pasado. Miriam tomó una pandereta, y todas las mujeres la siguieron, cantando y danzando de alegría por lo que Dios había hecho.\n\n—¡Cantemos al Señor —cantaba Miriam, y su voz se escuchaba por toda la orilla— porque se ha cubierto de gloria!\n\nMoisés se quedó mirando el mar un momento, en silencio, todavía sin poder creer del todo lo que acababan de vivir.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué noche, ¿no? El pueblo estaba atrapado, sin ninguna salida — y justo ahí, donde parecía que no había ningún camino, Dios abrió uno.\n\n¿Alguna vez sentiste que un problema no tenía solución, y de repente se resolvió?",
      },
    ],
    conversationQuestions: ["¿Hubo alguna vez que un problema se solucionó justo cuando parecía imposible?"],
  },
  {
    id: "hijo-prodigo",
    contentType: "historia",
    title: "El hijo pródigo",
    subtitle: "Siempre hay un camino de regreso a casa",
    description: "Un hijo se fue de casa y lo perdió todo, pero cuando volvió arrepentido, su padre corrió a abrazarlo.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "parabolas",
    episodeNumber: 5,
    lengthCategory: "historia-estandar",
    durationSeconds: 193,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["El hijo menor", "El padre", "El hijo mayor"],
    tags: ["valores"],
    passages: ["Lucas 15:11–32"],
    language: "es",
    illustrationSlug: "story-hijo-prodigo",
    illustrations: [
      {
        id: "story-hijo-prodigo-i1",
        sceneId: "story-hijo-prodigo",
        order: 1,
        narrativeMoment: "El padre abraza con alegría al hijo que vuelve.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-hijo-prodigo-v2.txt",
        characterVersions: { "padre-prodigo": "v2", "hijo-prodigo": "v2" },
        image300: "/lumo-art/story-hijo-prodigo-v2_300.webp",
        image600: "/lumo-art/story-hijo-prodigo-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Un hombre tenía dos hijos. Un día, el más joven se acercó a su padre.\n\n—Papá —le dijo—, dame ahora la parte de la herencia que me toca.\n\nEra un pedido extraño, casi como desear que su padre ya no existiera. Pero el padre, sin decir una palabra de reproche, repartió lo que tenía entre sus dos hijos.\n\nPocos días después, el hijo menor juntó todo lo suyo y se fue lejos, a un país lejano, listo para vivir la vida que había imaginado.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "Allá lejos, el hijo gastó todo su dinero en fiestas y lujos, sin pensar en el mañana. Tenía amigos nuevos todas las noches, y nadie le preguntaba de dónde venía ni a dónde iba.\n\nPero el dinero se acabó. Y justo entonces, una hambruna enorme cayó sobre esa tierra. Sin un centavo, sin amigos, y sin nada que comer, el joven consiguió el único trabajo que encontró: cuidar cerdos en el campo de un desconocido.\n\nTenía tanta hambre que hasta la comida de los cerdos le parecía apetecible. Y nadie le daba nada.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Sentado en ese campo, solo, el joven pensó en su casa.\n\n—En la casa de mi padre —se dijo a sí mismo—, hasta los trabajadores tienen comida de sobra, y yo aquí me muero de hambre.\n\nDecidió volver. Ensayó las palabras una y otra vez durante el camino:\n\n—Papá, pequé contra el cielo y contra ti. Ya no merezco que me llames hijo. Solo déjame trabajar para ti, como uno más.\n\nCaminó de regreso con esas palabras en la boca, y con mucho miedo de lo que su padre diría al verlo así.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Pero su padre lo vio llegar desde muy lejos — porque, en realidad, todos los días miraba hacia ese mismo camino, esperando.\n\nY cuando lo reconoció, no esperó a que su hijo llegara hasta la puerta. Corrió hacia él, lo abrazó fuerte, y lo besó, cubierto todavía de polvo del camino.\n\n—Papá —alcanzó a decir el hijo—, pequé contra el cielo y contra ti. Ya no merezco...\n\n—¡Rápido! —interrumpió el padre, llamando a sus siervos, sin soltar a su hijo—. Traigan la mejor ropa, y pónganle un anillo en la mano. ¡Preparen la fiesta más grande que hayamos hecho! Mi hijo estaba muerto, y ha vuelto a la vida. Estaba perdido, ¡y lo hemos encontrado!",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "El hijo mayor, que trabajaba en el campo, escuchó la música y las risas de la fiesta desde lejos, y preguntó qué pasaba.\n\n—Tu hermano volvió —le dijeron—, y tu padre hizo una fiesta enorme por él.\n\nEl hermano mayor se enojó, y no quiso entrar. Su padre salió a buscarlo.\n\n—Hijo —le dijo el padre—, tú siempre estuviste conmigo, y todo lo que tengo es tuyo. Pero teníamos que festejar: tu hermano estaba perdido, y lo hemos encontrado. Estaba muerto, y ha vuelto a estar vivo.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué historia tan cálida, ¿no? El padre no esperó una disculpa perfecta: corrió a abrazar a su hijo apenas lo vio a lo lejos.\n\n¿Alguna vez pediste perdón por algo? ¿Cómo te sentiste después?",
      },
    ],
    conversationQuestions: ["¿Alguna vez pediste perdón por algo? ¿Cómo te sentiste después?"],
  },
  {
    id: "daniel-leones",
    contentType: "historia",
    title: "Daniel en el foso de los leones",
    subtitle: "Ser fiel, incluso cuando da miedo",
    description: "Daniel siguió orando a Dios todos los días aunque estaba prohibido, y Dios lo cuidó toda una noche entre leones.",
    category: "antiguo",
    collectionId: "historias-biblicas",
    seriesId: "daniel",
    episodeNumber: 6,
    lengthCategory: "historia-estandar",
    durationSeconds: 180,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Daniel", "el rey Darío"],
    tags: ["personajes", "valores"],
    passages: ["Daniel 6:1–28"],
    language: "es",
    illustrationSlug: "story-daniel-leones",
    illustrations: [
      {
        id: "story-daniel-leones-i1",
        sceneId: "story-daniel-leones",
        order: 1,
        narrativeMoment: "Daniel sereno en el foso de los leones.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-daniel-leones-v2.txt",
        characterVersions: { "daniel": "v2" },
        image300: "/lumo-art/story-daniel-leones-v2_300.webp",
        image600: "/lumo-art/story-daniel-leones-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Daniel vivía en un reino lejano, sirviendo al rey Darío, y lo hacía tan bien que el rey pensaba nombrarlo por encima de todos los demás gobernantes del reino.\n\nEso hizo que otros hombres, celosos de Daniel, empezaran a buscar algo — cualquier cosa — para acusarlo delante del rey. Pero no encontraban nada. Daniel era honesto, cuidadoso, y fiel en cada tarea que se le encomendaba.\n\n—La única forma de encontrar algo contra este hombre —se dijeron entre ellos— es por su forma de orar a su Dios.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "Así que esos hombres fueron con el rey Darío y le propusieron una ley:\n\n—Su majestad, que se firme un decreto: durante treinta días, nadie puede orarle a ningún dios ni a ningún hombre que no sea usted. El que lo haga, será arrojado al foso de los leones.\n\nEl rey, sin sospechar la trampa, firmó el decreto.\n\nDaniel se enteró de la nueva ley. Y aun así, esa misma tarde, subió a su cuarto, abrió la ventana que miraba hacia Jerusalén, tal como lo hacía siempre, y se arrodilló a orar a Dios, tres veces, como cada día de su vida.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Los hombres que lo acechaban lo encontraron orando, exactamente como esperaban, y corrieron a contárselo al rey.\n\n—¡Daniel no le hace caso a su decreto, majestad! ¡Sigue orando a su Dios tres veces al día!\n\nEl rey Darío se angustió muchísimo — él apreciaba a Daniel, y entendió demasiado tarde la trampa en la que había caído. Buscó toda la tarde una forma de salvarlo, pero la ley ya estaba firmada, y no podía deshacerse.\n\nCon tristeza, el rey ordenó que llevaran a Daniel al foso de los leones.\n\n—Que tu Dios, al que sirves siempre —le dijo el rey, antes de que sellaran la entrada—, te salve.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa noche, el rey no pudo dormir. No comió, no quiso música, y apenas amaneció, corrió hasta el foso, angustiado, y gritó hacia adentro:\n\n—¡Daniel, siervo del Dios viviente! ¿Pudo tu Dios, al que sirves siempre, salvarte de los leones?\n\nDesde adentro, una voz respondió, tranquila:\n\n—¡Majestad, viva para siempre! Mi Dios envió a su ángel, y cerró la boca de los leones, para que no me hicieran ningún daño.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El rey, lleno de alegría, ordenó sacar a Daniel del foso enseguida. Cuando lo revisaron, no encontraron en él ni un rasguño — porque había confiado en su Dios.\n\nEl rey Darío, admirado por lo que había visto, escribió una nueva orden para todo el reino:\n\n—Que todos, en cada rincón de mi reino, respeten y teman al Dios de Daniel, porque él es el Dios viviente, y su reino jamás será destruido.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué noche tan larga habrá sido esa, ¿no? Daniel eligió seguir orando aunque eso significara arriesgarlo todo — y Dios estuvo con él, incluso ahí adentro, entre los leones.\n\n¿Alguna vez hiciste lo correcto aunque te diera miedo? ¿Qué pasó?",
      },
    ],
    conversationQuestions: ["¿Alguna vez hiciste lo correcto aunque te diera miedo? ¿Qué pasó?"],
  },
  {
    id: "jesus-tormenta",
    contentType: "historia",
    title: "Jesús calma la tormenta",
    subtitle: "La paz puede estar cerca aunque todo parezca peligroso",
    description: "Una tormenta enorme asustó a los discípulos, hasta que Jesús se levantó y le habló al viento y al mar.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "milagros-de-jesus",
    episodeNumber: 7,
    lengthCategory: "historia-corta",
    durationSeconds: 144,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "los discípulos"],
    tags: ["milagros"],
    passages: ["Marcos 4:35–41"],
    language: "es",
    illustrationSlug: "story-jesus-tormenta",
    illustrations: [
      {
        id: "story-jesus-tormenta-i1",
        sceneId: "story-jesus-tormenta",
        order: 1,
        narrativeMoment: "Jesús calma la tormenta ante el asombro de los discípulos.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-jesus-tormenta-v2.txt",
        characterVersions: { "jesus": "v2" },
        image300: "/lumo-art/story-jesus-tormenta-v2_300.webp",
        image600: "/lumo-art/story-jesus-tormenta-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Al caer la tarde, Jesús les dijo a sus discípulos:\n\n—Vamos al otro lado del lago.\n\nSubieron todos a la barca, cansados después de un día entero enseñando a la gente. Jesús, agotado, se acomodó en la parte de atrás, apoyó la cabeza sobre un almohadón, y se quedó dormido casi enseguida, mecido por el suave vaivén del agua.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Pero el cielo empezó a cambiar. Nubes oscuras taparon las estrellas, y de pronto un viento fortísimo se levantó sobre el lago. Las olas, cada vez más grandes, golpeaban los costados de la barca y entraban a bordo, mojando todo.\n\nLos discípulos, muchos de ellos pescadores con años de experiencia en ese mismo lago, nunca habían visto una tormenta así.\n\n—¡Vamos a hundirnos! —gritó uno, mientras achicaba agua con las manos.\n\nY Jesús, en medio de todo ese caos, seguía dormido.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Aterrados, los discípulos corrieron hasta donde dormía Jesús y lo despertaron, gritando por encima del ruido del viento y las olas.\n\n—¡Maestro! ¡Maestro! —le decían, sacudiéndolo—. ¿No te importa que nos estemos hundiendo?\n\nJesús se levantó despacio, se puso de pie en medio de la barca que se sacudía violentamente, y miró hacia el cielo oscuro y hacia el mar embravecido.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "—¡Cálmate! ¡Está quieto! —dijo Jesús, con una voz firme, dirigida directamente al viento y a las olas.\n\nY en ese mismo instante, el viento se detuvo. Las olas, que segundos antes golpeaban la barca con violencia, se aquietaron por completo, hasta dejar el mar liso como un espejo.\n\nUn silencio enorme cayó sobre todos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Jesús se dio vuelta hacia sus discípulos, todavía empapados y temblando, no ya de frío sino de asombro.\n\n—¿Por qué tienen tanto miedo? —les preguntó, con calma—. ¿Todavía no confían en mí?\n\nLos discípulos se miraron entre ellos, sin saber bien qué decir.\n\n—¿Quién es este —se preguntaban, asombrados— que hasta el viento y el mar le obedecen?",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué susto habrán tenido esa noche, ¿no? Y justo en medio de la tormenta más fuerte, la paz estaba ahí, más cerca de lo que pensaban.\n\n¿Qué cosas te ayudan a sentir calma cuando algo te asusta?",
      },
    ],
    conversationQuestions: ["¿Qué cosas te ayudan a sentir calma cuando algo te asusta?"],
  },
  {
    id: "jose-hermanos",
    contentType: "historia",
    title: "José y sus hermanos",
    subtitle: "El perdón puede sanar hasta las heridas más viejas",
    description: "Los hermanos de José lo trataron muy mal, pero años después José eligió perdonarlos con todo su corazón.",
    category: "antiguo",
    collectionId: "historias-biblicas",
    seriesId: "jose",
    episodeNumber: 8,
    lengthCategory: "historia-epica",
    durationSeconds: 269,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["José", "los hermanos de José", "Jacob"],
    tags: ["personajes", "valores"],
    passages: ["Génesis 37:1–36", "Génesis 45:1–28"],
    language: "es",
    illustrationSlug: "story-jose-hermanos",
    illustrations: [
      {
        id: "story-jose-hermanos-i1",
        sceneId: "story-jose-hermanos",
        order: 1,
        narrativeMoment: "José abraza con perdón a sus hermanos.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-jose-hermanos-v2.txt",
        characterVersions: { "jose": "v2" },
        image300: "/lumo-art/story-jose-hermanos-v2_300.webp",
        image600: "/lumo-art/story-jose-hermanos-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "José era el hijo favorito de su padre Jacob, y eso sus hermanos mayores no se lo perdonaban. Para hacerlo peor, Jacob le había regalado a José una túnica preciosa, de colores, distinta a la de todos los demás.\n\n—Papá lo quiere más a él —se quejaban entre ellos, cada vez con más rabia.\n\nUna noche, José tuvo un sueño extraño y se lo contó a sus hermanos sin pensarlo dos veces:\n\n—Soñé que estábamos atando manojos de trigo en el campo, y el mío se levantaba, y los de ustedes se inclinaban ante el mío.\n\nSus hermanos lo escucharon en silencio, y el odio que ya sentían por él creció todavía más.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Un día, Jacob envió a José a buscar a sus hermanos, que estaban cuidando el rebaño lejos de casa. Apenas lo vieron acercarse, con su túnica de colores brillando entre los árboles, algo se rompió dentro de ellos.\n\n—Ahí viene el soñador —dijo uno, con desprecio—. Matémoslo, y digamos que un animal salvaje lo devoró. Ya veremos qué pasa con sus sueños.\n\nRubén, el hermano mayor, logró convencerlos de no matarlo, pero lo tiraron a un pozo vacío y seco. Y cuando pasó una caravana de mercaderes, decidieron algo casi igual de cruel: lo vendieron como esclavo.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Los hermanos mancharon la túnica de colores con sangre de animal, y se la llevaron a su padre.\n\n—La encontramos así —le dijeron, sin mirarlo a los ojos—. ¿No es la túnica de José?\n\nJacob reconoció la túnica de inmediato, y lloró como nunca antes había llorado, convencido de que su hijo amado había muerto devorado por una fiera. Nadie logró consolarlo.\n\nMientras tanto, lejos de ahí, José llegaba encadenado a Egipto, vendido como esclavo en la casa de un funcionario egipcio, sin nadie conocido a su lado.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "En Egipto, José trabajó con tanta honestidad y sabiduría que, aunque pasó incluso un tiempo injustamente preso, terminó llamando la atención del mismísimo Faraón, gracias a su capacidad de interpretar sueños.\n\nCuando José interpretó correctamente un sueño del Faraón — que anunciaba siete años de abundancia seguidos de siete años de hambre — el Faraón quedó tan impresionado que lo puso a cargo de todo Egipto, segundo solo después de él mismo.\n\nJosé organizó a todo el país durante los años buenos, guardando grano de sobra para cuando llegara el hambre.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Y llegó el hambre, tal como José había anunciado — no solo en Egipto, sino en toda la región, incluida la tierra donde vivían su padre y sus hermanos.\n\nJacob envió a sus hijos a Egipto a comprar grano, porque había escuchado que allá sí había alimento. Los hermanos viajaron, se presentaron ante el gobernador de Egipto para pedir ayuda, y se inclinaron ante él sin saber quién era en realidad.\n\nJosé los reconoció de inmediato. Ellos, a él, no — habían pasado muchos años, y lo último que sabían de José era que lo habían vendido como esclavo.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "José se apartó a llorar en secreto más de una vez, abrumado por volver a ver a sus hermanos después de tanto tiempo. Finalmente, ya no pudo contenerse más, y les pidió a todos los egipcios que salieran de la sala, para quedar a solas con ellos.\n\n—Yo soy José —les dijo, en su propio idioma—. ¿Vive todavía mi padre?\n\nSus hermanos se quedaron mudos, paralizados de miedo. El hermano que habían vendido como esclavo estaba ahora frente a ellos, con poder sobre sus propias vidas.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—Acérquense —les dijo José, con los ojos llenos de lágrimas—. No tengan miedo. Es verdad que ustedes me vendieron, pensando en hacerme daño. Pero Dios lo transformó en algo bueno, para salvar la vida de muchísima gente, incluidos ustedes.\n\nJosé abrazó a cada uno de sus hermanos, uno por uno, llorando junto a ellos. Después mandó traer a su padre Jacob y a toda la familia a vivir cerca de él, en Egipto, donde nunca más les faltaría alimento.\n\nLo que sus hermanos habían hecho para lastimarlo, José eligió no cargarlo más — y lo transformó en un reencuentro.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué historia tan larga de cargar, ¿no? José tuvo muchos años y muchas razones para guardar rencor — y sin embargo, cuando llegó el momento, eligió perdonar con todo su corazón.\n\n¿Alguna vez perdonaste a alguien que te lastimó? ¿Cómo te sentiste?",
      },
    ],
    conversationQuestions: ["¿Alguna vez perdonaste a alguien que te lastimó? ¿Cómo te sentiste?"],
  },
  {
    id: "ester-reina",
    contentType: "historia",
    title: "Ester, la reina valiente",
    subtitle: "A veces Dios nos pone en el lugar justo para ayudar a otros",
    description: "Ester se convirtió en reina en secreto, y cuando su pueblo estuvo en peligro, habló con valentía ante el rey.",
    category: "antiguo",
    collectionId: "historias-biblicas",
    seriesId: "ester",
    episodeNumber: 9,
    lengthCategory: "historia-estandar",
    durationSeconds: 214,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Ester", "Mardoqueo", "el rey Asuero", "Amán"],
    tags: ["personajes", "mujeres", "valores"],
    passages: ["Ester 4–7"],
    language: "es",
    illustrationSlug: "story-ester-reina",
    illustrations: [
      {
        id: "story-ester-reina-i1",
        sceneId: "story-ester-reina",
        order: 1,
        narrativeMoment: "Ester con serena valentía en el palacio.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/story-ester-reina-v2.txt",
        characterVersions: { "ester": "v2" },
        image300: "/lumo-art/story-ester-reina-v2_300.webp",
        image600: "/lumo-art/story-ester-reina-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Ester era una joven judía que vivía en Persia, criada por su primo Mardoqueo desde muy chica, como si fuera su propia hija. Cuando el rey Asuero buscó una nueva reina entre todas las jóvenes del reino, Ester fue elegida entre todas — pero, siguiendo el consejo de Mardoqueo, guardó en secreto que ella pertenecía al pueblo de Dios.\n\nDesde el palacio, Ester se convirtió en reina, pero nunca dejó de escuchar los consejos de Mardoqueo, que se quedaba cerca, cuidándola desde lejos.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "En el reino había un hombre llamado Amán, que ocupaba un cargo muy importante, y exigía que todos se inclinaran ante él al pasar. Mardoqueo, fiel a Dios, se negó a inclinarse ante ningún hombre.\n\nEso llenó de furia a Amán, quien descubrió que Mardoqueo era judío, y decidió algo terrible: convenció al rey de firmar un decreto para destruir a todo el pueblo judío del reino, en un solo día, sin que el rey supiera que su propia reina era parte de ese pueblo.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Cuando Mardoqueo se enteró del decreto, se vistió de luto y lloró amargamente frente al palacio. Le envió un mensaje urgente a Ester, contándole todo, y pidiéndole que fuera ante el rey a suplicar por su pueblo.\n\nPero había un problema: nadie podía presentarse ante el rey sin ser llamado — ni siquiera la reina — bajo pena de muerte, a menos que el rey extendiera su cetro de oro en señal de perdón.\n\nEster, asustada, dudó. Pero Mardoqueo le envió una última palabra:\n\n—¿Quién sabe si no llegaste a ser reina precisamente para un momento como este?",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Ester tomó una decisión. Pidió a todo su pueblo que ayunara y orara por ella durante tres días.\n\n—Después iré ante el rey, aunque no haya sido llamada —dijo—. Y si perezco, que perezca.\n\nAl tercer día, Ester se vistió con sus mejores ropas reales y caminó, con el corazón latiéndole fuerte, hasta la entrada del salón del trono, donde el rey no sabía que ella iba a presentarse.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "El rey Asuero la vio de pie en la entrada, y en vez de enojarse, extendió hacia ella su cetro de oro — la señal de que podía acercarse sin ningún peligro.\n\n—¿Qué te pasa, reina Ester? —le preguntó—. Pide lo que quieras, y te lo daré, hasta la mitad de mi reino.\n\nCon calma y valentía, Ester invitó al rey y a Amán a un banquete especial. Y en ese banquete, por fin, Ester habló:\n\n—Mi rey, si he hallado gracia ante tus ojos, te pido que salves mi vida y la de mi pueblo — porque hemos sido vendidos para ser destruidos.\n\nEl rey, sorprendido, preguntó quién se había atrevido a planear algo así.\n\n—Un enemigo —respondió Ester, señalando directamente a Amán— es este hombre malvado que está aquí.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El rey, furioso al descubrir la traición, revocó el plan de Amán y protegió a todo el pueblo judío del reino, incluida su propia reina. Lo que parecía una tragedia inevitable se transformó, gracias a la valentía de una sola persona, en salvación para todo un pueblo.\n\nDesde entonces, cada año, el pueblo judío celebra ese día, recordando cómo Dios usó el coraje de Ester justo en el momento en que más se necesitaba.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué decisión tan valiente, ¿no? Ester pudo haberse quedado callada, a salvo en el palacio — pero eligió arriesgarse por su pueblo.\n\n¿Alguna vez tuviste que ser valiente para ayudar a alguien más?",
      },
    ],
    conversationQuestions: ["¿Alguna vez tuviste que ser valiente para ayudar a alguien más?"],
  },
  {
    id: "antes-de-dormir",
    contentType: "oracion",
    title: "Antes de dormir",
    subtitle: "Para cerrar el día en paz",
    description: "Una oración guiada por Lumo para agradecer el día y dormir tranquilo, sabiendo que Dios cuida toda la noche.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "momento-dormir",
    durationSeconds: 72,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Salmo 4:8"],
    language: "es",
    illustrationSlug: "prayer-antes-de-dormir",
    illustrations: [
      {
        id: "prayer-antes-de-dormir-i1",
        sceneId: "prayer-antes-de-dormir",
        order: 1,
        narrativeMoment: "Un padre acomoda la manta de un niño que se queda dormido, luz de velador.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-antes-de-dormir-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-antes-de-dormir-v2_300.webp",
        image600: "/lumo-art/prayer-antes-de-dormir-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "night",
        caption:
          "El día ya terminó, y llegó el momento de descansar. Antes de cerrar los ojos, vamos a hacer una pausa juntos, para agradecer por todo lo que vivimos hoy.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Piensa en un momento lindo de hoy — puede ser grande o chiquito: un abrazo, un juego, una risa compartida. Dios estuvo presente en cada uno de esos momentos, aunque no lo hayas notado en su momento.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Piensa también en las personas que te acompañaron hoy — tu familia, tus amigos, quienes te cuidaron. Ellos también son parte de los regalos de este día.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: gracias, Dios, por este día. Gracias por cada momento bueno, y también por los que fueron difíciles, porque de todos aprendemos algo.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Cuida mis sueños esta noche, y cuida también a toda mi familia mientras dormimos. Que descansemos tranquilos, sabiendo que estás cerca, incluso cuando ya no podamos sentirlo.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Ahora, cierra los ojos despacio. Respira hondo... y suelta el aire lentamente. El día ya se cierra, en paz.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Que descanses tranquilo. Dios te cuida mientras duermes, y va a seguir ahí, cuidándote, hasta que llegue la mañana. Buenas noches.",
      },
    ],
    conversationQuestions: ["¿Cuál fue el momento más lindo de tu día?"],
  },
  {
    id: "dar-gracias",
    contentType: "oracion",
    title: "Dar gracias",
    subtitle: "Para reconocer las cosas buenas",
    description: "Una oración guiada para practicar la gratitud, nombrando en voz alta las cosas buenas del día.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 62,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["1 Tesalonicenses 5:18"],
    language: "es",
    illustrationSlug: "prayer-dar-gracias",
    illustrations: [
      {
        id: "prayer-dar-gracias-i1",
        sceneId: "prayer-dar-gracias",
        order: 1,
        narrativeMoment: "Un niño le muestra con orgullo un dibujo a un adulto.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-dar-gracias-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-dar-gracias-v2_300.webp",
        image600: "/lumo-art/prayer-dar-gracias-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Hoy vamos a dedicar un momento a agradecer. A veces el día pasa tan rápido que no nos detenemos a notar todo lo bueno que ya tenemos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Piensa en tres cosas buenas que te pasaron hoy, por pequeñas que parezcan — una comida rica, un juego divertido, alguien que te hizo sonreír.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "La gratitud no espera a que todo sea perfecto. Se puede agradecer incluso en un día difícil, si buscamos con atención los pequeños momentos buenos.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: gracias, Dios, por este nuevo día. Gracias por mi familia, que me cuida incondicionalmente, y por cada persona que me acompaña.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Gracias también por las cosas simples: un techo, comida, un lugar seguro donde dormir. A veces damos por hecho lo que en realidad es un regalo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Dar gracias no cambia lo que pasó hoy, pero cambia cómo lo miramos — nos ayuda a ver todo lo bueno que ya tenemos, en vez de solo lo que nos falta.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Que esta noche te acuestes agradecido, sabiendo que mañana va a haber nuevas cosas por las cuales dar gracias otra vez.",
      },
    ],
    conversationQuestions: ["¿Qué cosa buena te pasó hoy que quieras agradecer?"],
  },
  {
    id: "cuando-tengo-miedo",
    contentType: "oracion",
    title: "Cuando tengo miedo",
    subtitle: "Para sentir la compañía de Dios",
    description: "Una oración guiada para los momentos de miedo, recordando que nunca estamos solos.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 109,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Isaías 41:10"],
    language: "es",
    illustrationSlug: "prayer-cuando-tengo-miedo",
    illustrations: [
      {
        id: "prayer-cuando-tengo-miedo-i1",
        sceneId: "prayer-cuando-tengo-miedo",
        order: 1,
        narrativeMoment: "Un adulto abraza fuerte a un niño de noche, luz cálida de pasillo.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-cuando-tengo-miedo-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-cuando-tengo-miedo-v2_300.webp",
        image600: "/lumo-art/prayer-cuando-tengo-miedo-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "night",
        caption:
          "El día ya terminó, y ahora estamos en este momento tranquilo, solo nosotros. Si hoy sentiste miedo — de la oscuridad, de algo que pasó, de algo que todavía no pasó — quiero que sepas que está bien. Todos, hasta los adultos, sentimos miedo alguna vez.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Vamos a respirar juntos, despacio. Inhala... cuenta hasta tres... y suelta el aire despacio, como si estuvieras apagando una velita. Una vez más: inhala... y suelta. El miedo se hace un poquito más chico cada vez que respiramos así.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "No hace falta que sepas explicar exactamente qué es lo que te asusta. A veces el miedo no tiene una forma clara, y eso también está bien. Lo que sí es cierto es esto: no estás solo enfrentándolo.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Dios está cerca, incluso en los momentos en los que no lo sentimos, incluso en la oscuridad, incluso cuando todo parece más grande de lo que es. Él no se aleja cuando tenemos miedo — se queda más cerca todavía.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orarle juntos: Dios, hoy tuve miedo. Te pido que me des tu paz, que me ayudes a sentirme seguro, y que me recuerdes que no estoy solo, ni ahora ni ninguna otra noche.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Ayúdame a ser valiente no porque no tenga miedo, sino porque sé que estás conmigo, sosteniéndome, incluso cuando cierro los ojos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Y aunque a veces el miedo aparece de noche, cuando estás solo en tu cuarto, recuerda: las personas que te aman están cerca, aunque estén en otra habitación. Y Dios está todavía más cerca que eso.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Ahora, cierra los ojos despacio. El miedo se queda afuera, esta noche. Aquí adentro, contigo, solo hay calma. Buenas noches.",
      },
    ],
    conversationQuestions: ["¿Qué es lo que más te ayuda cuando tienes miedo?"],
  },
  {
    id: "cuando-estoy-triste",
    contentType: "oracion",
    title: "Cuando estoy triste",
    subtitle: "Para encontrar consuelo",
    description: "Una oración guiada para los días tristes, para sentirse acompañado y en paz.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 69,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Salmo 34:18"],
    language: "es",
    illustrationSlug: "prayer-cuando-estoy-triste",
    illustrations: [
      {
        id: "prayer-cuando-estoy-triste-i1",
        sceneId: "prayer-cuando-estoy-triste",
        order: 1,
        narrativeMoment: "Un niño apoyado en un adulto mirando la luz de atardecer por la ventana.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-cuando-estoy-triste-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-cuando-estoy-triste-v2_300.webp",
        image600: "/lumo-art/prayer-cuando-estoy-triste-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "diary",
        caption:
          "Si hoy estás triste, quiero que sepas algo importante: está bien sentirlo. La tristeza no es algo que hay que esconder o apurar a que se vaya.",
      },
      {
        role: "narracion",
        mood: "diary",
        caption:
          "A veces la tristeza viene de algo que pasó, y a veces llega sin que sepamos bien por qué. De las dos formas, es una emoción real, y merece espacio para sentirse.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Dios está cerca de los que tienen el corazón herido. No hace falta explicarle exactamente qué te pasa — Él ya lo sabe, y igual se queda cerca.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: Dios, ayúdame en este momento triste. Lléname de tu paz, y ayúdame a sentir que no estoy solo cargando esto.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Ayúdame también a recordar que la tristeza no dura para siempre — que después de los días grises, la luz vuelve a aparecer, aunque hoy cueste creerlo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Recuerda: siempre hay alguien que te quiere y te acompaña, aunque en este momento la tristeza haga que todo se sienta más solitario de lo que realmente es.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Respira despacio... y permítete sentir esto, sin apuro. Mañana es un nuevo día, y hoy, esta noche, está bien simplemente descansar.",
      },
    ],
    conversationQuestions: ["¿Quieres contarle a alguien de tu familia por qué estás triste hoy?"],
  },
  {
    id: "antes-de-un-examen",
    contentType: "oracion",
    title: "Antes de un examen",
    subtitle: "Para sentir calma y confianza",
    description: "Una oración guiada para antes de un examen o un reto importante, para enfrentarlo con calma.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 61,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Filipenses 4:13"],
    language: "es",
    illustrationSlug: "prayer-antes-de-un-examen",
    illustrations: [
      {
        id: "prayer-antes-de-un-examen-i1",
        sceneId: "prayer-antes-de-un-examen",
        order: 1,
        narrativeMoment: "Un niño frente a su cuaderno con la mano de un adulto en el hombro, calma tranquila.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-antes-de-un-examen-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-antes-de-un-examen-v2_300.webp",
        image600: "/lumo-art/prayer-antes-de-un-examen-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "book",
        caption:
          "Sé que tienes un reto importante por delante. Vamos a prepararnos juntos, no con más estudio, sino con calma.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "Ya estudiaste, ya te preparaste lo que pudiste. Ahora, en este momento, ya no se trata de aprender más — se trata de confiar en lo que ya sabes.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Es normal sentir un poco de nervios antes de algo importante. Eso no significa que te vaya a ir mal — significa que te importa, y eso está bien.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: Dios, dame fuerza para enfrentar este momento con calma. Ayúdame a recordar lo que aprendí, y a confiar en mi propio esfuerzo.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Ayúdame también a no ser tan duro conmigo mismo si algo no sale perfecto. Lo que importa es haber hecho mi mejor esfuerzo, no ser perfecto.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Pase lo que pase, ya hiciste la parte que te tocaba: te preparaste. Eso, por sí solo, ya es un logro, sin importar el resultado.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Ahora, descansa. Un buen descanso te va a ayudar más que repasar una vez más. Confía, y descansa tranquilo.",
      },
    ],
    conversationQuestions: ["¿Qué hiciste para prepararte para este reto?"],
  },
  {
    id: "por-mi-familia",
    contentType: "oracion",
    title: "Por mi familia",
    subtitle: "Para cuidar a quienes amamos",
    description: "Una oración guiada para pedir por el bienestar y la protección de la familia.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 65,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Josué 24:15"],
    language: "es",
    illustrationSlug: "prayer-por-mi-familia",
    illustrations: [
      {
        id: "prayer-por-mi-familia-i1",
        sceneId: "prayer-por-mi-familia",
        order: 1,
        narrativeMoment: "La familia completa reunida alrededor de la mesa, de noche.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-por-mi-familia-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-por-mi-familia-v2_300.webp",
        image600: "/lumo-art/prayer-por-mi-familia-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Hoy vamos a dedicar este momento a las personas que más amas — tu familia. Las que están cerca todos los días, y también las que viven lejos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Piensa en cada persona de tu familia, una por una. Imagina su cara, y piensa en algo que te guste de cada una de ellas.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "Tener personas que te aman y te cuidan no es algo que siempre pasa — es un regalo. No todos lo tienen, así que hoy vamos a agradecerlo especialmente.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: Dios, cuida a mi familia. Protege a cada una de las personas que amo, y llena sus días de tu paz.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Ayúdanos a cuidarnos entre nosotros, a tener paciencia cuando sea difícil, y a recordar siempre lo mucho que nos queremos, incluso en los días complicados.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Si hay alguien en tu familia que hoy necesita algo especial — una oración, un abrazo, una llamada — llévalo también en tu corazón esta noche.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Qué lindo es tener personas que te aman y te cuidan. Que esta noche, cada uno de ellos descanse tranquilo, sabiendo que también los tienes presentes.",
      },
    ],
    conversationQuestions: ["¿Por quién de tu familia quieres orar hoy?"],
  },
  {
    id: "antes-de-comer",
    contentType: "oracion",
    title: "Antes de comer",
    subtitle: "Para bendecir los alimentos",
    description: "Una oración guiada para antes de las comidas en familia.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 50,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Salmo 136:1"],
    language: "es",
    illustrationSlug: "prayer-antes-de-comer",
    illustrations: [
      {
        id: "prayer-antes-de-comer-i1",
        sceneId: "prayer-antes-de-comer",
        order: 1,
        narrativeMoment: "La familia en la mesa, pausa compartida justo antes del primer bocado.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-antes-de-comer-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-antes-de-comer-v2_300.webp",
        image600: "/lumo-art/prayer-antes-de-comer-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Antes de empezar a comer, vamos a tomarnos un momento para agradecer por esta comida y por poder compartirla en familia.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Piensa en todo lo que hizo falta para que esta comida llegue a la mesa — el trabajo de quien la preparó, y todo lo que Dios provee para que nunca nos falte.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: gracias, Dios, por los alimentos que vamos a comer, y por la posibilidad de compartirlos en familia, todos juntos en esta mesa.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Gracias también por las personas que están sentadas con nosotros hoy. Comer juntos es un momento simple, pero también es un regalo que no siempre valoramos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Y si alguno de ustedes preparó esta comida hoy, gracias especialmente — cocinar para la familia es también una forma de cuidar y de amar.",
      },
      {
        role: "narracion",
        mood: "family",
        caption: "Ahora sí, que lo disfruten. Buen provecho, y que este momento en la mesa sea de alegría compartida.",
      },
    ],
    conversationQuestions: ["¿Cuál es tu comida favorita para compartir en familia?"],
  },
  {
    id: "antes-de-comenzar-el-dia",
    contentType: "oracion",
    title: "Antes de comenzar el día",
    subtitle: "Para empezar con buena energía",
    description: "Una oración guiada para las mañanas, para comenzar el día con alegría y buena actitud.",
    category: "general",
    collectionId: "oraciones-guiadas",
    lengthCategory: "oracion-guiada",
    durationSeconds: 55,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: [],
    tags: [],
    passages: ["Salmo 118:24"],
    language: "es",
    illustrationSlug: "prayer-antes-de-comenzar-el-dia",
    illustrations: [
      {
        id: "prayer-antes-de-comenzar-el-dia-i1",
        sceneId: "prayer-antes-de-comenzar-el-dia",
        order: 1,
        narrativeMoment: "Un niño y un adulto junto a una ventana grande con luz de mañana.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/prayer-antes-de-comenzar-el-dia-v2.txt",
        characterVersions: {},
        image300: "/lumo-art/prayer-antes-de-comenzar-el-dia-v2_300.webp",
        image600: "/lumo-art/prayer-antes-de-comenzar-el-dia-v2_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "¡Buenos días! Un nuevo día ya comenzó, con cosas que todavía no sabemos qué van a ser — y eso también puede ser algo lindo.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "Antes de salir a vivir este día, vamos a tomarnos un momento para prepararnos, no con prisa, sino con calma y buena energía.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Piensa en algo que te gustaría que pase hoy — puede ser grande o chiquito. Y piensa también en cómo te gustaría tratar a las personas que te encuentres.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Vamos a orar juntos: gracias, Dios, por este nuevo día. Gracias por la oportunidad de empezar de nuevo, sin importar cómo terminó el día de ayer.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "Ayúdame a ser amable con las personas que me encuentre hoy, y también valiente frente a lo que me dé un poco de miedo o me cueste.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Hoy pueden pasar cosas lindas — vamos a recibirlas con una buena actitud, con los ojos abiertos para notarlas cuando aparezcan.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Ahora sí, ¡a disfrutar el día! Que sea uno bueno, y si no lo es del todo, que por lo menos tenga algunos buenos momentos.",
      },
    ],
    conversationQuestions: ["¿Qué es lo que más te ilusiona de hoy?"],
  },
  {
    id: "vida-jesus-s1e1-buenas-noticias-en-belen",
    contentType: "historia",
    title: "Buenas noticias en Belén",
    subtitle: "El comienzo de la historia más grande, contada de la manera más sencilla",
    description:
      "María y José llegan a Belén agotados y sin un lugar donde quedarse — y esa misma noche, en un pesebre, nace Jesús.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "la-vida-de-jesus",
    season: 1,
    episodeNumber: 1,
    lengthCategory: "episodio-serie",
    durationSeconds: 0,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "María", "José"],
    tags: ["personajes"],
    passages: ["Lucas 2:1-20"],
    language: "es",
    illustrationSlug: "series-vida-jesus-s1e1-belen",
    illustrations: [
      {
        id: "s1e1-i1",
        sceneId: "s1e1-nacimiento",
        order: 1,
        narrativeMoment: "María y José junto al pesebre, recién nacido Jesús envuelto en telas.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e1-belen.txt",
        characterVersions: { maria: "v1", "jose-de-nazaret": "v1", "jesus-bebe": "v1" },
        image300: "/lumo-art/series-vida-jesus-s1e1-belen_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e1-belen_600.webp",
      },
      {
        id: "s1e1-i2",
        sceneId: "s1e1-angel-pastores",
        order: 2,
        narrativeMoment: "El ángel se aparece a los pastores en el campo, anunciando el nacimiento.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e1-angel-pastores.txt",
        characterVersions: {},
        image300: "/lumo-art/series-vida-jesus-s1e1-angel-pastores_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e1-angel-pastores_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "María y José llevaban varios días de camino cuando por fin vieron a lo lejos los techos de Belén. María ya casi no podía caminar — el bebé que esperaba estaba por nacer en cualquier momento — y José apuraba el paso, buscando con la mirada un techo, una habitación, cualquier lugar donde ella pudiera descansar.\n\nPero Belén estaba llena. Había llegado gente de todas partes, y en cada posada la respuesta era la misma:\n\n—Lo siento. No queda lugar.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Ya caía la noche cuando un posadero, viendo lo cansada que estaba María, les ofreció lo único que tenía: un establo, el lugar donde dormían los animales, con paja en el suelo y el aire oliendo a heno.\n\nNo era lo que José había imaginado para esa noche. Pero María solo asintió, agradecida, y se acomodó como pudo entre la paja.\n\nY esa misma noche, rodeado de animales tranquilos y de la luz suave de un candil, nació Jesús.\n\nMaría lo envolvió en telas para abrigarlo y lo recostó en un pesebre — la caja de madera donde comían los animales — porque no había ninguna cuna esperándolo. El comienzo de la historia más grande jamás contada empezaba ahí, en el lugar más sencillo de todos.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa misma noche, en las colinas cercanas, unos pastores cuidaban sus ovejas bajo un cielo lleno de estrellas. De pronto, una luz enorme los rodeó, y un ángel se les apareció. Los pastores se asustaron y se cubrieron los ojos.\n\n—No tengan miedo —les dijo el ángel—. Les traigo una noticia que va a alegrar a todo el mundo: hoy, en Belén, nació el Salvador. Lo van a encontrar envuelto en telas, recostado en un pesebre.\n\nY de repente, el cielo se llenó de más luces, como si todas las estrellas cantaran juntas:\n\n—¡Gloria a Dios, y paz en la tierra!\n\nLos pastores no lo pensaron dos veces. Dejaron a sus ovejas y corrieron hacia Belén, tan rápido como sus piernas se lo permitían.",
        illustrationId: "s1e1-i2",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Encontraron a María, a José, y al bebé, exactamente como el ángel había dicho. Se quedaron ahí, mirando, sin saber bien qué decir — porque delante de ellos, en un pesebre de un establo cualquiera, estaba la noticia más grande que el mundo iba a recibir jamás.\n\nMaría no dijo nada. Solo miraba a su hijo, y guardaba cada palabra de esa noche en su corazón, para no olvidarla nunca.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "¿No es increíble? La noticia más importante del mundo no llegó a un palacio ni a la gente más poderosa — llegó primero a unos pastores comunes, en medio de la noche, y a una familia que no tenía ni siquiera un lugar donde quedarse.\n\nA veces las cosas más grandes empiezan en los lugares más sencillos.\n\n¿Alguna vez algo bueno te llegó de la forma que menos esperabas?",
      },
    ],
    conversationQuestions: ["¿Alguna vez algo bueno te llegó de la forma que menos esperabas?"],
    dailyChallenge:
      "Hoy, antes de dormir, agradece en voz alta por el lugar donde vives — aunque sea simple, es tu propio 'Belén'.",
    nextEpisodeHook:
      "Mañana descubrirás quiénes fueron los primeros visitantes que siguieron una estrella para conocer a Jesús.",
  },
  {
    id: "vida-jesus-s1e2-los-sabios-de-oriente",
    contentType: "historia",
    title: "Los sabios que siguieron una estrella",
    subtitle: "Un viaje largo para encontrar lo que de verdad importa",
    description:
      "Unos sabios de tierras lejanas ven una estrella nueva en el cielo y viajan durante meses para encontrar al niño que anuncia, llevándole regalos preciosos.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "la-vida-de-jesus",
    season: 1,
    episodeNumber: 2,
    lengthCategory: "episodio-serie",
    durationSeconds: 0,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "María", "los sabios de oriente"],
    tags: ["personajes"],
    passages: ["Mateo 2:1-12"],
    language: "es",
    illustrationSlug: "series-vida-jesus-s1e2-sabios",
    illustrations: [
      {
        id: "s1e2-i1",
        sceneId: "s1e2-visita-sabios",
        order: 1,
        narrativeMoment: "María con el niño Jesús recibiendo a los tres sabios y sus regalos.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e2-sabios.txt",
        characterVersions: {
          maria: "v1",
          "jesus-nino-pequeno": "v1",
          "sabio-oro": "v1",
          "sabio-incienso": "v1",
          "sabio-mirra": "v1",
        },
        image300: "/lumo-art/series-vida-jesus-s1e2-sabios_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e2-sabios_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "night",
        caption:
          "Muy lejos de Belén, en tierras de oriente, unos sabios pasaban las noches estudiando el cielo. Conocían cada estrella, cada patrón, cada señal — y por eso, cuando una estrella completamente nueva apareció una noche, brillando distinta a todas las demás, supieron que algo importante estaba pasando.\n\n—Un rey nuevo ha nacido —dijo uno de ellos, sin apartar los ojos del cielo—. Uno que vale la pena ir a conocer.\n\nNo lo pensaron mucho tiempo. Prepararon regalos dignos de un rey — oro, incienso y mirra — y emprendieron un viaje que iba a durar meses, guiándose de noche por esa única estrella.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "El camino fue largo y cansador. Cruzaron desiertos, ciudades, ríos — y cuando por fin llegaron a Jerusalén, preguntaron en el palacio del rey Herodes:\n\n—¿Dónde está el rey de los judíos que acaba de nacer? Vimos su estrella, y venimos a rendirle honor.\n\nHerodes se inquietó al escuchar esto — él mismo era rey, y no le gustaba la idea de otro — pero disimuló su preocupación y les pidió, con voz suave, que cuando encontraran al niño, volvieran a contarle dónde estaba, para él también ir a 'rendirle honor'. Algo en su voz sonaba amable, pero no se sentía del todo bien. En realidad, Herodes tenía otros planes, mucho menos amables.\n\nLos sabios no lo sabían todavía. Siguieron su camino, y la estrella, que no habían vuelto a ver desde que entraron a la ciudad, apareció otra vez — y esta vez se detuvo justo encima de la casa donde estaban María y el niño.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Los sabios entraron, y al ver al niño con su madre, se arrodillaron y lo honraron. Después de tantos meses de camino, de tantas noches guiándose por una sola luz en el cielo, por fin estaban ahí.\n\nAbrieron sus cofres y le entregaron sus regalos: oro, como a un rey; incienso, como a alguien especial; mirra, un perfume valioso.\n\nMaría los recibió con una sonrisa callada, sin terminar de entender del todo por qué unos sabios de tan lejos habían viajado tanto solo para conocer a su hijo.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Los sabios no sabían exactamente qué iban a encontrar al final del viaje — solo sabían que valía la pena seguir esa estrella, noche tras noche, sin rendirse.\n\nY cuando llegaron, no se guardaron lo mejor que tenían: se lo dieron.\n\n¿Alguna vez tuviste que ser paciente durante mucho tiempo para lograr algo que de verdad te importaba?",
      },
    ],
    conversationQuestions: ["¿Alguna vez tuviste que ser paciente durante mucho tiempo para lograr algo que de verdad te importaba?"],
    dailyChallenge:
      "Hoy, regalá algo tuyo de verdad — un dibujo, un abrazo, un rato de tu tiempo — a alguien de tu familia, como hicieron los sabios.",
    nextEpisodeHook:
      "Mañana damos un salto de varios años: descubrirás cómo Jesús, ya de niño, sorprendió a unos maestros con las preguntas que hacía.",
  },
  {
    id: "vida-jesus-s1e3-el-nino-en-el-templo",
    contentType: "historia",
    title: "El niño que sorprendió a los maestros",
    subtitle: "Cuando hacer preguntas también es una forma de fe",
    description:
      "A los doce años, Jesús se queda en el templo haciendo preguntas a los maestros — y hasta ellos se sorprenden con sus respuestas.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "la-vida-de-jesus",
    season: 1,
    episodeNumber: 3,
    lengthCategory: "episodio-serie",
    durationSeconds: 0,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "María", "José"],
    tags: ["personajes"],
    passages: ["Lucas 2:41-52"],
    language: "es",
    illustrationSlug: "series-vida-jesus-s1e3-templo",
    illustrations: [
      {
        id: "s1e3-i1",
        sceneId: "s1e3-nino-en-el-templo",
        order: 1,
        narrativeMoment: "Jesús de 12 años conversando con un maestro en el templo.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e3-templo.txt",
        characterVersions: { "jesus-12-anos": "v1", "maestro-del-templo": "v1" },
        image300: "/lumo-art/series-vida-jesus-s1e3-templo_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e3-templo_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Cada año, la familia de Jesús viajaba a Jerusalén para la fiesta. Ese año, Jesús ya tenía doce, y el viaje de vuelta a casa se hizo en un grupo grande, entre parientes y vecinos, como siempre.\n\nMaría y José caminaron todo el primer día sin darse cuenta de que Jesús no estaba con ellos — cada uno pensaba que estaba con el otro grupo. Cuando por fin se dieron cuenta, el corazón se les detuvo un instante.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Volvieron corriendo a Jerusalén, buscando entre las calles, preguntando a quien encontraran. Recién al tercer día lo encontraron — no perdido, no asustado, sino sentado tranquilamente en el templo, en medio de los maestros más sabios de la ciudad, escuchando y haciendo preguntas.\n\nY todos los que lo oían se quedaban asombrados de sus respuestas — no eran respuestas de un chico de doce años cualquiera.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "—Hijo —le dijo María, entre el alivio y el reto—, ¿por qué nos hiciste esto? Tu padre y yo te buscamos angustiados.\n\n—¿Por qué me buscaban? —respondió Jesús, con calma—. ¿No sabían que tenía que estar en la casa de mi Padre?\n\nNi María ni José entendieron del todo esa respuesta en ese momento. Pero Jesús se levantó, los siguió de vuelta a Nazaret sin más vueltas, y siguió creciendo — en tamaño, en sabiduría, y en el cariño de quienes lo conocían.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "A veces hacer una pregunta —una buena pregunta, de esas que te hacen pensar de verdad— es tan valioso como saber una respuesta.\n\nJesús no tenía miedo de preguntar, ni los maestros más grandes le daban vergüenza.\n\n¿Cuál es la pregunta que más ganas tienes de hacerle a alguien esta semana?",
      },
    ],
    conversationQuestions: ["¿Cuál es la pregunta que más ganas tienes de hacerle a alguien esta semana?"],
    dailyChallenge:
      "Hoy, anímate a hacer una pregunta que hace tiempo tenías guardada — a un adulto, a un amigo, o incluso a Dios.",
    nextEpisodeHook:
      "Mañana volvemos atrás en el tiempo, a cuando Jesús era apenas un bebé de semanas, y dos ancianos en el templo lo reconocieron sin que nadie se los dijera.",
  },
  {
    id: "vida-jesus-s1e4-presentado-en-el-templo",
    contentType: "historia",
    title: "El anciano que esperó toda su vida",
    subtitle: "A veces la paciencia dura años, y vale la pena",
    description:
      "Un anciano llamado Simeón esperó toda su vida un momento — y cuando por fin llegó, lo reconoció al instante en los brazos de una madre cualquiera.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "la-vida-de-jesus",
    season: 1,
    episodeNumber: 4,
    lengthCategory: "episodio-serie",
    durationSeconds: 0,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "María", "Simeón", "Ana"],
    tags: ["personajes"],
    passages: ["Lucas 2:22-38"],
    language: "es",
    illustrationSlug: "series-vida-jesus-s1e4-simeon",
    illustrations: [
      {
        id: "s1e4-i1",
        sceneId: "s1e4-presentacion-templo",
        order: 1,
        narrativeMoment: "Simeón sosteniendo al bebé Jesús en el templo, María observando.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e4-simeon.txt",
        characterVersions: { simeon: "v1", maria: "v1", "jesus-bebe": "v1" },
        image300: "/lumo-art/series-vida-jesus-s1e4-simeon_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e4-simeon_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "book",
        caption:
          "Cuando el bebé Jesús tenía apenas unas semanas, María y José lo llevaron al templo, como era costumbre, para presentarlo ante Dios.\n\nAhí vivía un anciano llamado Simeón. Llevaba toda su vida esperando algo — una promesa que le habían hecho hacía mucho: que no moriría sin antes ver con sus propios ojos al niño que Dios había prometido enviar.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Ese mismo día, algo lo llevó hasta el templo, poco antes de que María y José llegaran.\n\nCuando los vio entrar con el bebé, Simeón no dudó ni un segundo. Caminó hacia ellos, y María, sin conocerlo de nada, le dejó tomar a su hijo en brazos.\n\nSimeón sostuvo al bebé, lo miró largamente, y sus ojos se llenaron de lágrimas — no de tristeza, sino del alivio de quien por fin ve cumplida una espera de toda una vida.",
      },
      {
        role: "narracion",
        mood: "prayer",
        caption:
          "—Ahora sí —dijo Simeón, en voz baja, casi para sí mismo— puedo descansar en paz. Mis ojos ya vieron lo que esperaban ver.\n\nMaría y José se quedaron sorprendidos de sus palabras — un desconocido, que nunca los había visto, hablando de su hijo como si lo conociera de toda la vida.\n\nCerca de ahí, otra anciana llamada Ana, que vivía prácticamente en el templo orando día tras día, se acercó también en ese mismo instante. Al ver al niño, ella tampoco tuvo dudas — y desde ese día, no paró de contarles a todos los que conocía que ese bebé era el que tanto habían esperado.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Simeón esperó años y años sin perder la esperanza — y cuando por fin llegó su momento, lo reconoció enseguida, sin necesitar que nadie se lo explicara.\n\n¿Hay algo que estás esperando con paciencia, aunque todavía no sepas cuándo va a llegar?",
      },
    ],
    conversationQuestions: ["¿Hay algo que estás esperando con paciencia, aunque todavía no sepas cuándo va a llegar?"],
    dailyChallenge:
      "Hoy, piensa en algo que estuviste esperando por mucho tiempo, y cuéntale a alguien de tu familia cómo te sentiste cuando por fin pasó (o cómo te sientes esperándolo todavía).",
    nextEpisodeHook:
      "Mañana, la familia de Jesús va a tener que escapar en medio de la noche — descubrirás de qué tuvieron que cuidarlo.",
  },
  {
    id: "vida-jesus-s1e5-la-huida-a-egipto",
    contentType: "historia",
    title: "Un viaje en medio de la noche",
    subtitle: "A veces cuidar a alguien significa actuar rápido, sin esperar",
    description:
      "José tiene un sueño que le advierte de un peligro, y sin dudarlo, esa misma noche despierta a su familia para partir a un lugar seguro.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "la-vida-de-jesus",
    season: 1,
    episodeNumber: 5,
    lengthCategory: "episodio-serie",
    durationSeconds: 0,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "María", "José"],
    tags: ["personajes"],
    passages: ["Mateo 2:13-15"],
    language: "es",
    illustrationSlug: "series-vida-jesus-s1e5-huida",
    illustrations: [
      {
        id: "s1e5-i1",
        sceneId: "s1e5-huida-a-egipto",
        order: 1,
        narrativeMoment: "José guiando al burro con María y el bebé Jesús, de noche, camino a Egipto.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e5-huida.txt",
        characterVersions: { "jose-de-nazaret": "v1", maria: "v1", "jesus-bebe": "v1" },
        image300: "/lumo-art/series-vida-jesus-s1e5-huida_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e5-huida_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "night",
        caption:
          "Tiempo después de la visita de los sabios, José tuvo un sueño. En ese sueño, un ángel le advertía con urgencia:\n\n—Levántate. Toma al niño y a su madre, y huyan a Egipto. Herodes va a buscar al niño para hacerle daño.\n\nJosé se despertó de golpe, en medio de la noche, con el corazón acelerado.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "No esperó a que amaneciera. No lo pensó dos veces. Despertó a María, juntaron lo poco que tenían, y esa misma noche, todavía oscura, salieron de Belén rumbo a Egipto — un lugar lejano, desconocido, pero seguro.\n\nMaría sostenía al bebé contra su pecho mientras el burro avanzaba despacio por el camino, y José caminaba adelante, mirando las estrellas para no perder el rumbo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El viaje fue largo e incierto. No sabían exactamente qué los esperaba en Egipto, ni cuánto tiempo tendrían que quedarse ahí. Pero se quedaron tranquilos, sabiendo que estaban haciendo lo correcto para proteger a su hijo.\n\nY se quedaron en Egipto, seguros, hasta que llegó el momento de volver a casa.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "José no dudó cuando entendió que su familia estaba en peligro — actuó rápido, aunque eso significara dejar todo atrás en medio de la noche.\n\n¿Alguna vez tuviste que tomar una decisión rápida para cuidar a alguien que quieres?",
      },
    ],
    conversationQuestions: ["¿Alguna vez tuviste que tomar una decisión rápida para cuidar a alguien que quieres?"],
    dailyChallenge:
      "Hoy, pregúntale a alguien de tu familia si alguna vez tuvo que actuar rápido para proteger a alguien — y cuenta tú también si te pasó algo parecido.",
    nextEpisodeHook:
      "Mañana la familia por fin vuelve a casa — descubrirás cómo fue ese regreso, después de tanto tiempo lejos.",
  },
  {
    id: "vida-jesus-s1e6-el-regreso-a-nazaret",
    contentType: "historia",
    title: "La vuelta a casa",
    subtitle: "Un nuevo comienzo, en el lugar de siempre",
    description:
      "Cuando por fin es seguro volver, José elige instalarse en un pueblo pequeño llamado Nazaret — y ahí, en un hogar sencillo, Jesús crece como cualquier niño.",
    category: "nuevo",
    collectionId: "series",
    seriesId: "la-vida-de-jesus",
    season: 1,
    episodeNumber: 6,
    lengthCategory: "episodio-serie",
    durationSeconds: 0,
    ageRange: "4-10",
    biblicalLevel: "principiante",
    narrator: "Lumo",
    characters: ["Jesús", "María", "José"],
    tags: ["personajes"],
    passages: ["Mateo 2:19-23"],
    language: "es",
    illustrationSlug: "series-vida-jesus-s1e6-nazaret",
    illustrations: [
      {
        id: "s1e6-i1",
        sceneId: "s1e6-regreso-a-nazaret",
        order: 1,
        narrativeMoment: "José y María en la puerta de su casa en Nazaret, con Jesús ya de edad de caminar.",
        approvalStatus: "approved",
        promptFile: "scripts/_prompts/series-vida-jesus-s1e6-nazaret.txt",
        characterVersions: { "jose-de-nazaret": "v1", maria: "v1", "jesus-nino-pequeno": "v1" },
        image300: "/lumo-art/series-vida-jesus-s1e6-nazaret_300.webp",
        image600: "/lumo-art/series-vida-jesus-s1e6-nazaret_600.webp",
      },
    ],
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "book",
        caption:
          "Pasó el tiempo, y un día José tuvo otro sueño: el peligro ya había pasado, y era momento de volver.\n\nJuntaron sus cosas una vez más, y esta vez el camino de regreso se sintió distinto — no había miedo ni apuro, solo las ganas de por fin instalarse en algún lugar.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "En vez de volver a Belén, José eligió un pueblo pequeño y tranquilo llamado Nazaret. Ahí encontraron una casa sencilla, con un patio de tierra y vecinos que pronto se volvieron conocidos.\n\nJesús, que ya caminaba de la mano de su madre, miró la casa nueva con esos mismos ojos curiosos de siempre — como si cada lugar nuevo fuera una pequeña aventura por descubrir.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Ahí, en Nazaret, Jesús creció como cualquier otro niño del pueblo: jugando, aprendiendo el oficio de su padre, ayudando en la casa, haciendo amigos.\n\nNadie en el pueblo sabía todavía lo que ese niño llegaría a hacer algún día. Para sus vecinos, era simplemente el hijo del carpintero — y eso, para José y María, ya era motivo suficiente de alegría tranquila.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Después de tanto viaje, de tanta incertidumbre, lo que esta familia encontró al final no fue algo grandioso — fue un hogar sencillo, y eso les alcanzó para ser felices.\n\n¿Qué es lo que hace que tu casa se sienta como tu lugar seguro?",
      },
    ],
    conversationQuestions: ["¿Qué es lo que hace que tu casa se sienta como tu lugar seguro?"],
    dailyChallenge: "Hoy, agradece en voz alta por algo simple de tu casa que normalmente das por sentado.",
    nextEpisodeHook:
      "Mañana empieza una nueva temporada: Jesús ya es grande, y está por comenzar la parte de su historia que va a cambiarlo todo.",
  },
  {
    id: "cuento-respeto-las-reglas-del-arenero",
    contentType: "cuento",
    title: "El castillo que alcanzaba para todos",
    subtitle: "Un arenero, tres niños, y un lugarcito para cada quien.",
    description:
      "Mateo quiere el arenero entero para construir su castillo, hasta que una hermana y su hermanito menor le muestran que compartir el espacio no significa perder el suyo.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 291,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Mateo", "Emilia", "Tomás"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-respeto-las-reglas-del-arenero",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Mateo llegó al arenero con su balde amarillo y una idea clara en la cabeza: hoy iba a construir el castillo más alto de toda la plaza. Se arrodilló en la arena tibia, marcó un círculo grande con el dedo y empezó a apilar montoncitos, uno sobre otro, mientras tarareaba una canción inventada, feliz de tener todo ese espacio para él solo.\n\n—Va a tener cuatro torres y un puente colgante —dijo en voz alta, como si alguien lo estuviera escuchando, palmeando cada montículo hasta dejarlo firme.\n\nDesde el otro lado del arenero, una nena de trenzas lo miraba con curiosidad. Se llamaba Emilia, y llevaba en la mano una pala roja que todavía no había estrenado.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Emilia se acercó despacio, dando pasitos cortos por el borde de madera del arenero.\n\n—¿Puedo ayudarte? —preguntó, señalando su pala nueva.\n\nMateo levantó la vista apenas un segundo, sin dejar de apilar arena.\n\n—Este arenero es mío hoy —contestó, con el tono de quien ya decidió algo y no piensa cambiar de opinión—. Yo llegué primero, así que las reglas las pongo yo.\n\nEmilia se quedó parada ahí, con la pala colgando de la mano, sin saber qué decir. Miró el balde amarillo, miró las torres que ya empezaban a levantarse, y después miró sus propios pies descalzos, llenos de arena. Se sentó un poco más allá, sola, dibujando círculos con el dedo en el pedacito de arena que le quedaba disponible.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Un rato después llegó Tomás, el hermano menor de Emilia, corriendo con los brazos abiertos como si volara, gritando de alegría por todo el parque. Tenía apenas cuatro años y quería jugar con todos a la vez, sin entender muy bien de reglas ni de turnos. Se metió directo al centro del arenero, justo donde Mateo tenía la torre más alta, y de un pisotón entusiasmado la derrumbó entera.\n\n—¡Mi castillo! —gritó Mateo, poniéndose de pie de un salto, con la cara colorada de bronca—. ¡Éste es MI lugar, sáquense todos, ustedes dos no tenían que estar acá!\n\nTomás, asustado por el grito tan fuerte, se quedó paralizado un instante. Después arrugó la cara entera y empezó a llorar, fuerte, con esos hipidos entrecortados que no se pueden fingir.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Mateo se quedó mirando el desastre: la arena desparramada por todos lados, la torre caída como si nunca hubiera existido, y a Tomás llorando con la cara escondida entre las manos de Emilia, que lo abrazaba fuerte sin decir una palabra. Sintió algo raro en el pecho, apretado, como cuando uno se da cuenta de algo un segundo tarde y ya no puede volver atrás.\n\nMiró a su alrededor, esta vez con otros ojos. El arenero era grande, mucho más grande de lo que había pensado al llegar. Había espacio de sobra para una torre con cuatro puntas, para una pala roja sin estrenar, y para un nene de cuatro años que solo quería sentirse parte del juego. Nadie le había pedido que se fuera del todo. Nadie le había pedido que dejara de construir su castillo. Solo le habían pedido, sin palabras, un lugarcito para compartir.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Mateo se acercó despacio, sin saber muy bien cómo empezar, arrastrando un poco los pies en la arena.\n\n—Perdón por gritar así —dijo, agachándose para quedar a la altura de Tomás—. ¿Querés ayudarme a construir la torre de nuevo? Vos podés poner las banderitas arriba, que es la parte más importante.\n\nTomás levantó la cabeza, todavía con los ojos húmedos y la nariz colorada, y asintió despacito, casi sin creerlo. Emilia sonrió y se acercó también, con su pala roja finalmente lista para usarse.\n\nEntre los tres marcaron un espacio para cada quien: un rincón para el castillo con sus cuatro torres, otro para los túneles que Tomás quería cavar, y un tercero donde Emilia probaba su pala nueva contra la arena húmeda. El arenero, que minutos antes le había parecido chico para uno solo, de repente alcanzaba de sobra para los tres.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué lindo es un arenero cuando cada quien tiene su rinconcito, ¿no? A veces creemos que compartir un espacio significa perder el nuestro, pero casi siempre alcanza para todos, si nos hacemos un lugarcito unos a otros y respetamos el turno del que llega después.\n\n¿Qué podés hacer la próxima vez que quieras jugar en un lugar donde ya hay otros niños?",
      },
    ],
    conversationQuestions: ["¿Qué podés hacer la próxima vez que quieras jugar en un lugar donde ya hay otros niños?"],
  },
  {
    id: "cuento-autocontrol-el-frasco-de-mermelada",
    contentType: "cuento",
    title: "El frasco que esperaba el domingo",
    subtitle: "Un dulce secreto, una promesa, y la espera más difícil de la semana.",
    description:
      "Nico descubre lo difícil que es resistir la tentación de abrir el frasco de mermelada de su abuela antes del domingo, el único día en que se puede disfrutar.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 293,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Nico", "abuela Rosa"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-autocontrol-el-frasco-de-mermelada",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "En la cocina de la abuela Rosa había un frasco de vidrio con mermelada de durazno casera, siempre en el mismo estante, siempre tapado con una tela a cuadros amarrada con un piolín. Nico sabía que esa mermelada era para el desayuno del domingo, cuando toda la familia se juntaba a comer tostadas calientes alrededor de la mesa grande.\n\nPero era jueves por la tarde, Nico tenía hambre después de volver de la escuela, y el frasco brillaba bajo la luz de la ventana como si lo estuviera llamando desde el estante.\n\n—Ni se te ocurra tocarlo antes del domingo —le había dicho la abuela esa misma mañana, con una sonrisa que no dejaba lugar a dudas.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Nico se quedó parado frente a la alacena, con la mano casi tocando la tapa fría del frasco. Se imaginó el sabor dulce, espeso, resbalando sobre una tostada tibia recién salida del tostador. Tenía tantas ganas que hasta le sonaron las tripas, fuerte, como un reclamo.\n\n—Total, un poquito nadie lo va a notar —se dijo a sí mismo, casi en un susurro, y empezó a girar la tapa despacito, tratando de no hacer ruido.\n\nJusto en ese momento escuchó los pasos de su abuela acercándose por el pasillo, tarareando una canción vieja. Nico soltó el frasco de golpe, como si quemara, y lo empujó de nuevo hacia el fondo del estante, con el corazón latiéndole fuerte contra el pecho.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa noche, ya en la cama, Nico no podía dormir. No era por el hambre —había cenado bien, un guiso calentito—, sino por esa sensación incómoda de haber estado a punto de hacer algo a escondidas. Se preguntó qué hubiera pasado si la abuela lo encontraba con la mano metida en el frasco. Se preguntó, también, qué pasaría el domingo si abría el frasco antes de tiempo y ya no quedaba sorpresa para nadie más.\n\nDio vueltas en la cama un rato largo, mirando el techo a oscuras, pensando en la tela a cuadros, en la promesa que no había roto, aunque había estado tan cerca de romperla que todavía le temblaban un poco las manos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El viernes por la tarde, Nico volvió a pasar cerca de la alacena, otra vez con hambre. Esta vez no se detuvo. Fue directo a la heladera, se sirvió un vaso de leche fría, y se sentó a dibujar en la mesa de la cocina, de espaldas al estante, para no tener la tentación tan cerca de los ojos. Cada tanto miraba de reojo hacia el frasco, pero se repetía en voz baja:\n\n—Falta poco. El domingo lo vamos a abrir todos juntos, como siempre.\n\nLe costó bastante, pero logró terminar tres dibujos enteros sin volver a levantarse a mirar la alacena. Cuando la abuela entró y lo vio tan concentrado, sonrió sin decir nada, como si supiera exactamente lo que había estado pasando esos días en la cabeza de su nieto.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El sábado se le hizo eterno. Nico ayudó a poner la mesa, barrió el patio y hasta ordenó sus juguetes sin que nadie se lo pidiera, como si mantenerse ocupado le ayudara a no pensar en la mermelada. A la noche, antes de dormir, la abuela se sentó un ratito en el borde de su cama.\n\n—Sé que no fue fácil esperar —le dijo, acomodándole el pelo—. Me di cuenta el jueves, ¿sabés? Pero también sé que no lo abriste. Eso vale mucho más de lo que pensás.\n\nNico sonrió, sorprendido de que su abuela supiera, y por primera vez en toda la semana sintió que esperar había valido la pena.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El domingo por fin llegó. La mesa se llenó de tostadas calientes, tazas humeantes y toda la familia alrededor, riendo y hablando al mismo tiempo, como todos los domingos. La abuela Rosa trajo el frasco con una ceremonia especial, como si fuera un tesoro escondido, y lo destapó frente a todos, despacio.\n\n—Este domingo el primero en servirse sos vos, Nico —dijo, guiñándole un ojo—. Te lo ganaste por esperar sin abrirlo antes de tiempo.\n\nNico untó su tostada con una montaña de mermelada dorada, y el sabor le pareció todavía mejor que el que había imaginado esos días, esperando con las ganas apretadas.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué difícil es esperar algo rico que tenemos ahí, cerquita, ¿no? Pero cuando por fin llega el momento correcto, todo sabe un poquito mejor, como si la espera también fuera parte del sabor.\n\n¿Alguna vez tuviste que esperar por algo que querías mucho? ¿Cómo hiciste para aguantar las ganas?",
      },
    ],
    conversationQuestions: ["¿Alguna vez tuviste que esperar por algo que querías mucho? ¿Cómo hiciste para aguantar las ganas?"],
  },
  {
    id: "cuento-empatia-el-companero-triste",
    contentType: "cuento",
    title: "El escalón del fondo",
    subtitle: "A veces alcanza con sentarse al lado de alguien.",
    description:
      "Camila nota que su compañero Benjamín está triste en el recreo y, sin que nadie se lo pida, decide dejar el juego para acercarse a acompañarlo.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 317,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Camila", "Benjamín"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-empatia-el-companero-triste",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "En el recreo, mientras todos los demás corrían detrás de una pelota desinflada, Camila se dio cuenta de que Benjamín estaba sentado solo en el escalón del fondo del patio, con la mirada clavada en el piso y los hombros caídos. No era la primera vez que lo veía así esa semana, pero hoy algo en su cara le llamó más la atención: tenía los ojos hinchados, como si hubiera estado llorando antes de llegar a la escuela, y ni siquiera había abierto su vianda a la hora del recreo.\n\nCamila dudó un segundo, con un pie ya en dirección a la pelota. Podía seguir jugando con sus amigas, que la llamaban desde el otro lado del patio, o podía acercarse a ver qué pasaba.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Se acercó despacio y se sentó a su lado, en el escalón frío, sin decir nada al principio. Benjamín ni siquiera levantó la vista al sentirla llegar.\n\n—¿Puedo sentarme acá? —preguntó Camila, aunque para ese momento ya estaba sentada.\n\nBenjamín se encogió de hombros, sin ganas de hablar. Pasaron un ratito así, en silencio, mirando cómo los demás chicos corrían de un lado a otro persiguiendo la pelota. Camila no le preguntó de entrada qué le pasaba, porque se acordó de una vez que ella había estado muy triste y lo único que había querido, en ese momento, era que alguien se quedara cerca sin hacer tantas preguntas.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Al rato, Benjamín habló bajito, casi para sí mismo, con la voz apretada.\n\n—Mi perro se enfermó anoche. Lo tuvimos que dejar internado en el veterinario y no sabemos todavía cómo sigue.\n\nCamila sintió un nudo en la garganta, como si por un momento pudiera sentir un poquito de lo que él estaba sintiendo. Pensó en su propia mascota, en lo triste que estaría si alguna vez le pasara algo parecido, tan de repente.\n\n—Debe ser horrible no saber cómo está —dijo, sin apurar respuestas ni decir frases hechas para que se sintiera mejor—. ¿Querés contarme cómo se llama?\n\nBenjamín, por primera vez en todo el recreo, levantó la cabeza y la miró a los ojos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—Se llama Rufo —dijo, y una sonrisa chiquita, apenas visible, le apareció en la cara cansada—. Es marrón, con una oreja parada y otra caída, medio chueco. Duerme siempre a los pies de mi cama, todas las noches desde que era cachorro.\n\nCamila sonrió también, contagiada.\n\n—Seguro que los veterinarios lo van a cuidar bien, se nota que lo querés mucho. ¿Querés que dibujemos algo para él, para cuando vuelva a casa y se sienta mejor?\n\nBenjamín asintió, y por primera vez esa mañana algo en su cara se aflojó de verdad. Sacaron un cuaderno de la mochila y empezaron a dibujar un perro marrón con una oreja parada, rodeado de corazones y una casa con globos de colores, para cuando Rufo volviera sano.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Cuando sonó el timbre para volver a clase, Benjamín guardó el dibujo con mucho cuidado dentro de su mochila, doblándolo despacio como si fuera algo valioso. Al levantarse, le dijo a Camila:\n\n—Gracias por sentarte conmigo. Pensé que nadie se iba a dar cuenta de que estaba mal.\n\nCamila no supo bien qué responder, así que solo sonrió y caminaron juntos hacia el aula, uno al lado del otro. Sus amigas, que la habían visto desde lejos sentada en el escalón, le preguntaron después por qué se había ido a sentar con Benjamín en vez de jugar.\n\n—Porque estaba triste —contestó simplemente, encogiéndose de hombros—. Y a veces alcanza con eso.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Los días siguientes, Camila empezó a fijarse más en cómo estaban sus compañeros, no solo en Benjamín. Se dio cuenta de que casi nunca se había detenido de verdad a mirar las caras de los demás durante el recreo, siempre tan ocupada corriendo detrás de la pelota. Ahora, sin proponérselo, notaba quién se reía fuerte y quién se quedaba callado, quién comía solo su vianda y quién compartía la suya.\n\nUna semana después, Benjamín llegó corriendo al patio con el celular de su mamá en la mano, buscando a Camila entre todos los chicos.\n\n—¡Rufo ya volvió a casa! —dijo, mostrándole una foto del perro marrón, con la oreja parada, moviendo la cola frente a la puerta—. Está recuperado del todo.\n\nCamila saltó de alegría junto a él, como si también fuera su propio perro el que había vuelto sano.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué lindo gesto el de Camila, ¿no? No hizo falta que nadie se lo pidiera: solo miró a su alrededor, prestó atención, y se dio cuenta de que alguien la necesitaba más que la pelota del recreo. Y esa amistad, que empezó en un escalón silencioso, terminó siendo una de las mejores del año.\n\n¿Alguna vez notaste que un compañero estaba triste? ¿Qué hiciste, o qué te gustaría haber hecho?",
      },
    ],
    conversationQuestions: ["¿Alguna vez notaste que un compañero estaba triste? ¿Qué hiciste, o qué te gustaría haber hecho?"],
  },
  {
    id: "cuento-responsabilidad-el-perro-que-dependia-de-mi",
    contentType: "cuento",
    title: "El plato que nadie más llenaba",
    subtitle: "Un cachorro, una promesa, y una alarma que nadie tenía que poner.",
    description:
      "Lucas se compromete a cuidar solo de su cachorro Café, y una noche descubre lo que significa de verdad que otro ser dependa completamente de uno.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 314,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Lucas", "Café"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-responsabilidad-el-perro-que-dependia-de-mi",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "El día que Lucas trajo a Café a casa, el cachorro cabía entero en sus dos manos. Era marrón oscuro, con las orejas todavía demasiado grandes para su cabeza, y no paraba de temblar de nervios en su primera noche lejos de su mamá perra y de sus hermanos de camada.\n\n—Si lo cuidamos entre todos, se puede quedar —había dicho papá, mirando a Lucas muy serio, con las manos apoyadas en los hombros de su hijo—. Pero vos vas a ser el responsable principal. Comida, agua, paseos. Todos los días, llueva o truene, sin excusas.\n\nLucas asintió con la cabeza tan rápido que casi se marea. Le parecía imposible, esa primera noche, que algo pudiera salir mal.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Las primeras semanas fueron fáciles, casi un juego. Lucas se despertaba temprano, emocionado, y corría a llenar el platito de Café antes de que sonara el despertador siquiera. Lo sacaba a pasear por la vereda cada tarde, orgulloso, como si todo el barrio tuviera que verlo pasar con su cachorro.\n\nPero un sábado, sus amigos lo invitaron a jugar a la pelota toda la tarde en la plaza, y Lucas salió corriendo sin pensar en nada más, con la pelota bajo el brazo. Volvió recién de noche, cansado y feliz, y se metió directo a bañarse sin acordarse del platito vacío ni del agua que Café no había tomado en todo el día largo.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa noche, cuando Lucas ya estaba en la cama a punto de dormirse, escuchó un gemido bajito que venía del living. Bajó despacio, en piyama, con el corazón apretado, y encontró a Café acurrucado junto a la puerta, con el platito completamente seco al lado.\n\n—Perdón, Café —susurró, sintiéndose muy chico de repente, arrodillándose junto a él—. Me olvidé de vos todo el día.\n\nLe llenó el plato de agua fresca hasta el borde y se sentó en el piso frío a acariciarlo un rato largo, mientras el cachorro tomaba agua con desesperación, casi sin respirar entre trago y trago. Lucas entendió, esa noche, que Café no tenía a nadie más que a él para acordarse de esas cosas tan simples pero tan importantes.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Desde ese día, Lucas empezó a poner una alarma en su propia cabeza, sin que nadie se lo pidiera: agua a la mañana apenas se despertaba, comida a la tarde antes de la merienda, paseo antes de la cena, pasara lo que pasara. Algunas tardes tenía muchas ganas de quedarse jugando un rato más con sus amigos en la plaza, pero se acordaba del platito seco y de los ojos tristes de Café esperando junto a la puerta, y volvía a tiempo igual, aunque le costara despedirse del partido.\n\nNo siempre era fácil. Había días de lluvia en que no tenía ganas de salir a caminar bajo el agua, y días de puro cansancio en que hubiera preferido tirarse directo en el sillón. Pero salía igual, con la correa en la mano y el impermeable puesto.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Con el tiempo, Café creció fuerte y sano, con el pelo brillante y una energía que contagiaba a toda la casa apenas se despertaba. Un domingo, mientras jugaban en el patio, papá se sentó a mirar cómo Lucas le lanzaba la pelota una y otra vez sin cansarse.\n\n—Mirá lo grande y sano que está —dijo papá, con la voz orgullosa—. Eso es gracias a vos, ¿sabés? Nadie más se acordó tanto como vos de cuidarlo, día tras día, sin que nadie te lo tuviera que recordar.\n\nLucas sonrió, mirando a Café correr en círculos felices por el pasto recién cortado. Se dio cuenta de que cuidar de alguien, todos los días, sin que nadie se lo recuerde, se sentía distinto a cualquier otra cosa que hubiera hecho antes en su vida.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Un año después, un vecino nuevo se mudó a la casa de al lado con un cachorro todavía más chiquito que Café en sus primeros días, y no sabía muy bien por dónde empezar. Lucas, que ya se sentía casi un experto, cruzó la calle con Café de la correa y le mostró al vecino cómo armar los horarios de comida, dónde guardar el agua fresca, y por qué convenía sacarlo a pasear siempre a la misma hora.\n\n—Al principio cuesta acordarse todos los días —le dijo, mientras Café y el cachorro nuevo se olfateaban con la cola moviéndose rápido—, pero después ya es como cepillarte los dientes. Ni lo pensás, simplemente lo hacés.\n\nEl vecino sonrió, agradecido, y Lucas sintió un orgullo distinto, el de saber que había aprendido algo que ahora podía compartir.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Cuidar de alguien que depende completamente de nosotros no siempre es fácil, ¿no? A veces hay que salir igual, aunque no tengamos ganas, porque otro nos está esperando.\n\n¿Hay algo o alguien de quien vos te ocupás todos los días, aunque a veces cueste un poquito?",
      },
    ],
    conversationQuestions: ["¿Hay algo o alguien de quien vos te ocupás todos los días, aunque a veces cueste un poquito?"],
  },
  {
    id: "cuento-esperanza-el-arbol-caido",
    contentType: "cuento",
    title: "El roble que volvimos a plantar",
    subtitle: "Después de la tormenta, una ramita nueva junto al tronco caído.",
    description:
      "Cuando una tormenta tumba el roble centenario del patio de Renata, su abuelo le enseña que se puede plantar algo nuevo justo donde se perdió lo que más se quería.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 314,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Renata", "abuelo Tito"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-esperanza-el-arbol-caido",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "En el patio de la casa de Renata había un roble enorme, tan viejo que ni el abuelo Tito se acordaba bien de cuándo lo habían plantado. Renata había crecido trepando sus ramas más bajas, colgando un columpio de madera de una de las más altas, y guardando secretos en un huequito del tronco que solo ella conocía, escondidos ahí desde hacía años.\n\n—Este árbol nos va a ver crecer a los dos —le decía siempre el abuelo, sentado debajo, a la sombra fresca, con un mate en la mano—. Va a estar ahí cuando vos tengas mis años y les cuentes esto mismo a tus nietos.\n\nRenata miraba hacia arriba, hacia las hojas que tapaban casi todo el cielo, y le costaba imaginar el patio sin él.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Una noche de otoño llegó una tormenta como Renata nunca había visto en toda su vida: el viento aullaba contra las ventanas, la lluvia golpeaba el techo sin pausa durante horas, y los truenos hacían temblar los vidrios cada pocos minutos. Renata se tapó con la manta hasta la cabeza, escuchando cómo afuera todo crujía y se sacudía, sin poder dormirse.\n\nA la mañana siguiente, cuando salió al patio todavía en piyama y con el pelo revuelto, se quedó paralizada en la puerta. El roble viejo estaba tirado en el suelo entero, con las raíces al aire y las ramas rotas esparcidas por todo el pasto mojado. El columpio de madera colgaba torcido de una rama quebrada, meciéndose apenas con el viento.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—No puede ser —susurró Renata, corriendo descalza hacia el tronco caído, sin importarle el barro. Se sentó junto a él, sobre la tierra húmeda, y sintió que se le llenaban los ojos de lágrimas—. Era nuestro árbol, abuelo. El de siempre.\n\nEl abuelo Tito se acercó despacio, apoyándose en su bastón, esquivando las ramas rotas, y se quedó mirando el roble caído en silencio un buen rato. Después se sentó junto a Renata, sobre una de las ramas gruesas.\n\n—Perdimos algo que queríamos mucho —dijo finalmente, con la voz un poco quebrada también—. Eso es cierto, y está bien estar triste por eso, no hay que apurarse a sentirse mejor. Pero la tierra donde crecía sigue ahí, esperando a que alguien la use de nuevo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Pasaron varios días en los que Renata evitaba mirar hacia ese rincón del patio, cada vez que salía a jugar. Le dolía ver el espacio vacío donde antes estaba la sombra fresca, el hueco de los secretos, el columpio ahora roto contra el pasto. Un domingo por la mañana, el abuelo Tito la llamó desde el jardín, con una pala en la mano y una cajita de cartón a sus pies, apoyada en la tierra removida.\n\n—Traje algo —dijo, abriendo la caja con cuidado. Adentro había un brote pequeñito, apenas más alto que la mano de Renata, con dos hojitas verdes recién abiertas, todavía tiernas—. Es un roble también, de la misma clase. Nos va a llevar tiempo, pero va a crecer fuerte.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Cavaron juntos un pozo justo al lado de donde había estado el tronco viejo, turnándose la pala, y plantaron el brote con cuidado, apretando la tierra alrededor con las manos llenas de barro. Renata lo regó despacio con la regadera chica, mirando esa ramita tan diminuta comparada con lo que había sido el roble anterior.\n\n—No se parece en nada al de antes —dijo, un poco desanimada, mirando el brote.\n\n—Todavía no —contestó el abuelo, sonriendo con calma—. Pero cada semana vas a venir a regarlo, y vas a ver que crece un poquito más cada vez. Un día, capaz cuando yo ya no esté, alguien más se va a sentar bajo su sombra, como vos te sentabas bajo la del viejo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Pasaron los meses, y después las estaciones. Cada domingo, sin faltar ninguno, Renata salía con su regadera chica hasta convertirla, con el tiempo, en una más grande. El brote fue creciendo despacio, primero hasta la altura de su rodilla, después hasta su cintura, y un año más tarde ya le pasaba el hombro.\n\nUna tarde, mientras el abuelo Tito la miraba regar desde su silla en el porche, Renata se dio cuenta de que ya podía apoyar la espalda contra el tronco nuevo, aunque todavía fuera delgado.\n\n—Un día vas a poder colgar otro columpio ahí —le dijo el abuelo, señalando una de las ramas más firmes—. Y seguro se lo vas a contar a alguien más chico, la historia del roble que se cayó y del que plantamos después.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué fuerte es plantar algo nuevo justo en el lugar donde perdimos algo querido, ¿no? No borra la tristeza de un día para el otro, pero abre un camino hacia adelante, con paciencia.\n\n¿Te pasó alguna vez perder algo que querías mucho? ¿Qué te ayudó a sentir esperanza de nuevo?",
      },
    ],
    conversationQuestions: ["¿Te pasó alguna vez perder algo que querías mucho? ¿Qué te ayudó a sentir esperanza de nuevo?"],
  },
  {
    id: "cuento-honestidad-vaso-roto",
    contentType: "cuento",
    title: "La taza de la abuela Coty",
    subtitle: "Un secreto que pesaba más de lo que cabía en un cajón",
    description:
      "Un niño rompe sin querer un objeto muy especial de su abuela y debe decidir si guarda el secreto o encuentra el valor de contarlo.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 348,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Nico", "Coty"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-honestidad-vaso-roto",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Nico pasaba las tardes de los sábados en la casa de su abuela Coty, la que tenía el patio más grande de todo el barrio y un cuenco de caramelos de menta que nunca se vaciaba. Ese sábado, Coty le había dicho, como siempre, antes de ir a regar las plantas:\n\n—Adentro no se juega a la pelota, Nico. Ya sabes por qué.\n\nY Nico lo sabía. En la sala, sobre el aparador, había una taza de cerámica pintada a mano que había sido de su abuelo. Coty la limpiaba con un trapito especial todos los domingos y nunca la usaba para tomar nada, solo la miraba, a veces, con una sonrisa chiquita, como si esa taza le recordara algo que solo ella podía ver.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Pero Nico tenía una pelota nueva, liviana y de colores, y el patio de atrás le quedaba lejos, cruzando toda la cocina. Pensó que solo unos pases, ahí en el pasillo angosto, no le iban a hacer mal a nadie. Pateó una vez, dos veces, cada vez con más confianza, y a la tercera la pelota rebotó contra el aparador con un golpe seco que resonó por toda la casa.\n\nLa taza cayó al piso y se rompió en tres pedazos prolijos, como si hubiera decidido romperse con cuidado.\n\nNico se quedó mirando los pedazos un largo rato, con el corazón latiéndole en las orejas y las manos frías de golpe. Después, sin pensarlo demasiado, los juntó rápido, los envolvió en una media vieja que encontró en el cajón, y los escondió en el fondo, debajo de los manteles bordados que casi nunca se usaban.",
      },
      {
        role: "narracion",
        mood: "diary",
        caption:
          "El resto de la tarde, Nico trató de portarse como si nada hubiera pasado. Ayudó a Coty a doblar la ropa recién lavada, jugó un rato en el patio con la pelota bien lejos de la casa, hasta se ofreció a poner la mesa sin que nadie se lo pidiera. Pero cada vez que pasaba cerca del aparador, apuraba el paso, y cada vez que Coty se acercaba a esa parte de la sala, a Nico se le hacía un nudo distinto en el estómago, uno que no se parecía en nada al hambre.\n\nEn la cena, Coty le contó una historia de cuando era chica, y Nico se rió en los momentos justos, pero por dentro seguía pensando en la media escondida en el cajón, como si tuviera un secreto guardado que pesaba más de lo que debería.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa noche, ya en su cama, Nico no podía dormir. Cada vez que cerraba los ojos veía la taza cayendo, una y otra vez, como si el golpe todavía sonara en el cuarto. Pensaba en la cara de Coty cuando la limpiaba con el trapito, en esa sonrisa chiquita, y sentía un nudo feo en la panza que no se le aflojaba ni acomodándose de costado, ni tapándose entero con la sábana.\n\nSe dijo a sí mismo que capaz Coty ni se daba cuenta. Que la taza estaba siempre tan arriba, tan quieta, que a lo mejor pasaban semanas antes de que la buscara. Pero el nudo en la panza no se iba con esa idea. Al contrario, crecía cada vez que la repetía, hasta que Nico terminó mirando el techo a oscuras, bien despierto.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El domingo, mientras desayunaban tostadas con dulce de leche, Coty se paró de golpe frente al aparador.\n\n—¿Y mi taza? —preguntó, mirando el espacio vacío donde siempre estaba.\n\nBuscó detrás de las plantas, debajo del mueble, en la cocina. Hasta le preguntó al gato Michi, medio en broma, si él sabía algo, como si un gato pudiera cargar una taza por la casa. Nico sintió que la cara le ardía. Podía quedarse callado. Nadie sospechaba de él todavía. Coty ya empezaba a pensar en voz alta que quizás la había guardado ella misma en otro lado, sin recordarlo, y hasta se reía un poco de su propio olvido.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Nico miró el cajón de los manteles. Después miró a su abuela, que seguía buscando con esa arruga de preocupación entre las cejas, tan distinta a su sonrisa de siempre. El nudo en la panza se le hizo tan grande que ya no entraba más adentro.\n\n—Abuela —dijo, con la voz temblándole un poco—. Yo rompí tu taza. Estaba jugando a la pelota adentro, como no debía, y se cayó. La escondí en el cajón porque tuve miedo. Perdón.\n\nLo dijo todo de un tirón, como cuando uno se saca una curita de golpe para que duela menos, y después se quedó ahí parado, esperando lo que fuera a pasar.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Coty se quedó callada un segundo que a Nico le pareció eterno. Después caminó hasta el cajón, sacó la media con los pedazos adentro, y los miró con cuidado, dándolos vuelta entre los dedos.\n\n—Gracias por decírmelo —dijo finalmente, y lo abrazó fuerte—. Una taza se puede pegar, o se puede extrañar y ya. Pero que tú me hayas dicho la verdad, eso sí que no tiene arreglo si se rompe.\n\nEsa tarde, entre los dos, guardaron los pedazos en una cajita de madera, por si algún día encontraban la manera de unirlos otra vez, y Coty le contó, por fin, de quién había sido esa taza y por qué la guardaba con tanto cariño.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "A veces lo más difícil no es romper algo, sino decidir qué hacer después. Nico tuvo miedo, cargó ese secreto todo un día entero, y aun así encontró las palabras para decir la verdad.\n\n¿Alguna vez tuviste que contar algo que te costaba decir? ¿Cómo te sentiste antes y después de decirlo?",
      },
    ],
    conversationQuestions: ["¿Alguna vez tuviste que contar algo que te costaba decir? ¿Cómo te sentiste antes y después de decirlo?"],
  },
  {
    id: "cuento-generosidad-la-ultima-galleta",
    contentType: "cuento",
    title: "Una galleta para tres",
    subtitle: "Lo último del frasco puede alcanzar para más de lo que parece",
    description:
      "Dos hermanos se disputan la última galleta del frasco hasta que una vecina nueva, sola y con hambre, golpea la puerta.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 307,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Mora", "Tobi", "Alma"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-generosidad-la-ultima-galleta",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Mora y Tobi volvían de la escuela con un hambre feroz, de esas que hacen que hasta el olor del pan de la panadería de la esquina duela un poco. Cuando entraron a la cocina, dejaron las mochilas tiradas en cualquier lado y corrieron directo al frasco de vidrio donde su mamá guardaba las galletas de avena que hacía los domingos, esas con pasas de uva que se sentían crocantes en el borde y blanditas en el medio.\n\nMiraron adentro. Quedaba una sola.\n\n—Es mía, llegué primero —dijo Tobi, estirando la mano.\n\n—¡No es cierto, yo la vi primero desde la puerta! —contestó Mora, empujándolo apenas con el codo.\n\nSe quedaron los dos parados frente al frasco abierto, sin animarse a agarrarla, pero tampoco a ceder ni un centímetro.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "En eso golpearon la puerta. Era Alma, la chica que se había mudado la semana anterior a la casa de al lado. Todavía no conocía a nadie en la cuadra y se la pasaba sola en el jardín, sentada en el borde de la vereda, mirando jugar a los demás desde lejos sin animarse a acercarse.\n\n—Mi mamá está armando cajas todavía —dijo Alma, parada en la puerta con las manos metidas en los bolsillos—. No encuentro nada para comer entre tantas cosas guardadas. ¿No tendrán algo, aunque sea poquito?\n\nMora y Tobi se miraron. Los dos pensaron en la galleta al mismo tiempo, y los dos supieron, sin decir una palabra, que el otro también lo estaba pensando.",
      },
      {
        role: "narracion",
        mood: "diary",
        caption:
          "Mora se acordó, sin querer, de un día del año pasado, cuando ella había sido la nueva en la escuela de danzas y nadie se había sentado con ella en el primer recreo. Se acordó de lo largo que se había hecho ese rato, sola contra la pared, mirando a las demás jugar en ronda sin animarse a preguntar si podía sumarse. Nadie le había convidado nada ese día, ni siquiera una palabra.\n\nTobi, por su parte, pensaba en el hambre, nomás, en esa sensación de vacío en la panza que no quería sentir ni un rato más. Pero cuando miró de nuevo a Alma, parada ahí con esa sonrisa que pedía disculpas por pedir, el hambre le pareció, de repente, un problema bastante más chico de lo que había sido un minuto antes.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "—Es solo una —susurró Tobi, sin que Alma lo escuchara, con la voz bajita—. Si la partimos entre los tres, casi ni se siente el gusto.\n\nMora miró la galleta, después miró a Alma, que esperaba en la puerta con una sonrisa medio tímida, medio esperanzada, como quien no quiere pedir demasiado. Se acordó de lo que se siente llegar a un lugar nuevo sin conocer a nadie.\n\n—Dámela a mí —le dijo a Tobi, y por un segundo la cara de su hermano se puso seria, como si fuera a discutir de nuevo. Pero Mora ya había estirado la mano hacia la puerta, con la galleta entera todavía en la palma.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—Toma —le dijo Mora a Alma, ofreciéndole la galleta entera—. Es la última que quedaba, pero seguro mi mamá hace más el domingo que viene.\n\nAlma se quedó mirando la galleta como si le estuvieran regalando algo mucho más grande de lo que en verdad era.\n\n—¿Toda para mí? —preguntó, sin animarse todavía a agarrarla.\n\n—Para las tres —corrigió Tobi, que ya había ido corriendo a buscar el cuchillo de la cocina. La partió en tres pedazos torcidos, ninguno igual al otro, y le dio el más grande a Alma sin que nadie se lo pidiera, casi sin darse cuenta de que lo estaba haciendo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Se sentaron los tres en el escalón de la entrada, masticando despacio para que durara más. Alma les contó de su escuela anterior, de la mudanza, de una bicicleta celeste que todavía no encontraba entre las cajas y que extrañaba mucho. Mora y Tobi se olvidaron por completo de que apenas un rato antes habían estado a punto de pelearse por esa misma galleta.\n\nCuando su mamá volvió del trabajo, encontró el frasco vacío y a tres chicos ya amigos sentados en la puerta, riéndose de algo que ella no llegó a escuchar del todo, aunque le alcanzó para sonreír también.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Los domingos siguientes, cuando su mamá horneaba galletas de avena, siempre hacía un poco más, y siempre había una tanda que cruzaba, tibia todavía, hasta la casa de al lado.\n\nLo que sobraba era poco, pero alcanzó para algo más grande que una galleta: el principio de una amistad que ya nunca se terminó.\n\n¿Hubo alguna vez algo tuyo, aunque fuera pequeño, que compartiste con alguien que lo necesitaba? ¿Cómo te sentiste al hacerlo?",
      },
    ],
    conversationQuestions: ["¿Hubo alguna vez algo tuyo, aunque fuera pequeño, que compartiste con alguien que lo necesitaba? ¿Cómo te sentiste al hacerlo?"],
  },
  {
    id: "cuento-paciencia-la-semilla-que-tardaba",
    contentType: "cuento",
    title: "El girasol que se tomó su tiempo",
    subtitle: "Algunas cosas buenas no se pueden apurar, por más ganas que tengamos",
    description:
      "Un niño planta una semilla de girasol y descubre que crecer, para las plantas y para las personas, lleva más tiempo del que le gustaría.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 314,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Fran", "don Beto", "Pipa"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-paciencia-la-semilla-que-tardaba",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Fran había visto en la escuela cómo la maestra ponía un poroto en un potecito de algodón húmedo, y en pocos días le salía una raíz blanca y después un tallito verde. Le pareció tan increíble que le pidió a su papá una maceta y una semilla de girasol para tener la suya en casa, bien grande, para que llegara más alto que las de la escuela.\n\n—Estas tardan un poco más que el poroto de algodón —le advirtió su papá mientras la plantaban juntos en la tierra del patio—. Van a pasar semanas hasta que veas algo.\n\nFran asintió, pero por dentro pensó que su papá exageraba, como exageraban siempre los grandes. Un par de días, calculó él, y ya iba a tener su girasol.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Al día siguiente, Fran corrió a mirar la maceta apenas se despertó, todavía en pijama. Nada. Al otro día, tampoco, aunque estuvo un buen rato mirando fijo, como si eso pudiera apurar las cosas. Al tercer día, no aguantó más y hundió un dedito en la tierra para ver si la semilla ya había hecho algo ahí abajo, escondida. La sacó a la luz, la miró de todos los ángulos, un poco decepcionado de verla exactamente igual, y la volvió a enterrar, más nervioso que antes.\n\nSu vecino, don Beto, que regaba su propio jardín todas las mañanas antes de que saliera el sol fuerte, lo vio agachado sobre la maceta por quinta vez esa semana y se acercó despacio, con la manguera todavía goteando.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "—¿Buscando algo ahí abajo? —preguntó don Beto, con una sonrisa que se le juntaba con las arrugas de los ojos.\n\n—Planté una semilla hace cuatro días y todavía no pasa nada —contestó Fran, un poco enojado con la maceta, como si ella tuviera la culpa de todo.\n\nDon Beto se sentó despacio en el banco de piedra y señaló su propio jardín, lleno de rosales altísimos que llegaban hasta la ventana de su cocina.\n\n—¿Sabes cuánto tardé en tener este jardín así? Diez años. Y todavía hay mañanas en que planto algo nuevo y no pasa nada por semanas. Lo único que hace falta es seguir regando todos los días y dejar de desenterrar para mirar cada rato.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Fran volvió a su maceta con esa idea dando vueltas en la cabeza. Le costaba, pero decidió probar algo distinto: iba a regarla todos los días, taparla bien después, y no volver a desenterrar la semilla para revisarla, por más ganas que le dieran a la mañana siguiente.\n\nLos días pasaron. Uno, cinco, ocho. Algunos los contaba en un cuaderno, con una rayita por día, para no perder la cuenta y para no sentir que el tiempo se le escapaba sin dejar nada. Cada vez que las ganas de escarbar la tierra volvían, se acordaba de las rosas de don Beto y apretaba los puños en vez de meter los dedos en la maceta.",
      },
      {
        role: "narracion",
        mood: "diary",
        caption:
          "Una tarde, después de dos semanas sin novedades, Fran casi se rinde. Le dijo a su papá que esa semilla capaz venía fallada, que no todas las semillas prendían, que a lo mejor había que comprar otra y empezar de nuevo desde cero.\n\n—Puedes hacer eso —le contestó su papá, sin apuro—. O puedes regarla una vez más, hoy, y ver qué pasa mañana. Total ya esperaste tanto que un día más no cambia nada.\n\nFran resopló, pero fue a buscar la regadera de todos modos, un poco enojado consigo mismo por haber estado a punto de tirar la toalla tan cerca, sin saberlo, del final de la espera.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Una mañana, casi dos semanas después de plantarla, Fran salió al patio en pijama, medio dormido todavía, y algo verde le llamó la atención desde la maceta. Un tallito fino, apenas más alto que su dedo meñique, se asomaba entre la tierra, buscando el sol con las dos primeras hojitas todavía dobladas.\n\nFran se quedó ahí parado, sin gritar ni correr a buscar a nadie, solo mirando ese tallito diminuto como si fuera lo más importante del mundo entero. Una pájara llamada Pipa, que siempre andaba por el patio de don Beto, se posó un segundo en el borde de la maceta, como si también hubiera venido a saludarlo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Semanas después, cuando el girasol ya le llegaba a la cintura y había abierto sus primeros pétalos amarillos, Fran se lo mostró a don Beto con el pecho inflado de orgullo.\n\n—Tardó, pero llegó —dijo simplemente, y don Beto asintió, sirviéndose un mate mientras miraba las flores de los dos jardines mecerse juntas con la misma brisa de la tarde.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Algunas cosas buenas no se pueden apurar, por más ganas que tengamos. Solo hace falta cuidarlas todos los días, sin rendirse, y confiar en que van a llegar cuando tengan que llegar.\n\n¿Hay algo que estás esperando ahora, que todavía no llega del todo? ¿Cómo lo cuidas mientras esperas?",
      },
    ],
    conversationQuestions: ["¿Hay algo que estás esperando ahora, que todavía no llega del todo? ¿Cómo lo cuidas mientras esperas?"],
  },
  {
    id: "cuento-perdon-el-barrilete-enredado",
    contentType: "cuento",
    title: "El barrilete que se enredó",
    subtitle: "Lo que se rompe entre amigos también se puede volver a armar",
    description:
      "Un accidente arruina el barrilete que un niño armó con mucho cariño junto a su abuelo, y deja a dos amigos con una decisión difícil por delante.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 304,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Bruno", "Cande"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-perdon-el-barrilete-enredado",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Bruno había pasado tres tardes enteras armando su barrilete junto a su abuelo: eligieron las varillas más derechas entre todo un montón, cortaron la tela de un celeste bien brillante, y le pintaron una cara sonriente que se veía clarita hasta desde el suelo. Era, sin dudas, lo más lindo que Bruno había hecho en su vida, y lo sabía.\n\nEse sábado, por fin con viento como para volar, invitó a su mejor amiga, Cande, a la plaza grande del barrio, la que tenía el pasto más parejo para correr sin tropezar.\n\n—Déjame probar a mí un rato —le pidió Cande, después de verlo elevarse altísimo, meciéndose contra las nubes como si supiera nadar en el aire.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Bruno dudó un segundo, porque ese barrilete era distinto a todos los demás que había tenido antes. Pero Cande era su mejor amiga desde el jardín de infantes, y compartir las cosas lindas con ella siempre había valido la pena.\n\n—Dale, pero agárralo fuerte —le dijo, pasándole el carretel con el hilo bien tenso.\n\nCande corrió unos pasos, riendo fuerte, sintiendo el tirón del viento en las manos. Por un momento el barrilete voló más alto que nunca, casi tocando una nube chiquita. Pero una ráfaga fuerte la tomó por sorpresa, el hilo se le escapó de entre los dedos, y el barrilete se fue en picada directo hacia el árbol más grande de la plaza.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Quedó ahí, enredado entre las ramas más altas, con la tela celeste rasgada en dos lugares y una de las varillas doblada en un ángulo que no debía tener. Cande se tapó la boca con las manos, los ojos ya llenos de lágrimas.\n\n—Perdón, Bruno, perdón, se me escapó, yo no quise...\n\nBruno sintió que algo se le apretaba en el pecho, mirando su barrilete colgando roto entre las hojas, tan lejos de sus manos. Pensó en las tres tardes con su abuelo, en la cara sonriente que ya no se veía entera desde el suelo. No dijo nada. Se dio media vuelta y empezó a caminar hacia su casa, con Cande detrás, sin saber qué más decir ni cómo alcanzarlo.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa misma noche, en su casa, Cande tampoco podía dormir. Daba vueltas en la cama pensando en la cara de Bruno al ver el barrilete colgando entre las ramas, en cómo se había ido caminando sin decir una palabra, que le había dolido más que si le hubiera gritado.\n\nPensó en llamarlo por teléfono para pedirle perdón otra vez, pero le daba vergüenza que la voz le saliera quebrada. Pensó en juntar la plata de su alcancía para comprarle uno nuevo, aunque sabía que ningún barrilete de tienda iba a reemplazar el que habían armado Bruno y su abuelo con tanto cuidado, tarde tras tarde.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "Esa noche, Bruno le contó todo a su abuelo, esperando que se enojara también, que se pusiera de su lado contra Cande. Pero su abuelo solo escuchó con calma, y al final le preguntó:\n\n—¿Cande lo rompió a propósito?\n\n—No —admitió Bruno—. Se le escapó el hilo, nomás. El viento estaba fuerte.\n\n—¿Y tú qué prefieres: quedarte enojado con tu barrilete roto, o quedarte con tu amiga, que capaz esta noche también está triste por lo que pasó, sola en su cuarto?\n\nBruno se quedó pensando largo rato, mirando por la ventana hacia la casa de Cande, donde todavía había una luz prendida.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Al otro día bien temprano, Bruno fue hasta la casa de Cande con el barrilete bajo el brazo, todavía roto. Cande abrió la puerta con los ojos hinchados, como si hubiera llorado la noche entera sin parar.\n\n—Lo podemos arreglar juntos —dijo Bruno, antes de que ella pudiera decir nada—. Tú me ayudas a sostener las varillas, y yo pego la tela. Mi abuelo dice que con cinta especial casi ni se nota el arreglo después.\n\nCande lo miró sin poder creerlo del todo, y después sonrió con toda la cara, como si le hubieran sacado un peso enorme de encima del pecho.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Pasaron la tarde entera arreglando el barrilete entre los dos, sentados en el piso del living con la tela extendida, y cuando terminaron, aunque quedaron dos remiendos bien visibles en el celeste, a Bruno le pareció que ahora tenía algo que antes no tenía: la historia de una amiga que se había animado a pedir perdón, y de él, que se había animado a darlo sin guardarse nada de rencor.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "A veces lo que se rompe no se puede dejar exactamente como estaba antes, y aun así se puede arreglar de otra manera, entre dos, con paciencia y con ganas.\n\n¿Alguna vez alguien te pidió perdón por algo que te dolió? ¿Qué hiciste con eso?",
      },
    ],
    conversationQuestions: ["¿Alguna vez alguien te pidió perdón por algo que te dolió? ¿Qué hiciste con eso?"],
  },
  {
    id: "cuento-valentia-la-cueva-oscura",
    contentType: "cuento",
    title: "La cueva de las sierras",
    subtitle: "A veces el primer paso hacia adentro es el más difícil de todos",
    description:
      "Un niño que le teme a la oscuridad debe entrar a una cueva desconocida para recuperar algo muy importante para él.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 315,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Dante", "Mili"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-valentia-la-cueva-oscura",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Dante y su prima Mili acampaban con la familia junto a las sierras, en un lugar donde de noche se veían más estrellas que en cualquier otro sitio que Dante conociera. Cerca del campamento había una cueva pequeña, de esas que la gente del pueblo contaba historias sobre ecos raros y corrientes de aire frío que salían de la nada, sin que nadie supiera bien de dónde venían.\n\n—Ni loco entro ahí —dijo Dante la primera tarde, mirando la entrada oscura desde lejos, con los brazos cruzados—. Ni aunque me paguen con todos los caramelos del mundo.\n\nMili se rió, pero no de él, sino porque ella también le tenía un poco de respeto a esa cueva, aunque nunca lo admitiera en voz alta delante de su primo menor.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Esa misma tarde, jugando a las bochas cerca de la entrada, la pelota favorita de Dante —la que tenía las iniciales de su abuelo escritas con marcador negro, medio borroneadas ya— rodó justo hacia adentro de la cueva y se perdió en la oscuridad, rebotando entre las piedras hasta que dejó de escucharse del todo.\n\nDante se quedó parado en la entrada, con el corazón latiéndole fuerte y las manos apretadas. Podía dejarla ahí. Nadie lo iba a obligar a entrar. Pero esa pelota había sido de su abuelo, que ya no estaba con ellos, y la idea de dejarla tirada en la oscuridad para siempre le dolía casi tanto como la oscuridad misma.",
      },
      {
        role: "narracion",
        mood: "night",
        caption:
          "—¿Vamos juntos? —le preguntó Mili, parada a su lado, mirando también hacia adentro con la linterna todavía apagada en la mano.\n\nDante asintió, aunque las piernas le temblaban un poco y la boca se le había secado de golpe. Encendieron la linterna que su tío les había prestado y entraron despacio, un paso, después otro, pisando con cuidado las piedras sueltas. El aire adentro era frío y olía a tierra mojada. Las sombras que la linterna dibujaba en las paredes se movían cada vez que alguno de los dos giraba la cabeza, y por un segundo a Dante le pareció escuchar un ruido raro, como un aleteo, que lo hizo pegarse todavía más cerca de su prima.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "—Es un murciélago, nomás —dijo Mili, apuntando la linterna hacia arriba, donde una sombra pequeña se acomodaba entre las rocas del techo—. No te va a hacer nada, tiene más miedo de nosotros que nosotros de él, en serio.\n\nDante respiró hondo, tratando de que no se le notara tanto el temblor en la voz. Podía dar media vuelta ahí mismo, y Mili probablemente no diría nada al respecto. Pero pensó en la pelota, en las iniciales de su abuelo, y en que faltaba tan poco para llegar hasta donde había dejado de rebotar. Apretó la linterna con las dos manos y siguió caminando, esta vez un paso adelante de su prima.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Un poco más adentro, el túnel se abrió en una especie de sala pequeña, con el techo más alto y gotas de agua que caían desde algún lugar invisible, haciendo un eco que sonaba distinto a cualquier ruido que Dante hubiera escuchado antes. Se detuvo un segundo, con la respiración agitada, y sintió que Mili le apretaba el hombro.\n\n—Estamos bien —le dijo ella, bajito, como si también necesitara escucharlo en voz alta—. Ya casi llegamos hasta donde se escuchó el último rebote.\n\nDante asintió, y en vez de quedarse quieto esperando que el miedo se le pasara solo, dio el siguiente paso.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "La encontró contra una piedra grande, casi al fondo de la cueva, justo donde el túnel se abría un poco y dejaba entrar un rayo de luz desde una grieta en el techo. Dante la levantó y la apretó contra el pecho un segundo, como si hubiera encontrado algo mucho más valioso que una simple pelota de goma.\n\n—¿Ves? —dijo Mili, sonriendo, con la voz más suelta ya—. Ya está. Ahora solo falta salir.\n\nCaminaron de vuelta hacia la entrada, y esta vez Dante no sintió que las sombras se movían para asustarlo, sino que apenas eran sombras, nomás, como en cualquier otro lugar del mundo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Cuando salieron a la luz del sol, Dante parpadeó fuerte, todavía con la pelota de su abuelo bien apretada en la mano. Esa noche, alrededor del fuego, con todos escuchando, les contó a los grandes cómo había entrado a la cueva más oscura de las sierras a buscarla, y por primera vez, al hablar de ella, no sintió miedo sino algo parecido al orgullo, calentito en el pecho como el fuego mismo.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "El miedo no desapareció de golpe, y capaz nunca desaparece del todo, pero Dante encontró algo más fuerte que ese miedo: una razón que valía la pena para dar el primer paso.\n\n¿Hay algo que te da miedo y que te gustaría animarte a enfrentar? ¿Quién te podría acompañar?",
      },
    ],
    conversationQuestions: ["¿Hay algo que te da miedo y que te gustaría animarte a enfrentar? ¿Quién te podría acompañar?"],
  },
  {
    id: "cuento-gratitud-el-dia-que-no-vio-el-sol",
    contentType: "cuento",
    title: "El día que no vio el sol",
    subtitle: "Cuando el cielo se pone gris, hay que aprender a mirar distinto.",
    description:
      "Durante una semana de lluvia interminable, Tomás cree que no hay nada bueno que encontrar, hasta que su abuela le propone un juego que le cambia la manera de mirar cada mañana.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 317,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Tomás", "Abuela Rosa"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-gratitud-el-dia-que-no-vio-el-sol",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Llevaba seis días lloviendo sin parar en el pueblo de Tomás. Seis días grises, con el cielo tan cargado de nubes que ni siquiera se sabía si el sol seguía ahí arriba, escondido.\n\nTomás miraba por la ventana con la nariz pegada al vidrio empañado.\n\n—Otra vez lloviendo —dijo, con la voz apagada—. No puedo ir a la plaza, no puedo andar en bici, no puedo hacer nada.\n\nSu abuela Rosa, que tejía en el sillón, levantó la vista.\n\n—Nada, nada, dices. ¿Nada de nada?\n\n—Nada —repitió Tomás, cruzando los brazos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Esa tarde, Tomás se quedó dando vueltas por la casa, aburrido, arrastrando las pantuflas por el pasillo. Se quejó del desayuno, se quejó de que el perro de la vecina ladraba, se quejó hasta de que la sopa estaba muy caliente.\n\n—Todo es horrible esta semana —murmuró, dejándose caer en el sofá junto a su abuela.\n\nAbuela Rosa dejó las agujas de tejer sobre la falda y lo miró un momento, sin apuro.\n\n—Te propongo un juego —dijo—. Mañana, antes de desayunar, vas a buscar tres cosas buenas. Solo tres. Por chiquitas que sean.\n\n—¿Con esta lluvia? —Tomás puso los ojos en blanco—. No va a haber nada bueno que buscar.\n\n—Probemos —dijo ella, sonriendo apenas.",
      },
      {
        role: "narracion",
        mood: "book",
        caption:
          "A la mañana siguiente, Tomás salió al patio de mal humor, dispuesto a demostrarle a su abuela que tenía razón: no había nada bueno esa semana. Pero apenas puso un pie afuera, notó algo raro.\n\nEl aire olía distinto. Fresco, a tierra mojada, a hojas nuevas.\n\nSe agachó, casi sin querer, y vio un caracol subiendo despacio por el tronco del limonero, dejando un caminito plateado. Nunca lo había visto ahí antes.\n\n—Bueno... eso es raro, no feo —admitió en voz baja.\n\nUn poco más allá, en el charco más grande del patio, descubrió que el cielo gris se reflejaba como un espejo, y las gotas que seguían cayendo dibujaban círculos que se cruzaban entre sí, uno tras otro, sin fin.\n\nSe quedó mirando un buen rato.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Esa noche, en la cocina, Tomás encontró la tercera cosa sin buscarla. Su mamá había hecho sopa —la misma sopa que él había odiado toda la semana— pero esa vez la sirvió con fideos con forma de estrellitas, como cuando él era más chico.\n\n—¿Te acordabas de que me gustaban estas? —preguntó, sorprendido.\n\n—Siempre me acuerdo —dijo su mamá, revolviendo la olla.\n\nTomás se quedó pensando, con la cuchara a mitad de camino. El caracol, los círculos en el charco, las estrellitas en la sopa. Ninguna de esas tres cosas iba a hacer que dejara de llover. Pero de alguna manera, el día ya no le parecía tan gris como ayer.\n\nFue corriendo a contárselo a su abuela, que lo esperaba en el sillón con las agujas quietas, como si ya supiera lo que iba a escuchar.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—¡Encontré las tres! —dijo Tomás, casi sin aliento—. Un caracol, círculos en un charco y fideos con forma de estrella.\n\n—¿Ves? —dijo Abuela Rosa, sin dejar de sonreír—. El sol seguía ahí arriba todo este tiempo, detrás de las nubes. Solo que a veces hay que buscar la luz en otro lado, no solo en el cielo.\n\nDesde esa noche, el juego de las tres cosas se volvió costumbre. Cada mañana, antes del desayuno, Tomás se sentaba un minuto a pensar. Algunos días las encontraba enseguida: el color del cielo al amanecer, una carta de un amigo, el pan recién horneado. Otros días le costaba más, y tenía que mirar con más atención, buscar debajo de lo obvio.\n\nSu abuela nunca le preguntaba si había encontrado las tres. Esperaba a que él quisiera contarle, y casi siempre, tarde o temprano, Tomás terminaba corriendo a buscarla para compartírselas.",
      },
      {
        role: "narracion",
        mood: "diary",
        caption:
          "Un mes después volvió a llover, casi tanto como aquella primera semana gris. Tomás bajó a desayunar y, en vez de quejarse, se sentó en la mesa con una sonrisa que sorprendió a su mamá.\n\n—¿Por qué tan contento con este día tan feo? —le preguntó ella, sirviéndole la leche.\n\n—No es feo —contestó Tomás, mirando por la ventana el patio mojado—. Todavía no busqué mis tres cosas. Dame un minuto.\n\nCerró los ojos un momento, como hacía cada mañana, y cuando los abrió, ya tenía la primera: el vapor que subía de su taza, dibujando formas en el aire frío de la cocina.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué lindo eso de encontrar tres cosas buenas hasta en la semana más gris, ¿no? A veces creemos que necesitamos que todo sea perfecto para estar contentos, y resulta que la alegría suele estar en las cosas más chiquitas: un olor, un dibujo en un charco, una sopa con forma de estrella. No hace falta que el sol salga para encontrarlas, alcanza con mirar un poco más despacio.\n\n¿Cuáles serían tus tres cosas buenas del día de hoy?",
      },
    ],
    conversationQuestions: ["¿Cuáles serían tus tres cosas buenas del día de hoy?"],
  },
  {
    id: "cuento-humildad-el-mejor-dibujante",
    contentType: "cuento",
    title: "El mejor dibujante",
    subtitle: "Ser el mejor en algo no significa que los demás no tengan nada para enseñarte.",
    description:
      "Valentina es la mejor dibujante de su clase, hasta que llega un compañero nuevo con un estilo tan distinto que la hace dudar de lo que creía saber.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 316,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Valentina", "Simón"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-humildad-el-mejor-dibujante",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "En la escuela de Valentina, todos sabían que ella dibujaba mejor que nadie. Sus dibujos ganaban los concursos, decoraban las carteleras del pasillo, y hasta la maestra los usaba de ejemplo.\n\n—Valentina, muéstrales a tus compañeros cómo hiciste las sombras en este árbol —decía la maestra casi todas las semanas.\n\nY Valentina, sin darse mucha cuenta, había empezado a creer que su forma de dibujar era la única forma correcta de hacerlo.\n\nUn día llegó Simón, un chico nuevo, callado, que se sentaba siempre en el último banco. En la clase de arte, mientras todos dibujaban un paisaje, Simón sacó una hoja y empezó a llenarla de formas raras: triángulos superpuestos, colores que no combinaban con nada real, un sol cuadrado.\n\nValentina se acercó a mirar y soltó una risita.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—Eso no es un paisaje —le dijo—. Los árboles no son triángulos y el sol no es cuadrado.\n\nSimón se puso colorado y tapó la hoja con el brazo, pero no dijo nada.\n\nEsa tarde, la maestra colgó los dibujos en la pared, como hacía siempre. El de Valentina, un paisaje perfecto con montañas y un lago, estaba en el centro. El de Simón quedó en una esquina, casi escondido.\n\nAl día siguiente, dos compañeras se pararon justo frente al dibujo de Simón, señalando y cuchicheando. Valentina se acercó, lista para reírse con ellas.\n\n—Mira los colores —dijo una de las chicas—. Es raro, pero... me gusta. Parece un sueño.\n\nValentina se quedó callada, sin saber qué decir.",
      },
      {
        role: "narracion",
        mood: "diary",
        caption:
          "Esa noche, en su casa, Valentina no podía dejar de pensar en el dibujo de Simón. Sacó su cuaderno y trató de copiar algo parecido: triángulos, colores que no combinaban. Pero por más que lo intentó, el suyo no se parecía en nada al de él. Le salía forzado, como un disfraz que no le quedaba bien.\n\n—Yo sé dibujar árboles perfectos —murmuró, frustrada—, pero no sé dibujar así.\n\nSe dio cuenta, sin que nadie se lo dijera, de que había algo que Simón sabía hacer y ella no. Y que se había reído de eso sin siquiera intentarlo primero.\n\nAl otro día, antes de que sonara el timbre, Valentina caminó hasta el último banco, donde Simón guardaba sus cosas en silencio, listo para otro día en el que nadie le hablaba.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "—Ayer me reí de tu dibujo —le dijo Valentina, directo, sin vueltas—. Y no debí hacerlo. Anoche intenté dibujar como tú y no me salió ni parecido. Es difícil.\n\nSimón la miró, sorprendido, sin saber si confiar.\n\n—¿De verdad lo intentaste?\n\n—De verdad. Me quedó horrible —Valentina se rió de sí misma esta vez, no de él—. ¿Me enseñas cómo haces los colores así, que no combinan pero combinan?\n\nSimón dudó un segundo. Después, despacio, sacó una hoja nueva y empezó a mostrarle, línea por línea, cómo elegía las formas sin pensarlas demasiado, dejando que la mano hiciera lo que quisiera.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Con el tiempo, algo cambió en la clase de arte. Valentina seguía dibujando sus paisajes prolijos, los que tanto le salían, pero ahora se sentaba junto a Simón para ver cómo él resolvía un color imposible o una forma que no tenía nombre.\n\nY Simón, que al principio apenas hablaba, empezó a comentar en voz alta lo que hacía, a explicar sus ideas sin miedo a que se rieran.\n\nUn día, la maestra propuso un dibujo en pareja. Valentina y Simón trabajaron juntos: ella puso las montañas y el lago, él llenó el cielo de formas que no eran nubes pero que, de alguna manera, se sentían como nubes.\n\nCuando lo colgaron en la pared, nadie se rió. Todos se quedaron mirándolo un rato largo, como si tuviera algo que ningún otro dibujo de la cartelera tenía.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Semanas después, llegó otro concurso de dibujo, esta vez para toda la escuela. Valentina, que en otros años se hubiera anotado sola, sin dudarlo, esa vez golpeó la puerta del último banco antes de anotarse.\n\n—¿Quieres que hagamos equipo? —le preguntó a Simón—. Tú con tus colores imposibles, yo con mis formas prolijas. A ver qué sale.\n\nSimón sonrió, algo que hacía cada vez más seguido desde que había llegado a esa escuela.\n\n—Vamos —dijo—. Pero esta vez el sol lo hago yo. Cuadrado.\n\nValentina se rió de verdad, sin ninguna burla esta vez, y sacó una hoja en blanco para empezar.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué distinto se ve el trabajo de otra persona cuando uno se anima a probar y descubre lo difícil que es hacerlo tan bien como ella. Valentina no dejó de ser buena dibujando: aprendió, además, a mirar lo que otros hacían bien sin sentir que eso le quitaba algo a ella.\n\n¿Hay alguien que hace algo distinto a ti, a su manera, y que te gustaría animarte a mirar más de cerca?",
      },
    ],
    conversationQuestions: ["¿Hay alguien que hace algo distinto a ti, a su manera, y que te gustaría animarte a mirar más de cerca?"],
  },
  {
    id: "cuento-perseverancia-la-bicicleta-sin-rueditas",
    contentType: "cuento",
    title: "La bicicleta sin rueditas",
    subtitle: "A veces hay que caerse varias veces antes de aprender a volar sobre dos ruedas.",
    description:
      "Mateo quiere rendirse apenas se cae las primeras veces de su bicicleta sin rueditas, hasta que descubre que cada caída lo acerca un poco más a lograrlo.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 320,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Mateo", "el papá de Mateo"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-perseverancia-la-bicicleta-sin-rueditas",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "Mateo tenía siete años y una bicicleta celeste con una canasta al frente. Hasta ese verano, esa bicicleta siempre había tenido dos rueditas chiquitas atrás, que la sostenían derecha sin que él tuviera que pensarlo.\n\nPero ese sábado, su papá llegó al patio con una llave inglesa y una sonrisa.\n\n—¿Estás listo? —le preguntó, arrodillándose junto a la rueda trasera—. Hoy sacamos las rueditas.\n\nMateo sintió un nudo en la panza. Miró la bicicleta como si fuera otra, una desconocida.\n\n—¿Y si me caigo?\n\n—Te vas a caer —dijo su papá, sin vueltas, mientras aflojaba el primer tornillo—. Eso seguro. La pregunta es qué haces después de caerte.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El primer intento duró menos de tres segundos. Mateo se subió, su papá sostuvo el asiento, empezó a pedalear... y apenas lo soltaron, la bicicleta se inclinó hacia un costado y Mateo terminó sentado en el pasto, con el codo raspado.\n\n—¡No puedo! —gritó, con los ojos llenos de lágrimas—. Esta bicicleta es imposible.\n\n—No es imposible —dijo su papá, ayudándolo a levantarse—. Todavía no la conoces sin las rueditas. Es distinto.\n\nLo intentaron de nuevo. Y otra vez. Y otra más. El sol ya estaba alto cuando Mateo, sudado y con las rodillas sucias de tierra, se sentó en el borde de la vereda, negándose a subir una vez más.\n\n—No sirvo para esto —dijo, en voz baja, mirando el suelo.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "Su papá se sentó junto a él, sin apurarlo.\n\n—¿Sabes cuántas veces me caí yo cuando aprendí? —le preguntó.\n\nMateo negó con la cabeza.\n\n—Ni me acuerdo. Muchas. Un montón. Y mira, ahora ando en bici sin pensarlo, como si supiera desde siempre. Pero no fue así el primer día. Ni el segundo. Capaz ni el décimo.\n\nMateo se quedó mirando la bicicleta celeste, tirada de costado en el pasto, con la canasta un poco torcida.\n\n—¿Y si mañana lo intentamos otra vez? —dijo su papá—. Hoy ya aprendiste algo: sabes cómo se siente cuando se inclina para el lado que no tiene que inclinarse. Eso ya es un montón.\n\nMateo no contestó, pero esa noche, antes de dormir, se quedó pensando en la bicicleta más de lo que hubiera querido admitir.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Al día siguiente volvieron a intentarlo. Y al otro. Cada vez, Mateo lograba pedalear un poquito más antes de caerse: cinco vueltas de pedal, después ocho, después una vuelta entera alrededor del limonero del patio.\n\nUn jueves por la tarde, mientras su papá corría a su lado sosteniendo apenas el asiento con dos dedos, pasó algo distinto. Mateo sintió que las manos de su papá ya no estaban ahí. Llevaba solo, sin saberlo, casi diez metros.\n\n—¡Papá, no me sueltes! —gritó, mirando hacia atrás.\n\n—¡Hace rato que no te sostengo! —le contestó su papá, riéndose, ya lejos, en el punto donde lo había soltado.\n\nMateo, del susto, casi se cae. Pero en vez de eso, apretó el manubrio, miró hacia adelante, y siguió pedaleando.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Esa noche, en la cena, Mateo no paraba de hablar de la bicicleta: de la vuelta al limonero, del momento en que su papá lo soltó sin avisarle, de cómo el viento le pegaba en la cara cuando por fin agarró velocidad.\n\n—Estuviste a punto de dejarlo el primer día —le recordó su papá, sirviéndose ensalada—. ¿Te acuerdas?\n\n—Me acuerdo —dijo Mateo, y por primera vez sonrió al pensarlo, en lugar de fastidiarse—. Pensé que no iba a poder.\n\n—¿Y ahora?\n\nMateo miró por la ventana, hacia el patio donde la bicicleta celeste descansaba apoyada contra la pared, sin rueditas, lista para el día siguiente.\n\n—Ahora sé que solo tenía que caerme las veces que hicieran falta —dijo.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "El domingo siguiente, Mateo le pidió a su papá ir hasta la plaza grande, la que tenía la bajada larga que antes le daba miedo con las rueditas puestas. Se subió a la bicicleta él solo, sin que nadie sostuviera nada, y empujó con el pie hasta agarrar impulso.\n\nBajó la loma entera sin caerse ni una vez, con el pelo volando y una sonrisa que no podía guardarse. Al llegar abajo, frenó como pudo, casi de costado, y se quedó ahí, respirando fuerte, mirando la loma que acababa de bajar.\n\nSu papá llegó corriendo detrás, sin aliento.\n\n—¿Viste? —gritó Mateo, antes de que su papá dijera nada—. ¡Ya sé, ya sé de verdad!\n\n—Ya sabías desde el jueves —le dijo su papá, revolviéndole el pelo—. Hoy nomás te animaste a creerlo.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué distinto se siente un objetivo cuando lo miramos de a poco: una vuelta al limonero, después otra un poco más larga, y así hasta que un día simplemente ya sabemos hacerlo. Mateo no dejó de caerse. Aprendió a levantarse una vez más de las que se había caído.\n\n¿Hay algo que te gustaría seguir intentando, aunque todavía no te salga del todo?",
      },
    ],
    conversationQuestions: ["¿Hay algo que te gustaría seguir intentando, aunque todavía no te salga del todo?"],
  },
  {
    id: "cuento-amabilidad-el-nuevo-de-la-clase",
    contentType: "cuento",
    title: "El nuevo de la clase",
    subtitle: "A veces alcanza con cruzar el patio para que alguien deje de sentirse solo.",
    description:
      "El primer día de Iván en su nueva escuela nadie lo invita a jugar, hasta que una compañera decide cruzar el patio y cambiarle el día.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 309,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Camila", "Iván", "Delfina"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-amabilidad-el-nuevo-de-la-clase",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "El primer día de Iván en la escuela, llovía apenas, esa lluvia fina que ni obliga a sacar el paraguas. Llegó de la mano de su mamá, con una mochila nueva y los cordones de las zapatillas todavía sin gastar, y se quedó parado en la puerta del salón sin saber muy bien dónde sentarse.\n\nCamila lo vio desde su banco, en la última fila junto a la ventana. Vio cómo Iván recorría el salón con la mirada, buscando un lugar libre, y cómo dos chicos de adelante se hacían los distraídos justo cuando él pasaba cerca.\n\nAl final, Iván se sentó solo, en el banco que quedaba pegado al armario de los útiles, el que nadie elegía nunca.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "En el recreo, Camila lo vio otra vez: parado cerca de la pared, mirando cómo los demás jugaban a la mancha, sin animarse a acercarse. Nadie lo trataba mal. Pero nadie lo invitaba tampoco, y eso, pensó Camila, podía doler casi lo mismo.\n\nSus amigas la llamaron desde el otro lado del patio.\n\n—¡Camila, ven, te toca a ti! —gritaron, señalando el juego.\n\nCamila miró hacia el juego, y después miró a Iván, parado solo junto a la pared. Dudó un segundo.\n\n—¡Ya voy! —les contestó a sus amigas.\n\nPero primero caminó hasta donde estaba Iván.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "—Hola —le dijo—. Soy Camila. ¿Juegas a la mancha?\n\nIván la miró, sorprendido de que alguien le hablara.\n\n—No sé las reglas de aquí —dijo, en voz baja—. En mi escuela anterior jugábamos distinto.\n\n—Te las explico mientras jugamos, es fácil —dijo Camila, y sin esperar respuesta, lo agarró suavemente del brazo y lo llevó hacia el grupo—. ¡Este es Iván, juega con nosotros!\n\nAlgunos chicos lo miraron con curiosidad, otros ni se dieron cuenta. Pero el juego siguió, y esta vez Iván estaba adentro, corriendo, riéndose cuando por poco lo agarraban, gritando cuando lograba escaparse.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Al otro día, y al siguiente, Camila siguió guardándole un lugar en su mesa a la hora de comer, y Iván empezó a sentarse ahí sin que hiciera falta pedirlo. Le contó que se habían mudado de ciudad hacía dos semanas, que extrañaba a sus amigos de antes, que le costaba acordarse los nombres de todos los compañeros nuevos.\n\nUna tarde, mientras guardaban los útiles, una de las amigas de Camila le preguntó, casi sin maldad:\n\n—¿Por qué te hiciste tan amiga del nuevo? Ni lo conocías.\n\nCamila pensó un momento antes de contestar.\n\n—Por eso mismo —dijo—. Porque no conocía a nadie. Y yo sí conocía a todos.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Con las semanas, Iván dejó de ser el nuevo para volverse, simplemente, un compañero más: el que hacía los mejores aviones de papel, el que siempre tenía una lapicera de repuesto para prestar, el que se reía fuerte en los momentos menos pensados.\n\nUn día llegó otra chica nueva a la escuela, tímida, parada en la puerta del salón sin saber dónde sentarse. Antes de que Camila pudiera levantarse, vio que Iván ya estaba cruzando el aula hacia ella.\n\n—Hola —lo escuchó decir—. Yo también fui nuevo hace poco. Te muestro dónde queda todo, si quieres.\n\nCamila sonrió, sin decir nada, y siguió guardando sus cosas.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "La chica nueva se llamaba Delfina, y como Iván meses atrás, se quedó parada un instante en la puerta sin saber a quién mirar. Pero esa duda le duró mucho menos que a él: apenas Iván se acercó y le habló, algo en sus hombros pareció aflojarse.\n\nCamila los observó desde su banco mientras guardaba el cuaderno de matemática. Recordó el primer día de Iván, la lluvia fina, el banco pegado al armario que nadie elegía nunca. Pensó en lo fácil que hubiera sido para ella quedarse del lado del recreo con sus amigas esa vez, sin cruzar el patio.\n\nEn el recreo, vio a Delfina jugando ya con un grupo chico, riéndose de algo que le había dicho Iván. Nadie le explicó las reglas de memoria ni le hizo un discurso: alguien, simplemente, la invitó a jugar.\n\nCamila se acercó también, y esa tarde, a la salida, las tres caminaron juntas hasta el portón, hablando de nada en particular: de un dibujo animado, de una tarea de matemática, de lo raro que era el clima ese día. Nada que pareciera importante. Y sin embargo, para Delfina, que unas horas antes no conocía a nadie en esa escuela, era todo.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué lindo lo que armó Camila con un gesto tan simple: caminar hasta donde estaba alguien solo e invitarlo a jugar. A veces la amabilidad no necesita ser un gran plan, alcanza con animarse a cruzar el patio.\n\n¿Alguna vez invitaste a alguien que estaba solo a sumarse a lo que estabas haciendo?",
      },
    ],
    conversationQuestions: ["¿Alguna vez invitaste a alguien que estaba solo a sumarse a lo que estabas haciendo?"],
  },
  {
    id: "cuento-trabajo-en-equipo-el-puente-de-piedras",
    contentType: "cuento",
    title: "El puente de piedras",
    subtitle: "Ninguno podía solo, pero juntos construyeron algo que los cruzó a todos.",
    description:
      "Cuatro amigos separados por un arroyo deciden construir su propio puente de piedras, y descubren que cada uno tiene algo distinto para aportar.",
    category: "general",
    collectionId: "cuentos-con-valores",
    lengthCategory: "cuento-valores",
    durationSeconds: 331,
    ageRange: "4-10",
    narrator: "Lumo",
    characters: ["Naza", "Coti", "Dani", "Pipo"],
    tags: ["valores"],
    passages: [],
    language: "es",
    illustrationSlug: "cuento-trabajo-en-equipo-el-puente-de-piedras",
    audioUrl: null,
    musicUrl: null,
    segments: [
      {
        role: "narracion",
        mood: "family",
        caption:
          "El arroyo que separaba el campito de juegos de la casa vieja del molino se llenaba de agua cada vez que llovía fuerte, y ese año había llovido más que nunca. Naza, Coti, Dani y Pipo se quedaban siempre del mismo lado, mirando el agua correr, porque el puente de madera que usaban antes se había podrido y nadie lo arreglaba.\n\n—Si tuviéramos un puente, podríamos llegar al molino en dos minutos —dijo Naza, sentada en una piedra grande junto a la orilla—. Por el camino largo se hace media hora.\n\n—Podríamos hacer uno nosotros —dijo Dani, señalando las piedras que asomaban en la parte más angosta del arroyo—. Con piedras. Bien apiladas.\n\nLos otros tres lo miraron como si hubiera dicho una locura.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Al día siguiente, sin ponerse muy de acuerdo, los cuatro volvieron al arroyo con la idea todavía dando vueltas. Pipo, el más fuerte del grupo, agarró la piedra más grande que encontró y la tiró al agua, cerca de la orilla, con un chapoteo enorme.\n\n—¡Listo, ya empezamos! —dijo, orgulloso.\n\nPero cuando quiso poner la segunda piedra encima, la corriente la movió apenas y toda la torre se vino abajo.\n\n—Así no funciona —dijo Coti, cruzándose de brazos—. Tú tiras piedras nomás, sin pensar dónde.\n\n—¿Y tú qué sabes? Ni te acercaste al agua —contestó Pipo, molesto.\n\nNaza y Dani se miraron, incómodos, mientras los otros dos seguían discutiendo a los gritos junto al arroyo.",
      },
      {
        role: "narracion",
        mood: "threshold",
        caption:
          "—Paren un segundo —dijo Naza, metiéndose en el medio—. Si seguimos así, no va a haber puente ni aunque pase todo el verano.\n\nSe hizo un silencio, roto solo por el ruido del agua.\n\n—Yo puedo cargar las piedras grandes —dijo Pipo, todavía enojado, pero más bajo—. Soy el más fuerte, eso puedo hacer.\n\n—Yo me fijo dónde conviene ponerlas —dijo Coti—. En mi casa mi tío hace paredes de piedra, sé más o menos cómo se acomodan para que no se caigan.\n\nDani levantó la mano, tímido.\n\n—Yo puedo meterme al agua y sostenerlas mientras Pipo trae más, para que no se muevan con la corriente.\n\n—¿Y yo? —preguntó Naza.\n\n—Tú nos dices cuándo parar la discusión —dijo Coti, y por primera vez en el día, los cuatro se rieron.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Trabajaron toda la tarde. Pipo cargaba las piedras más pesadas desde la orilla, resoplando con cada viaje. Coti las miraba desde afuera y decidía dónde iban, probando ángulos, descartando las que eran demasiado redondas para quedarse quietas. Dani, metido hasta las rodillas en el agua fría, sostenía cada piedra el tiempo justo para que encajara con la de al lado. Y Naza pasaba las piedras chicas, las que rellenaban los huecos, y avisaba cuando alguna quedaba floja.\n\nA mitad de camino, una piedra grande que Pipo acababa de acomodar se movió con la corriente y estuvo a punto de arrastrar a Dani.\n\n—¡Sosténla! —gritó Coti.\n\nPipo se metió al agua sin pensarlo y la sostuvo con las dos manos hasta que Dani recuperó el equilibrio. Nadie dijo nada del susto. Siguieron trabajando.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Cuando el sol ya bajaba, el puente de piedras cruzaba el arroyo entero, angosto pero firme, desde la orilla del campito hasta la del molino. Ninguno de los cuatro, solo, hubiera podido terminarlo: a Pipo le habría faltado paciencia para acomodar bien cada piedra, a Coti le habría faltado fuerza para cargarlas, a Dani se le habría llevado la corriente sin nadie que le trajera más, y a Naza, sin los otros tres, no le habría quedado más que mirar el arroyo desde la orilla.\n\nPipo fue el primero en cruzar, probando el equilibrio piedra por piedra. Cuando llegó al otro lado, se dio vuelta y estiró la mano hacia Dani, que dudaba en el borde.\n\n—Vamos, que entre los cuatro lo hicimos bien firme —le dijo.\n\nUno por uno, los cuatro cruzaron el arroyo por primera vez sin mojarse los pies.",
      },
      {
        role: "narracion",
        mood: "family",
        caption:
          "Se sentaron los cuatro en la orilla del molino, agotados, con las manos raspadas y la ropa salpicada de barro, mirando el puente que acababan de terminar. Nadie dijo demasiado. Pipo se dejó caer de espaldas sobre el pasto, respirando fuerte. Coti seguía mirando el puente, buscando alguna piedra floja, más por costumbre que por necesidad.\n\n—Cuando lo empezamos, pensé que era una idea de locos —admitió Naza, rompiendo el silencio.\n\n—Yo también —dijo Coti—. Pero de las buenas.\n\nEsa tarde volvieron a cruzar el puente varias veces, solo por el gusto de hacerlo, hasta que el sol se puso del todo y sus mamás los llamaron a gritos, cada una desde su lado del arroyo, para que volvieran a casa.",
      },
      {
        role: "guia-cierre",
        mood: "prayer",
        caption:
          "Qué distinto les salió el puente cuando cada uno hizo lo que mejor sabía hacer, en vez de pelear por hacerlo todo solo o a su manera. Ni Pipo con toda su fuerza, ni Coti con toda su idea, lo hubieran logrado sin los otros tres.\n\n¿Alguna vez construiste algo con otros que solo no hubieras podido hacer?",
      },
    ],
    conversationQuestions: ["¿Alguna vez construiste algo con otros que solo no hubieras podido hacer?"],
  },
];

export function getContent(id: string): ContentItem | undefined {
  return CONTENT.find((c) => c.id === id);
}

export function getContentByType(type: ContentType): ContentItem[] {
  return CONTENT.filter((c) => c.contentType === type);
}
