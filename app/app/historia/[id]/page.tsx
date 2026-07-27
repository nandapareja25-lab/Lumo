"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Heart, Play } from "lucide-react";
import { MoodScene } from "@/components/scenes/mood-scene";
import { ArtAsset } from "@/components/app/art-asset";
import { getStory } from "@/lib/story-catalog";
import { isStoryCompleted, readApp, toggleFavorite } from "@/lib/app-data";

export default function HistoriaCoverPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const story = getStory(id);
  const [fav, setFav] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!story) return;
    setFav(readApp().favoriteStoryIds.includes(story.id));
    setDone(isStoryCompleted(story.id));
  }, [story]);

  if (!story) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#FAF3EE] px-4 text-center text-[#2A1F17]">
        <p className="text-[#6B5A4A]">No encontramos esta historia.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-[#FAF3EE] text-[#2A1F17]">
      <div className="relative h-96 w-full">
        <ArtAsset
          slug={story.id.startsWith("cuento-") ? story.id : `story-${story.id}`}
          alt={story.title}
          fallback={<MoodScene mood={story.scenes[0].mood} />}
          className="absolute inset-0"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(0deg, #FAF3EE 0%, rgba(250,243,238,0.15) 45%, rgba(250,243,238,0) 70%)",
          }}
        />
        <button
          onClick={() => router.push("/app/explorar")}
          className="absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
          aria-label="Volver"
        >
          ←
        </button>
        <button
          onClick={() => {
            toggleFavorite(story.id);
            setFav((f) => !f);
          }}
          aria-label="Favorito"
          className="absolute right-4 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
        >
          <Heart className="h-5 w-5" style={{ color: fav ? "#F3C878" : "#fff", fill: fav ? "#F3C878" : "none" }} />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2">
        <div>
          <span
            className="mb-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
            style={{ background: "rgba(42,31,23,0.06)", color: "#6B5A4A" }}
          >
            {story.category === "antiguo" ? "Antiguo Testamento" : story.category === "nuevo" ? "Nuevo Testamento" : "Cuento"}
          </span>
          <h1 className="font-heading text-2xl font-medium text-balance">{story.title}</h1>
          <p className="mt-1 text-[15px] text-[#6B5A4A]">{story.subtitle}</p>
        </div>

        <Link
          href={`/reproducir/${story.id}`}
          className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full text-base font-semibold text-[#1F1712]"
          style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
        >
          <Play className="h-4 w-4 fill-current" /> {done ? "Volver a escuchar" : "Reproducir historia"}
        </Link>
        {done && (
          <p className="text-center text-xs text-[#6B5A4A]">
            Ya vivieron esta historia en familia — pueden repetirla cuando quieran.
          </p>
        )}
      </div>
    </main>
  );
}
