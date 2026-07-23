import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AmbientBackground } from "@/components/app/ambient-background";
import "./globals.css";

/** Tipografía única sans-serif redondeada para toda la app (CLAUDE.md §9.3) — reemplaza a
 * Fraunces/Karla (serif + humanista), vigentes hasta el 2026-07-22. Misma familia para
 * heading y body, distintos pesos, para que "hable el mismo idioma" que el border-radius. */
const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col text-foreground">
        <AmbientBackground />
        <div className="relative z-10 flex min-h-dvh flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
