import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";

/** Nunito para cuerpo de texto (CLAUDE.md §9.3). Fredoka para títulos — la misma pareja que ya
 * usa la landing (app/page.tsx), extendida acá para que toda la app hable el mismo idioma
 * tipográfico (APP-REDISENO-INSTRUCCIONES.md §1, 2026-07-24). Antes `--font-heading` apuntaba
 * también a Nunito, así que los títulos de Inicio/Explorar/Mi camino no coincidían con la landing. */
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
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-[#FAF3EE] text-foreground">
        <div className="relative z-10 flex min-h-dvh flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
