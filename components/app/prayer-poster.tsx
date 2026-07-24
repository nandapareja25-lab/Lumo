"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Prayer } from "@/lib/prayers";
import { MoodScene } from "@/components/scenes/mood-scene";
import { ArtAsset } from "@/components/app/art-asset";

/** Tarjeta-póster de una oración — mismo lenguaje que StoryPoster, lleva directo al reproductor. */
export function PrayerPoster({ prayer, locked = false }: { prayer: Prayer; locked?: boolean }) {
  return (
    <Link href={`/reproducir/${prayer.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="image-text-overlay relative h-52 w-44 shrink-0 overflow-hidden rounded-[12px] shadow-sm"
      >
        <ArtAsset
          slug={prayer.illustrationSlug}
          alt={prayer.title}
          fallback={<MoodScene mood="prayer" />}
          className="absolute inset-0"
        />
        <div className="overlay-content absolute inset-0">
          {locked && (
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5 text-white" />
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-heading text-h2 leading-tight text-white text-balance">
              {prayer.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
