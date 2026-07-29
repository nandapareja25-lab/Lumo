import type { Metadata } from "next";
import { Nunito, Fredoka, Baloo_2 } from "next/font/google";
import "./globals.css";

/** Baloo 2 es la fuente principal (lumo-design-tokens.json, 2026-07-28) — Fredoka/Nunito quedan
 * como fallback real en la cadena font-family, no se eliminan (siguen usándose en algunos
 * componentes ya integrados). Nunito para cuerpo de texto donde Baloo 2 no aplique. */
const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lumo — un momento espiritual para tu familia",
  description:
    "Cada noche: una historia bíblica, una conversación, una oración y un diario espiritual que crece con tu familia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${fredoka.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <div className="relative z-10 flex min-h-dvh flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
