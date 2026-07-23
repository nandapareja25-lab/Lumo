import { NextRequest, NextResponse } from "next/server";
import {
  LANDING_SECTIONS,
  LandingSectionSlug,
  clearAsset,
  readAssets,
  saveApprovedImage,
  saveAsset,
} from "@/lib/landing-assets";

function isValidSection(slug: string): slug is LandingSectionSlug {
  return LANDING_SECTIONS.some((section) => section.slug === slug);
}

export async function GET() {
  const assets = await readAssets();
  return NextResponse.json({ assets, sections: LANDING_SECTIONS });
}

/** Aprobar: recibe el base64 ya generado y lo guarda de forma permanente + lo asigna a una sección. */
export async function POST(request: NextRequest) {
  const { section, base64, prompt } = (await request.json()) as {
    section?: string;
    base64?: string;
    prompt?: string;
  };

  if (!section || !isValidSection(section)) {
    return NextResponse.json({ error: "Sección inválida" }, { status: 400 });
  }
  if (!base64 || !prompt) {
    return NextResponse.json(
      { error: "Falta la imagen o el prompt a guardar" },
      { status: 400 },
    );
  }

  const url = await saveApprovedImage(section, base64);
  await saveAsset(section, { url, prompt, approvedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true, url });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (!section || !isValidSection(section)) {
    return NextResponse.json({ error: "Sección inválida" }, { status: 400 });
  }

  await clearAsset(section);
  return NextResponse.json({ ok: true });
}
