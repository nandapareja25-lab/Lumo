"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Aparece cuando el hero sale del viewport; se oculta frente a la oferta y el CTA final (55 → Transversal 2). */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const hideZones = [
      document.getElementById("oferta"),
      document.getElementById("cta-final"),
    ].filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (hero) observer.observe(hero);

    const hideObserver = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        if (anyVisible) setVisible(false);
      },
      { threshold: 0.15 },
    );
    hideZones.forEach((el) => hideObserver.observe(el));

    return () => {
      observer.disconnect();
      hideObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          El ritual de 10 minutos, gratis esta noche
        </p>
        <Button
          size="lg"
          className="shrink-0 rounded-full px-6"
          render={<Link href="/onboarding">Empezar gratis</Link>}
          nativeButton={false}
        />
      </div>
    </div>
  );
}
