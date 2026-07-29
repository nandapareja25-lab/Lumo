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
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-center text-foreground">
        <p className="text-muted-foreground">No encontramos esta historia.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
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
            background: "linear-gradient(0deg, #FDFCF9 0%, rgba(253,252,249,0.15) 45%, rgba(253,252,249,0) 70%)",
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
          <Heart className="h-5 w-5" style={{ color: fav ? "#F06BA8" : "#fff", fill: fav ? "#F06BA8" : "none" }} />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2">
        <div>
          <span
            className="mb-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
            style={{ background: "#FFF4D6", color: "#B8912A" }}
          >
            {story.category === "antiguo" ? "Antiguo Testamento" : story.category === "nuevo" ? "Nuevo Testamento" : "Cuento"}
          </span>
          <h1 className="font-heading text-2xl font-bold text-balance">{story.title}</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">{story.subtitle}</p>
        </div>

        <Link
          href={`/reproducir/${story.id}`}
          className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full text-base font-bold text-[#2D2A26]"
          style={{ background: "linear-gradient(180deg, #F7C948, #F5A300)", boxShadow: "var(--shadow-button)" }}
        >
          <Play className="h-4 w-4 fill-current" /> {done ? "Volver a escuchar" : "Reproducir historia"}
        </Link>
        {done && (
          <p className="text-center text-xs text-muted-foreground">
            Ya vivieron esta historia en familia — pueden repetirla cuando quieran.
          </p>
        )}
      </div>
    </main>
  );
}
