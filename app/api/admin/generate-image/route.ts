import { NextRequest, NextResponse } from "next/server";
import { buildLumoPrompt } from "@/lib/lumo-style-guide";

/**
 * Genera una PREVIEW (no la guarda todavía — eso pasa en /api/admin/landing-assets al aprobar).
 * Protegido por middleware.ts (solo /admin autenticado llega hasta acá).
 */
export async function POST(request: NextRequest) {
  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ error: "Falta el prompt de la escena" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta OPENAI_API_KEY en el servidor. Pídesela al dueño de la cuenta de OpenAI y agrégala a .env.local — sin eso el botón Generar no puede llamar a la API real (ver ESTADO.md).",
      },
      { status: 501 },
    );
  }

  const fullPrompt = buildLumoPrompt(prompt);

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json(
      { error: `OpenAI Images API respondió con error: ${detail}` },
      { status: 502 },
    );
  }

  const data = await response.json();
  const base64: string | undefined = data?.data?.[0]?.b64_json;

  if (!base64) {
    return NextResponse.json(
      { error: "La API no devolvió una imagen (b64_json vacío)" },
      { status: 502 },
    );
  }

  return NextResponse.json({ base64, prompt: fullPrompt });
}
