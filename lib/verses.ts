export type Verse = {
  reference: string;
  text: string;
  meaning: string;
  thinkAbout: string;
};

/** Catálogo de versículos — escalable a cientos, cada uno es solo un objeto más. */
export const VERSES: Verse[] = [
  {
    reference: "Salmo 119:105",
    text: "Tu palabra es una lámpara a mis pies; es una luz en mi camino.",
    meaning: "Dios nos guía paso a paso, como una luz que alumbra justo lo que tenemos delante.",
    thinkAbout: "¿En qué momento de hoy necesitaste un poco de esa luz?",
  },
  {
    reference: "Marcos 10:14",
    text: "Dejen que los niños vengan a mí, y no se lo impidan, porque el reino de Dios es de quienes son como ellos.",
    meaning: "Jesús ama profundamente a los niños y siempre tiene tiempo para ellos.",
    thinkAbout: "¿Cómo te imaginas sentado junto a Jesús en ese momento?",
  },
  {
    reference: "Filipenses 4:13",
    text: "Todo lo puedo en Cristo que me fortalece.",
    meaning: "No estamos solos frente a lo difícil — hay una fuerza más grande que nos acompaña.",
    thinkAbout: "¿Qué cosa difícil de hoy puedes enfrentar con esa fuerza?",
  },
  {
    reference: "Josué 1:9",
    text: "Sé fuerte y valiente. No temas ni desmayes, porque Jehová tu Dios estará contigo.",
    meaning: "El valor no es no tener miedo — es saber que no estamos solos al enfrentarlo.",
    thinkAbout: "¿Alguna vez sentiste miedo y aun así fuiste valiente?",
  },
  {
    reference: "1 Juan 4:19",
    text: "Nosotros amamos porque él nos amó primero.",
    meaning: "El amor de Dios viene primero, y de ahí aprendemos a amar a los demás.",
    thinkAbout: "¿A quién puedes mostrarle amor hoy?",
  },
  {
    reference: "Salmo 23:1",
    text: "El Señor es mi pastor, nada me falta.",
    meaning: "Como un pastor cuida a sus ovejas, Dios cuida de cada uno de nosotros.",
    thinkAbout: "¿En qué sentiste el cuidado de Dios esta semana?",
  },
  {
    reference: "Proverbios 3:5",
    text: "Confía en el Señor de todo corazón, y no te apoyes en tu propia inteligencia.",
    meaning: "A veces no entendemos todo, pero podemos confiar igual.",
    thinkAbout: "¿Qué es algo en lo que te cuesta confiar?",
  },
];

export function todaysVerse(seed: number): Verse {
  return VERSES[seed % VERSES.length];
}
