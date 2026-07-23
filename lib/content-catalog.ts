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
  | "afirmacion";

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
  | "episodio-serie"; // 2-5 min — episodios de Series (hábito diario)

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
];

export function getContent(id: string): ContentItem | undefined {
  return CONTENT.find((c) => c.id === id);
}

export function getContentByType(type: ContentType): ContentItem[] {
  return CONTENT.filter((c) => c.contentType === type);
}
