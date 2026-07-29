"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Quote } from "lucide-react";
import { LandingPricing } from "@/components/app/landing-pricing";

const REGISTRO_HREF = "/onboarding";

/** Ícono real 3D del usuario (Desktop/IMAGENES, 2026-07-28) — reemplaza los íconos de línea de
 * lucide-react en toda la landing para que coincida con la referencia exacta pedida. */
function IconImg({ slug, size = 22 }: { slug: string; size?: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <Image src={`/lumo-art/${slug}.png`} alt="" fill sizes={`${size}px`} className="object-contain" />
    </span>
  );
}

/**
 * Landing v3 (rebrand "Estrella", 2026-07-28) — reconstrucción completa para matchear
 * exactamente la referencia del usuario: fondo claro de principio a fin (nunca secciones
 * oscuras de pantalla completa), grid de features con cards cuadradas, bloques morados con
 * Lumo sobre una nube, pasos numerados horizontales, y un cierre nocturno con un niño orando.
 * Reemplaza por completo la landing v2 (arco día cansado → noche → mañana con secciones
 * --forest oscuras) — ya no aplica esa estructura.
 *
 * Testimonios: la app todavía no tiene reseñas reales de familias — el texto/nombre de acá es
 * contenido de MUESTRA para completar el layout pedido, no una reseña real. Reemplazar antes
 * de publicar de verdad (decisión conversada con el usuario, 2026-07-28).
 */
