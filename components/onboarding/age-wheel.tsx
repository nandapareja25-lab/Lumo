"use client";

import { useEffect, useRef } from "react";

const EDADES = [4, 5, 6, 7, 8, 9, 10];
const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 3; // 1 arriba + centro + 1 abajo

type AgeWheelProps = {
  value: number | null;
  onChange: (age: number) => void;
};

/** Selector tipo rueda (scroll-snap) — pedido explícito del usuario en vez de la grilla de chips. */
export function AgeWheel({ value, onChange }: AgeWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const initial = value ?? EDADES[0];
    const index = EDADES.indexOf(initial);
    el.scrollTo({ top: index * ITEM_HEIGHT, behavior: "instant" as ScrollBehavior });
    if (!value) onChange(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.min(Math.max(index, 0), EDADES.length - 1);
    const age = EDADES[clamped];
    if (age !== value) onChange(age);
  }

  let scrollTimeout: ReturnType<typeof setTimeout>;
  function handleScrollEnd() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 80);
  }

  return (
    <div
      className="relative mx-auto w-40"
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 z-10 rounded-2xl border-2 border-primary/50 bg-primary/5"
        style={{ top: ITEM_HEIGHT * paddingItems, height: ITEM_HEIGHT }}
      />
      <div
        ref={containerRef}
        onScroll={handleScrollEnd}
        className="scrollbar-none h-full snap-y snap-mandatory overflow-y-auto"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div style={{ height: ITEM_HEIGHT * paddingItems }} />
        {EDADES.map((edad) => (
          <div
            key={edad}
            className="flex snap-center items-center justify-center font-heading text-2xl font-semibold transition-opacity"
            style={{
              height: ITEM_HEIGHT,
              opacity: edad === value ? 1 : 0.35,
            }}
          >
            {edad}
          </div>
        ))}
        <div style={{ height: ITEM_HEIGHT * paddingItems }} />
      </div>
    </div>
  );
}
