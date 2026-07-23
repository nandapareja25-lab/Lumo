"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArtAsset } from "./art-asset";
import { MoodScene } from "@/components/scenes/mood-scene";
import { illustrationForSegment, type ContentItem, type SceneMood } from "@/lib/content-catalog";

type Props = {
  content: ContentItem;
  segmentIndex: number;
  mood: SceneMood;
  className?: string;
  /** Crossfade entre ilustraciones al cambiar de segmento — solo tiene sentido en la pantalla
   * de narración activa, no en portadas estáticas (gateo / audio pendiente). */
  animated?: boolean;
};

/**
 * Resuelve qué imagen mostrar para un segmento dado: si el episodio ya tiene ilustraciones por
 * escena (`content.illustrations`), usa la que corresponda; si no, cae al comportamiento legado
 * de una sola portada por episodio (<ArtAsset> + illustrationSlug). Así los episodios viejos no
 * cambian de comportamiento, y los nuevos pueden tener una imagen real por momento narrativo.
 */
export function EpisodeIllustration({ content, segmentIndex, mood, className, animated }: Props) {
  const illustration = illustrationForSegment(content, segmentIndex);

  if (!illustration) {
    return (
      <ArtAsset
        slug={content.illustrationSlug}
        alt={content.title}
        fallback={<MoodScene mood={mood} />}
        className={className}
      />
    );
  }

  const img = (
    <Image src={illustration.image600} alt={content.title} fill className="object-cover" sizes="800px" />
  );

  if (!animated) {
    return <div className={`overflow-hidden ${className ?? ""}`}>{img}</div>;
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={illustration.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {img}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
