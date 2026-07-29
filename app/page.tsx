"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Download, Users, Quote } from "lucide-react";
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
          background: #fff4d6;
          color: #b8912a;
          font-weight: 700;
          font-size: 12px;
          padding: 7px 14px;
          border-radius: 999px;
          margin: 20px 0 14px;
        }
        .btn-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(180deg, #f7c948, #f5a300);
          color: #2d2a26;
          font-weight: 700;
          font-size: 15px;
          padding: 15px 28px;
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
          color: var(--muted-foreground);
          line-height: 1.6;
          max-width: 340px;
          margin: 0 auto 24px;
        }
        .hero-art {
          position: relative;
          aspect-ratio: 1/1;
          max-width: 320px;
          margin: 0 auto 24px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
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
          background: #ffffff;
          border-radius: 20px;
          padding: 18px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feature-sq-card.full {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: center;
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
          aspect-ratio: 16/10;
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
        /* PURPLE BLOCK */
        .purple-block {
          margin: 40px 24px;
          border-radius: 28px;
          background: linear-gradient(160deg, #9b87f5, #7a63e8);
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
          background: var(--foreground);
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          padding: 36px 24px 30px;
          font-size: 13px;
        }
        .foot-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #ffffff;
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
          <Image src="/lumo-art/onboarding-bienvenida-v2.png" alt="Un niño sonriendo con un libro brillante de Lumo" fill sizes="320px" />
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
          <div className="icon-star mx-auto"><IconImg slug="icon-estrella" size={26} /></div>
          <h2>
            Todo lo que tu hijo necesita <span style={{ color: "#F5B800" }}>para crecer en fe</span>
          </h2>
        </div>
        <div className="features-sq-grid">
          <div className="feature-sq-card">
            <div className="feature-sq-icon" style={{ background: "#EFF6FF" }}>
              <IconImg slug="icon-libro" size={22} />
            </div>
            <h3>Historias de la Biblia</h3>
            <p>Relatos increíbles contados de forma divertida y educativa.</p>
          </div>
          <div className="feature-sq-card">
            <div className="feature-sq-icon" style={{ background: "#F3F0FF" }}>
              <IconImg slug="icon-nota-musical" size={22} />
            </div>
            <h3>Música y adoración</h3>
            <p>Canciones que enseñan y llenan su corazón de alegría.</p>
          </div>
          <div className="feature-sq-card">
            <div className="feature-sq-icon" style={{ background: "#FFF0F5" }}>
              <IconImg slug="icon-manitos-orando" size={22} />
            </div>
            <h3>Oraciones y rutinas</h3>
            <p>Momentos especiales para hablar con Dios cada día.</p>
          </div>
          <div className="feature-sq-card">
            <div className="feature-sq-icon" style={{ background: "#EEFBF1" }}>
              <IconImg slug="icon-paleta" size={22} />
            </div>
            <h3>Actividades y juegos</h3>
            <p>Juega, aprende y desarrolla valores mientras te diviertes.</p>
          </div>
          <div className="feature-sq-card full">
            <div className="feature-sq-icon" style={{ background: "#FFF4D6" }}>
              <IconImg slug="icon-estrella" size={22} />
            </div>
            <div>
              <h3>Acompañamiento diario</h3>
              <p>Lumo está siempre con ellos, guiándolos en su camino.</p>
            </div>
          </div>
        </div>

        <div className="social-card">
          <div className="art">
            <Image src="/lumo-art/landing-familia-tablet-transparente.png" alt="Una familia compartiendo un momento con Lumo" fill sizes="360px" />
          </div>
          <div className="social-card-copy">
            <p className="stat">
              Familias que ya <b>viven la aventura</b> con Lumo
            </p>
            <div className="avatar-stack">
              <div className="blob"><Image src="/lumo-art/familia-presencia-compartida.png" alt="" fill sizes="34px" /></div>
              <div className="blob"><Image src="/lumo-art/familia-leyendo-juntos.png" alt="" fill sizes="34px" /></div>
              <div className="blob"><Image src="/lumo-art/familia-manta-sofa.png" alt="" fill sizes="34px" /></div>
              <div className="blob"><Image src="/lumo-art/familia-arropar-cama.png" alt="" fill sizes="34px" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ASÍ ACOMPAÑA LUMO */}
      <section className="grow-section">
        <div className="section-head">
          <div className="icon-star mx-auto"><IconImg slug="icon-estrella" size={26} /></div>
          <h2>Así acompaña Lumo a tu familia</h2>
        </div>
        <div className="pill-list">
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#FFF0F0" }}>
              <IconImg slug="icon-corazon" size={22} />
            </div>
            <div>
              <h3>Contenido 100% seguro</h3>
              <p>Diseñado especialmente para niños.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#EFF6FF" }}>
              <IconImg slug="icon-nube" size={22} />
            </div>
            <div>
              <h3>Sin anuncios ni distracciones</h3>
              <p>Un espacio tranquilo para aprender y crecer.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#EEFBF1" }}>
              <IconImg slug="icon-escudo" size={22} />
            </div>
            <div>
              <h3>Hecho con amor y fe</h3>
              <p>Basado en valores cristianos para toda la familia.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#F3F0FF" }}>
              <Download className="h-5 w-5" style={{ color: "#9B87F5" }} />
            </div>
            <div>
              <h3>Para cada etapa</h3>
              <p>Contenido adaptado a la edad e intereses de tu hijo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PURPLE BLOCK — cada día */}
      <div className="purple-block">
        <div className="art-circle">
          <Image src="/lumo-art/landing-lumo-nube.png" alt="Lumo flotando sobre una nube" fill sizes="180px" />
        </div>
        <h3>Cada día es una nueva aventura con Lumo</h3>
        <p>Historias, música, oraciones y mucho más, todo en un solo lugar.</p>
      </div>

      {/* TESTIMONIOS */}
      <section className="grow-section">
        <div className="section-head">
          <div className="icon-star mx-auto"><IconImg slug="icon-estrella" size={26} /></div>
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

      {/* CTA MID */}
      <section className="cta-mid">
        <h2>¿Listo para comenzar esta aventura?</h2>
        <p>Únete a las familias que están creciendo en fe junto a Lumo.</p>
        <Link href={REGISTRO_HREF} className="btn-pill">
          Quiero conocer a Lumo <span>→</span>
        </Link>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="grow-section">
        <div className="section-head">
          <div className="icon-star mx-auto"><IconImg slug="icon-estrella" size={26} /></div>
          <h2>¿Cómo funciona?</h2>
        </div>
        <div className="pill-list">
          <div className="pill-card">
            <div className="pill-icon round" style={{ background: "#F3F0FF" }}>
              <Image src="/lumo-art/onboarding-para-quien-hija-v2.png" alt="" fill sizes="44px" />
            </div>
            <div>
              <span className="pill-num">1</span>
              <h3>Crea el perfil de tu hijo</h3>
              <p>Es rápido y fácil.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#EFF6FF" }}>
              <IconImg slug="icon-estrella" size={22} />
            </div>
            <div>
              <span className="pill-num">2</span>
              <h3>Personalizamos su experiencia</h3>
              <p>Según su edad e intereses.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#F3F0FF" }}>
              <IconImg slug="icon-nota-musical" size={22} />
            </div>
            <div>
              <span className="pill-num">3</span>
              <h3>Exploran juntos cada día</h3>
              <p>Historias, música, oraciones y más.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#FFF0F0" }}>
              <IconImg slug="icon-trofeo" size={22} />
            </div>
            <div>
              <span className="pill-num">4</span>
              <h3>Crece en valores y fe</h3>
              <p>Con diversión y contenido que deja huella.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PURPLE BLOCK — noche/oración */}
      <div className="purple-block night">
        <div className="art-circle">
          <Image src="/lumo-art/landing-nino-orando-noche.png" alt="Una niña orando junto a Lumo antes de dormir" fill sizes="180px" />
        </div>
      </div>

      {/* CONTENIDO CREADO CON AMOR */}
      <section className="grow-section">
        <div className="section-head">
          <div className="icon-star mx-auto"><IconImg slug="icon-corazon" size={26} /></div>
          <h2>Contenido creado con amor y propósito</h2>
        </div>
        <div className="pill-list">
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#F3F0FF" }}>
              <IconImg slug="icon-libro" size={22} />
            </div>
            <div>
              <h3>Alineado a la Biblia</h3>
              <p>Enseñanzas fieles y apropiadas para niños.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#FFF0F0" }}>
              <IconImg slug="icon-corazon" size={22} />
            </div>
            <div>
              <h3>Desarrollo emocional</h3>
              <p>Fortalece su corazón, su mente y su espíritu.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#EEFBF1" }}>
              <Users className="h-5 w-5" style={{ color: "#6BCB77" }} />
            </div>
            <div>
              <h3>Tiempo en familia</h3>
              <p>Momentos que conectan y dejan recuerdos.</p>
            </div>
          </div>
          <div className="pill-card">
            <div className="pill-icon" style={{ background: "#FFF4D6" }}>
              <IconImg slug="icon-destello-amarillo" size={22} />
            </div>
            <div>
              <h3>Actualizado constantemente</h3>
              <p>Nuevo contenido cada semana para seguir aprendiendo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="grow-section">
        <div className="section-head">
          <h2>Para familias reales.</h2>
        </div>
        <div style={{ background: "var(--foreground)", borderRadius: 28, margin: "0 24px", padding: "32px 20px" }}>
          <LandingPricing />
        </div>
      </section>

      {/* PURPLE BLOCK FINAL */}
      <div className="purple-block">
        <div className="art-circle">
          <Image src="/lumo-art/landing-lumo-nino-saltando-v2.png" alt="Un niño y Lumo saltando de alegría" fill sizes="180px" />
        </div>
        <h3>
          Lumo está aquí para acompañarlos siempre <span style={{ color: "#FFD740" }}>✨</span>
        </h3>
        <p>Historias que iluminan hoy, valores que guían para siempre.</p>
        <Link href={REGISTRO_HREF} className="btn-pill">
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