export default function LandingPage() {
  return (
    <div className="landing">
      <style jsx global>{`
        .landing {
          font-family: var(--font-sans);
          color: var(--foreground);
          background: var(--background);
          overflow-x: hidden;
        }
        .landing h1,
        .landing h2,
        .landing h3,
        .landing .display,
        .landing .btn-pill {
          font-family: var(--font-heading);
        }
        .landing h1,
        .landing h2 {
          color: var(--heading);
        }
        .landing .l-logo {
          background: linear-gradient(180deg, #F7C948, #F5A300);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .l-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 0;
        }
        .l-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 20px;
        }
        .l-menu-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: var(--shadow-card);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EDE9FB;
          color: #7C5CFC;
          font-weight: 700;
          font-size: 12px;
          padding: 7px 14px;
          border-radius: 999px;
          margin: 20px 0 14px;
        }
        .btn-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(180deg, #f7c948, #f5a300);
          color: #2d2a26;
          font-weight: 700;
          font-size: 15px;
          padding: 16px 44px;
          min-width: 260px;
          border-radius: 999px;
          box-shadow: var(--shadow-button);
          border: none;
          cursor: pointer;
        }
        .microcopy {
          margin-top: 12px;
          font-size: 12px;
          color: var(--muted-foreground);
        }
        .trust-badges {
          display: flex;
          gap: 18px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--muted-foreground);
        }
        /* HERO */
        .hero {
          padding: 0 24px 40px;
          text-align: center;
        }
        .hero h1 {
          font-size: clamp(30px, 8vw, 40px);
          line-height: 1.15;
          font-weight: 800;
          margin: 0 0 14px;
        }
        .hero h1 em {
          font-style: normal;
          color: var(--primary);
        }
        .hero p.lead {
          font-size: 15px;
          color: var(--heading);
          line-height: 1.6;
          max-width: 340px;
          margin: 0 auto 24px;
        }
        .hero-art {
          position: relative;
          aspect-ratio: 4/5;
          max-width: 340px;
          margin: 0 auto 24px;
        }
        .hero-art .cloud {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          filter: blur(1px);
        }
        .hero-art .sparkle {
          position: absolute;
          color: #F5B800;
        }
        .hero-art img {
          object-fit: contain;
        }
        .hero-cta-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* SECTION HEAD */
        .section-head {
          text-align: center;
          padding: 0 24px;
          margin-bottom: 28px;
        }
        .section-head .icon-star {
          margin-bottom: 8px;
        }
        .section-head h2 {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.3;
        }
        /* FEATURES GRID (cuadradas) */
        .grow-section {
          padding: 48px 0;
        }
        .features-sq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 0 24px;
        }
        .feature-sq-card {
          border-radius: 22px;
          padding: 22px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }
        .feature-sq-card h3 {
          margin-top: 4px;
        }
        .feature-sq-card.full {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: center;
          text-align: left;
          gap: 16px;
        }
        .feature-sq-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-sq-card h3 {
          font-size: 14.5px;
          font-weight: 700;
          margin: 0;
        }
        .feature-sq-card p {
          font-size: 12.5px;
          color: var(--muted-foreground);
          line-height: 1.45;
          margin: 0;
        }
        /* SOCIAL PROOF CARD */
        .social-card {
          margin: 40px 24px 0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .social-card .art {
          position: relative;
          aspect-ratio: 1/1;
        }
        .social-card .art img {
          object-fit: cover;
          object-position: center 30%;
        }
        .social-card-copy {
          background: #ffffff;
          padding: 18px 20px 22px;
          text-align: center;
        }
        .social-card-copy p.stat {
          font-size: 15px;
          font-weight: 700;
        }
        .social-card-copy p.stat b {
          color: var(--primary);
        }
        .avatar-stack {
          display: flex;
          justify-content: center;
          margin: 12px 0 6px;
        }
        .avatar-stack .blob {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #fff;
          margin-left: -10px;
          overflow: hidden;
          position: relative;
        }
        .avatar-stack .blob:first-child {
          margin-left: 0;
        }
        .stars-row {
          display: flex;
          justify-content: center;
          gap: 2px;
          margin-top: 4px;
        }
        /* PILL LIST (horizontal cards) */
        .pill-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0 24px;
        }
        .pill-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff;
          border-radius: 18px;
          padding: 14px 16px;
          box-shadow: var(--shadow-card);
        }
        .pill-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pill-icon.round {
          border-radius: 50%;
          overflow: hidden;
          position: relative;
        }
        .pill-card h3 {
          font-size: 14px;
          font-weight: 700;
          margin: 0;
        }
        .pill-card p {
          font-size: 12px;
          color: var(--muted-foreground);
          margin: 2px 0 0;
          line-height: 1.4;
        }
        .pill-num {
          font-weight: 800;
          font-size: 13px;
          color: var(--muted-foreground);
        }
        .pill-num-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          flex-shrink: 0;
        }
        /* PURPLE BLOCK */
        .purple-block {
          margin: 40px 24px;
          border-radius: 28px;
          background: linear-gradient(160deg, #B9A8F7, #9E8EEA);
          padding: 44px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          text-align: center;
        }
        .purple-block.night {
          background: linear-gradient(160deg, #2c2a4a, #1a1836);
        }
        .purple-block .art-circle {
          position: relative;
          width: 180px;
          height: 180px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.4);
        }
        .purple-block h3 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 21px;
          color: #ffffff;
          max-width: 300px;
          line-height: 1.35;
        }
        .purple-block p {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.78);
          max-width: 280px;
          line-height: 1.5;
        }
        /* TESTIMONIAL */
        .testimonial-card {
          margin: 0 24px;
          background: #ffffff;
          border-radius: 22px;
          padding: 22px;
          box-shadow: var(--shadow-card);
        }
        .testimonial-card .quote-icon {
          color: var(--primary);
          margin-bottom: 8px;
        }
        .testimonial-card p.text {
          font-size: 15px;
          line-height: 1.55;
          font-weight: 600;
        }
        .testimonial-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
        }
        .testimonial-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .testimonial-name {
          font-size: 13px;
          font-weight: 700;
        }
        /* CTA MID */
        .cta-mid {
          padding: 48px 24px;
          text-align: center;
        }
        .cta-mid h2 {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .cta-mid p {
          font-size: 14px;
          color: var(--muted-foreground);
          max-width: 300px;
          margin: 0 auto 22px;
        }
        /* FOOTER */
        footer {
          background: var(--background);
          color: var(--muted-foreground);
          text-align: center;
          padding: 36px 24px 30px;
          font-size: 13px;
          border-top: 1px solid var(--border);
        }
        .foot-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--heading);
          font-weight: 700;
          font-size: 16px;
        }
        @media (min-width: 860px) {
          .features-sq-grid {
            max-width: 720px;
            margin: 0 auto;
          }
          .pill-list {
            max-width: 620px;
            margin: 0 auto;
          }
          .hero-art {
            max-width: 380px;
          }
        }
      `}</style>

      <header className="l-header">
        <div className="l-logo">
          <IconImg slug="icon-estrella" size={20} />
          Lumo
        </div>
        <button className="l-menu-btn" aria-label="Menú">
          <Menu className="h-4.5 w-4.5" style={{ color: "#2D2A26" }} />
        </button>
      </header>

      {/* HERO */}
      <section className="hero">
        <span className="eyebrow-pill">✨ La Biblia para niños de hoy</span>
        <h1>
          Historias que <em>iluminan</em> su corazón
        </h1>
        <p className="lead">
          Lumo convierte la Palabra de Dios en aventuras mágicas que enseñan, inspiran y
          acompañan a tus hijos todos los días.
        </p>
        <div className="hero-art">
          <div className="absolute bottom-0 right-0 h-[55%] w-[65%]">
            <Image src="/lumo-art/landing-arcoiris.png" alt="" fill sizes="220px" className="object-contain" />
          </div>
          <Image
            src="/lumo-art/onboarding-bienvenida-v2.png"
            alt="Un niño sonriendo con un libro brillante de Lumo"
            fill
            sizes="340px"
            className="relative"
          />
        </div>
        <div className="hero-cta-wrap">
          <Link href={REGISTRO_HREF} className="btn-pill">
            Conoce a Lumo <span>→</span>
          </Link>
          <div className="trust-badges">
            <span className="trust-badge">🔒 100% seguro</span>
            <span className="trust-badge">🚫 Sin anuncios</span>
          </div>
        </div>
      </section>

      {/* TODO LO QUE TU HIJO NECESITA */}
      <section className="grow-section">
        <div className="section-head">
          <div className="icon-star mx-auto"><IconImg slug="icon-estrella" size={40} /></div>
          <h2>
            Todo lo que tu hijo <span className="block">necesita <span style={{ color: "#7C5CFC" }}>para crecer en fe</span></span>
          </h2>
        </div>
        <div className="features-sq-grid">
          <div className="feature-sq-card" style={{ background: "#FDF3D6" }}>
            <IconImg slug="icon-libro" size={64} />
            <h3>Historias de la Biblia</h3>
            <p>Relatos increíbles contados de forma divertida y educativa.</p>
          </div>
          <div className="feature-sq-card" style={{ background: "#F1EAFC" }}>
            <IconImg slug="icon-nota-musical" size={64} />
            <h3>Música y adoración</h3>
            <p>Canciones que enseñan y llenan su corazón de alegría.</p>
          </div>
          <div className="feature-sq-card" style={{ background: "#E3F5E6" }}>
            <IconImg slug="icon-manitos-orando" size={64} />
            <h3>Oraciones y rutinas</h3>
            <p>Momentos especiales para hablar con Dios cada día.</p>
          </div>
          <div className="feature-sq-card" style={{ background: "#E3F0FC" }}>
            <IconImg slug="icon-paleta" size={64} />
            <h3>Actividades y juegos</h3>
            <p>Juega, aprende y desarrolla valores mientras te diviertes.</p>
          </div>
          <div className="feature-sq-card full" style={{ background: "#FCE8ED" }}>
            <IconImg slug="icon-estrella" size={56} />
            <div>
              <h3>Acompañamiento diario</h3>
              <p>Lumo está siempre con ellos, guiándolos en su camino.</p>
            </div>
          </div>
        </div>

        <div className="social-card">
          <div className="art">
            <Image src="/lumo-art/landing-familia-tablet-v2.png" alt="Una familia compartiendo un momento con Lumo" fill sizes="360px" />
          </div>
          <div className="social-card-copy">
            <p className="stat">
              Familias que ya <b style={{ color: "var(--primary)" }}>viven la aventura</b>
              <br />
              con Lumo
            </p>
          </div>
        </div>
      </section>

      {/* BLOQUE 2 — imagen completa provista por el usuario, fondo crema a pantalla completa (mismo fondo que la app) */}
      <Image src="/lumo-art/bloque-2-asi-acompana.png" alt="Así acompaña Lumo a tu familia — contenido 100% seguro, sin anuncios, hecho con amor y fe, para cada etapa." width={925} height={1701} sizes="375px" className="w-full h-auto block" />

      {/* BLOQUE 5 — imagen completa provista por el usuario, tarjeta morada con su propio redondeado */}
      <div style={{ margin: "40px 24px" }}>
        <Image src="/lumo-art/bloque-5-cada-dia.png" alt="Cada día es una nueva aventura con Lumo — historias, música, oraciones y mucho más, todo en un solo lugar." width={1024} height={1536} sizes="340px" className="w-full h-auto block" />
      </div>

      {/* TESTIMONIOS */}
      <section className="grow-section">
        <div className="section-head">
          <div className="icon-star mx-auto"><IconImg slug="icon-estrella" size={40} /></div>
          <h2>Lo que dicen otras familias</h2>
        </div>
        {/* Contenido de muestra — todavía no hay reseñas reales, reemplazar antes de publicar. */}
        <div className="testimonial-card">
          <Quote className="quote-icon h-6 w-6" fill="#F5B800" />
          <p className="text">
            A mi hijo le encanta Lumo. Aprende, se divierte y ahora quiere escuchar su
            historia bíblica todos los días.
          </p>
          <div className="testimonial-footer">
            <div className="testimonial-avatar">
              <Image src="/lumo-art/landing-avatar-mama.png" alt="" fill sizes="40px" />
            </div>
            <div>
              <p className="testimonial-name">Una mamá de familia Lumo</p>
              <div className="stars-row">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconImg key={i} slug="icon-estrella" size={16} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 7 — imagen completa provista por el usuario, tarjeta con su propio redondeado, envuelta en link funcional */}
      <Link href={REGISTRO_HREF} style={{ display: "block", margin: "40px 24px" }}>
        <Image src="/lumo-art/bloque-7-listo-para-comenzar.png" alt="¿Listo para comenzar esta aventura? Únete a miles de familias que están creciendo en fe junto a Lumo." width={941} height={1672} sizes="340px" className="w-full h-auto block" />
      </Link>

      {/* BLOQUE 3 — imagen completa provista por el usuario, fondo crema a pantalla completa */}
      <Image src="/lumo-art/bloque-3-como-funciona.png" alt="¿Cómo funciona? Crea el perfil de tu hijo, personalizamos su experiencia, exploran juntos cada día, crece en valores y fe." width={863} height={1823} sizes="375px" className="w-full h-auto block" />

      {/* BLOQUE 10 — imagen completa provista por el usuario, fondo lavanda a pantalla completa */}
      <Image src="/lumo-art/bloque-10-momento-especial.png" alt="Termina el día en paz junto a Lumo — oraciones y afirmaciones para agradecer, soltar preocupaciones y dormir con el corazón tranquilo." width={1024} height={1536} sizes="375px" className="w-full h-auto block" />

      {/* BLOQUE 8 — imagen completa provista por el usuario, fondo crema a pantalla completa */}
      <Image src="/lumo-art/bloque-8-contenido-con-amor.png" alt="Contenido creado con amor y propósito — alineado a la Biblia, desarrollo emocional, tiempo en familia, actualizado constantemente." width={941} height={1672} sizes="375px" className="w-full h-auto block" />

      {/* PRICING */}
      <section className="grow-section">
        <div className="section-head">
          <h2>Para familias reales.</h2>
        </div>
        <div style={{ margin: "0 24px" }}>
          <LandingPricing />
        </div>
      </section>

      {/* BLOQUE 9 — imagen completa provista por el usuario, con CTA funcional superpuesto */}
      <div style={{ position: "relative", margin: "40px 24px", aspectRatio: "1024/1536" }}>
        <Image src="/lumo-art/bloque-9-cierre-final.png" alt="Lumo está aquí para acompañarlos siempre. Historias que iluminan hoy, valores que guían para siempre." fill sizes="340px" className="object-contain" />
        <Link
          href={REGISTRO_HREF}
          className="btn-pill"
          style={{ position: "absolute", left: "50%", bottom: "8%", transform: "translateX(-50%)" }}
        >
          Crear mi plan gratis
        </Link>
      </div>

      <footer>
        <div className="foot-logo">
          <IconImg slug="icon-estrella" size={16} />
          Lumo
        </div>
        Lumo no vende contenido. Lumo protege un momento.
      </footer>
    </div>
  );
}
