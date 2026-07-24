"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Story } from "@/lib/story-catalog";
import { MoodScene } from "@/components/scenes/mood-scene";
import { ArtAsset } from "@/components/app/art-asset";

type StoryPosterProps = {
  story: Story;
  size?: "large" | "medium";
  /** Visible pero bloqueada — no es la Historia del Día y todavía no son suscriptores. */
  locked?: boolean;
};

/** Tarjeta-póster: el arte ocupa toda la tarjeta, el texto flota encima con un scrim. */
export function StoryPoster({ story, size = "medium", locked = false }: StoryPosterProps) {
  const height = size === "large" ? "h-72" : "h-52";
  const width = size === "large" ? "w-full" : "w-44 shrink-0";

  return (
    <Link href={`/app/historia/${story.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`image-text-overlay relative ${width} ${height} overflow-hidden rounded-[12px] shadow-sm`}
      >
        <ArtAsset
          slug={`story-${story.id}`}
          alt={story.title}
          fallback={<MoodScene mood={story.scenes[0].mood} />}
          className="absolute inset-0"
        />
        <div className="overlay-content absolute inset-0">
          {locked && (
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5 text-white" />
            </span>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-caption text-white backdrop-blur-sm">
            {story.category === "antiguo" ? "Antiguo Testamento" : "Nuevo Testamento"}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-heading text-h2 leading-tight text-white text-balance">
              {story.title}
            </h3>
            {size === "large" && (
              <p className="mt-1 text-body text-white/80 text-balance">{story.subtitle}</p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
