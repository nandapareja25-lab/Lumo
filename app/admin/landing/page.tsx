"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LANDING_SECTIONS, LandingAssetsMap } from "@/lib/landing-sections";

type Preview = { base64: string; prompt: string };

export default function AdminLandingPage() {
  const [assets, setAssets] = useState<LandingAssetsMap | null>(null);
  const [section, setSection] = useState(LANDING_SECTIONS[0].slug);
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshAssets() {
    const res = await fetch("/api/admin/landing-assets");
    const data = await res.json();
    setAssets(data.assets);
  }

  useEffect(() => {
    refreshAssets();
  }, []);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setBusy(true);
    setError(null);
    setPreview(null);

    const res = await fetch("/api/admin/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "Error generando la imagen");
      return;
    }
    setPreview({ base64: data.base64, prompt: data.prompt });
  }

  async function handleApprove() {
    if (!preview) return;
    setBusy(true);
    await fetch("/api/admin/landing-assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, base64: preview.base64, prompt: preview.prompt }),
    });
    setBusy(false);
    setPreview(null);
    setPrompt("");
    await refreshAssets();
  }

  async function handleRemove(slug: string) {
    setBusy(true);
    await fetch(`/api/admin/landing-assets?section=${slug}`, { method: "DELETE" });
    setBusy(false);
    await refreshAssets();
  }

  function handleDownload() {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${preview.base64}`;
    link.download = `${section}.png`;
    link.click();
  }

  return (
    <main className="min-h-dvh px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            Escenas de la landing
          </h1>
          <p className="text-sm text-muted-foreground">
            Escribe la escena, generá una vista previa, y aprobála para que se
            guarde de forma permanente y aparezca en la landing.
          </p>
        </div>

        <Card className="flex flex-col gap-4 border-border/60 bg-card p-5">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Sección
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as typeof section)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {LANDING_SECTIONS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Instrucción de la escena
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Ej: una madre y su hija escuchando una historia junto a Lumo, en un bosque cálido e iluminado."
              className="rounded-lg border border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          <p className="text-xs text-muted-foreground">
            La guía de estilo de Lumo (paleta, personaje, iluminación,
            prohibiciones) se agrega automáticamente antes de enviar esto a la
            API — no hace falta repetirla.
          </p>

          <Button onClick={handleGenerate} disabled={busy || !prompt.trim()}>
            {busy ? "Generando…" : "Generar vista previa"}
          </Button>

          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {preview && (
            <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${preview.base64}`}
                alt="Vista previa de la escena generada"
                className="w-full rounded-xl border border-border/60"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleApprove} disabled={busy}>
                  Aprobar y asignar a “{
                    LANDING_SECTIONS.find((s) => s.slug === section)?.label
                  }”
                </Button>
                <Button variant="outline" onClick={handleGenerate} disabled={busy}>
                  Regenerar
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  Descargar
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold">
            Escenas ya aprobadas
          </h2>
          {LANDING_SECTIONS.map(({ slug, label }) => {
            const asset = assets?.[slug];
            return (
              <Card
                key={slug}
                className="flex items-center gap-4 border-border/60 bg-card p-4"
              >
                {asset ? (
                  <Image
                    src={asset.url}
                    alt={label}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs text-muted-foreground">
                    Sin imagen
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset ? "Ilustración de Lumo (dibujada a mano)" : "Usando escena de respaldo"}
                  </p>
                </div>
                {asset && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleRemove(slug)}
                  >
                    Quitar
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
