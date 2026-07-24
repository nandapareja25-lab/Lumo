"use client";

import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import { LandingPricing } from "@/components/app/landing-pricing";
import { ChromaKeyVideo } from "@/components/app/chroma-key-video";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka" });

const REGISTRO_HREF = "/onboarding";

/**
 * Landing v2 (2026-07-24) — paleta propia basada en el color de Lumo (verde bosque + dorado de
 * su brillo, CLAUDE.md §5.0), no la crema/dorado de la app interior. Alterna secciones --cream
 * (contenido racional: problema, pasos, historias, valor, FAQ) y --forest (contenido emocional:
 * quote breaks, comparación, testimonio, pricing, cierre) — encierra el arco día cansado → noche
 * de historia y oración → mañana siguiente. No toca CLAUDE.md, el sistema de personajes ni
 * generate-lumo-image.ts.
 *
 * Las 5 fotos de familia (public/lumo-art/familia-*.png) se regeneraron el 2026-07-24 con el
 * Master Block de LANDING-IMAGENES-PROMPTS.md, sobrescribiendo los mismos archivos. Si tu
 * navegador todavía muestra la versión vieja, es caché local (confirmado: el servidor ya sirve
 * el archivo nuevo) — recargar forzado (Ctrl/Cmd+Shift+R) lo resuelve, sin tocar código.
 */
export default function LandingPage() {
  return (
    <div className={fredoka.variable}>
      <style jsx global>{`
        .landing {
          font-family: var(--font-sans, "Nunito", sans-serif);
          color: var(--l-ink);
          background: var(--l-cream);
          overflow-x: hidden;
        }
        .landing {
          --l-cream: #fbf5ec;
          --l-cream-line: #ecdfcd;
          --l-ink: #1c1712;
          --l-ink-soft: #6b5d4f;
          --l-ink-faint: #a3927f;
          --l-forest: #132018;
          --l-forest-deep: #0a140f;
          --l-forest-mid: #1c2e23;
          --l-gold: #ffd740;
          --l-gold-soft: #f7c35c;
          --l-gold-deep: #b9860f;
          --l-on-forest: #f2ecdf;
          --l-on-forest-soft: rgba(242, 236, 223, 0.66);
        }
        .landing h1,
        .landing h2,
        .landing h3,
        .landing .display,
        .landing .btn-pill {
          font-family: var(--font-fredoka), sans-serif;
        }
        .eyebrow {
          font-family: var(--font-fredoka), sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--l-gold-deep);
        }
        .eyebrow.on-forest {
          color: var(--l-gold);
        }
        .blob {
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .blob img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blob-a {
          border-radius: 44% 56% 68% 32% / 46% 40% 60% 54%;
        }
        .blob-b {
          border-radius: 58% 42% 38% 62% / 55% 62% 38% 45%;
        }
        .blob-c {
          border-radius: 38% 62% 55% 45% / 62% 44% 56% 38%;
        }
        .glow-behind {
          position: relative;
        }
        .glow-behind::before {
          content: "";
          position: absolute;
          inset: -14%;
          z-index: 0;
          background: radial-gradient(circle, rgba(255, 215, 64, 0.5) 0%, rgba(255, 215, 64, 0.12) 45%, transparent 72%);
          filter: blur(4px);
        }
        header {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 24px 24px 0;
        }
        .logo-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #fff6d0, var(--l-gold) 55%, var(--l-gold-deep) 100%);
          box-shadow: 0 0 9px 2px rgba(255, 215, 64, 0.65);
        }
        .logo-word {
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: var(--l-cream);
        }
        header.on-cream .logo-word {
          color: var(--l-ink);
        }
        /* HERO */
        .hero {
          background: var(--l-forest);
          position: relative;
          overflow: hidden;
        }
        .hero-grid {
          display: flex;
          flex-direction: column;
          gap: 36px;
          padding: 20px 24px 56px;
        }
        .hero-copy h1 {
          font-size: clamp(32px, 8vw, 44px);
          line-height: 1.1;
          color: var(--l-on-forest);
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 16px 0 18px;
        }
        .hero-copy h1 em {
          font-style: normal;
          color: var(--l-gold);
        }
        .hero-copy p {
          font-size: 16px;
          color: var(--l-on-forest-soft);
          line-height: 1.55;
          margin-bottom: 26px;
        }
        .btn-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ffd740, #f7c35c);
          color: #3a2705;
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 15px 28px;
          border-radius: 50px;
          box-shadow: 0 10px 26px rgba(255, 215, 64, 0.25);
          border: none;
          cursor: pointer;
        }
        .microcopy {
          margin-top: 14px;
          font-size: 12px;
          color: var(--l-on-forest-soft);
        }
        .hero-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
        }
        .hero-img-wrap .blob {
          position: absolute;
          inset: 6%;
        }
        /* DAY / PROBLEM */
        .day-section {
          padding: 64px 24px 56px;
          background: var(--l-cream);
        }
        .day-section h2 {
          font-size: clamp(22px, 6vw, 28px);
          margin: 12px 0 36px;
          font-weight: 600;
        }
        .plain-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 18px 0;
          border-bottom: 1px solid var(--l-cream-line);
        }
        .plain-item:first-child {
          padding-top: 0;
        }
        .plain-item .idx {
          flex: none;
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          color: var(--l-gold-deep);
          font-size: 14px;
          width: 24px;
        }
        .plain-item p {
          font-size: 17px;
          line-height: 1.5;
          color: var(--l-ink);
        }
        /* BREAK */
        .break {
          background: var(--l-forest-mid);
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          text-align: center;
        }
        .break .blob {
          width: 180px;
          height: 180px;
        }
        .break p {
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          font-size: 21px;
          color: var(--l-on-forest);
          max-width: 340px;
          line-height: 1.4;
        }
        /* STEPS */
        .steps-section {
          padding: 64px 24px;
          background: var(--l-cream);
          text-align: center;
        }
        .steps-section h2 {
          font-size: 24px;
          margin-bottom: 40px;
          font-weight: 600;
        }
        .steps {
          display: flex;
          flex-direction: column;
          gap: 28px;
          align-items: center;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 170px;
          position: relative;
        }
        .step .blob {
          width: 96px;
          height: 96px;
        }
        .step .num {
          position: absolute;
          top: -6px;
          right: 30px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: var(--l-forest);
          color: var(--l-gold);
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .step span {
          font-size: 14px;
          color: var(--l-ink-soft);
          font-weight: 700;
          line-height: 1.35;
          max-width: 150px;
        }
        /* STORIES */
        .stories-section {
          padding: 64px 24px;
          background: var(--l-cream);
        }
        .stories-head {
          text-align: center;
          margin: 0 auto 36px;
        }
        .stories-head h2 {
          font-size: 24px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .stories-head p {
          color: var(--l-ink-soft);
          font-size: 14px;
        }
        .story-grid {
          display: flex;
          gap: 3vw;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .story-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          width: 42vw;
          max-width: 220px;
          flex: none;
        }
        .story-card .blob {
          width: 100%;
          aspect-ratio: 1/1;
        }
        .story-card .tag {
          font-family: var(--font-fredoka), sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--l-gold-deep);
        }
        .story-card h3 {
          font-size: 16px;
          color: var(--l-ink);
          margin-top: 2px;
          font-weight: 600;
        }
        /* COMPARE */
        .compare-section {
          padding: 56px 24px;
          background: var(--l-forest);
          color: var(--l-on-forest);
        }
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .compare-col h3 {
          font-family: var(--font-fredoka), sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .compare-col.before h3 {
          color: rgba(242, 236, 223, 0.4);
        }
        .compare-col.after h3 {
          color: var(--l-gold);
        }
        .compare-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0;
          margin: 0;
        }
        .compare-col.before li {
          color: rgba(242, 236, 223, 0.5);
          font-size: 14px;
        }
        .compare-col.after li {
          color: var(--l-on-forest);
          font-size: 14px;
          font-weight: 700;
        }
        /* VALUE */
        .value-section {
          padding: 64px 24px;
          background: var(--l-cream);
        }
        .value-inner {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .value-inner .blob {
          aspect-ratio: 4/3;
        }
        .value-section h2 {
          font-size: 24px;
          margin-bottom: 22px;
          line-height: 1.3;
          font-weight: 600;
        }
        .value-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .value-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .value-item .dot {
          flex: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 8px;
          background: var(--l-gold-deep);
        }
        .value-item p {
          font-size: 15.5px;
          color: var(--l-ink);
          margin: 0;
        }
        /* PRICING */
        .pricing-section {
          padding: 64px 24px;
          background: var(--l-forest);
          color: var(--l-on-forest);
        }
        .pricing-section .eyebrow {
          text-align: center;
          display: block;
          margin-bottom: 10px;
        }
        .pricing-section h2 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 36px;
          font-weight: 600;
        }
        /* FAQ */
        .faq-section {
          padding: 64px 24px;
          background: var(--l-cream);
        }
        .faq-section .eyebrow {
          text-align: center;
          display: block;
          margin-bottom: 10px;
        }
        .faq-section h2 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 32px;
          font-weight: 600;
        }
        .faq-list {
          max-width: 560px;
          margin: 0 auto;
        }
        .faq-item {
          border-bottom: 1px solid var(--l-cream-line);
          padding: 18px 0;
        }
        .faq-item summary {
          cursor: pointer;
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          font-size: 16px;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--l-ink);
        }
        .faq-item summary::-webkit-details-marker {
          display: none;
        }
        .faq-item summary::after {
          content: "+";
          font-size: 20px;
          color: var(--l-gold-deep);
          font-weight: 400;
        }
        .faq-item[open] summary::after {
          content: "–";
        }
        .faq-item p {
          margin-top: 12px;
          font-size: 14px;
          color: var(--l-ink-soft);
          line-height: 1.6;
        }
        /* CLOSING */
        .closing {
          background: var(--l-forest);
          padding: 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 26px;
          position: relative;
          overflow: hidden;
        }
        /* LUMO VOLANDO */
        .lumo-firefly {
          position: absolute;
          left: 0;
          top: 0;
          width: 70px;
          height: 88px;
          z-index: 15;
          pointer-events: none;
          filter: drop-shadow(0 0 6px rgba(255, 215, 64, 0.35));
          animation: lumo-glow-pulse 1.8s ease-in-out infinite;
        }
        @keyframes lumo-glow-pulse {
          0%,
          100% {
            filter: drop-shadow(0 0 6px rgba(255, 215, 64, 0.35));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(255, 215, 64, 0.65));
          }
        }
        .lumo-firefly.hero-patrol {
          animation:
            lumo-glow-pulse 1.8s ease-in-out infinite,
            lumo-patrol-hero 18s ease-in-out infinite;
        }
        @keyframes lumo-patrol-hero {
          0% {
            transform: translate(56vw, 58vh) rotate(-6deg);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          20% {
            transform: translate(70vw, 36vh) rotate(10deg);
          }
          38% {
            transform: translate(50vw, 50vh) rotate(-12deg);
          }
          55% {
            transform: translate(74vw, 64vh) rotate(6deg);
          }
          72% {
            transform: translate(58vw, 40vh) rotate(-4deg);
          }
          90% {
            transform: translate(66vw, 55vh) rotate(4deg);
            opacity: 1;
          }
          100% {
            transform: translate(56vw, 58vh) rotate(-6deg);
            opacity: 0;
          }
        }
        .lumo-firefly.closing-patrol {
          animation:
            lumo-glow-pulse 1.8s ease-in-out infinite,
            lumo-patrol-closing 12s ease-in-out infinite;
        }
        @keyframes lumo-patrol-closing {
          0% {
            transform: translate(20vw, -10vh) rotate(-8deg) scale(0.9);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          35% {
            transform: translate(38vw, 4vh) rotate(6deg) scale(0.9);
          }
          60% {
            transform: translate(28vw, -6vh) rotate(-10deg) scale(0.9);
          }
          85% {
            transform: translate(34vw, 2vh) rotate(4deg) scale(0.9);
            opacity: 1;
          }
          100% {
            transform: translate(20vw, -10vh) rotate(-8deg) scale(0.9);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lumo-firefly {
            animation: none !important;
          }
        }
        @media (max-width: 640px) {
          .lumo-firefly {
            width: 52px;
            height: 65px;
          }
        }
        .closing .blob {
          width: 170px;
          height: 170px;
        }
        .closing p.lead {
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          font-size: 22px;
          line-height: 1.5;
          color: var(--l-on-forest);
          max-width: 320px;
        }
        .closing p.lead em {
          font-style: normal;
          color: var(--l-gold);
        }
        footer {
          background: var(--l-forest-deep);
          color: rgba(242, 236, 223, 0.5);
          text-align: center;
          padding: 40px 24px 32px;
          font-size: 13px;
        }
        .foot-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-bottom: 14px;
        }
        .foot-logo span {
          font-family: var(--font-fredoka), sans-serif;
          font-weight: 600;
          color: var(--l-on-forest);
          font-size: 16px;
        }
        @media (min-width: 860px) {
          .hero-grid {
            flex-direction: row;
            align-items: center;
            max-width: 1180px;
            margin: 0 auto;
            padding: 40px 40px 80px;
          }
          .hero-copy,
          .hero-img-wrap {
            flex: 1;
          }
          .value-inner {
            flex-direction: row;
            align-items: center;
            max-width: 960px;
            margin: 0 auto;
          }
          .value-inner > div {
            flex: 1;
          }
          .steps {
            flex-direction: row;
            justify-content: center;
            max-width: 680px;
            margin: 0 auto;
            position: relative;
          }
          .step-connector {
            flex: 1;
            height: 2px;
            background: repeating-linear-gradient(to right, var(--l-gold-deep) 0 6px, transparent 6px 12px);
            margin-top: 48px;
            align-self: flex-start;
          }
          .story-card {
            width: auto;
          }
          .story-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            max-width: 920px;
            margin: 0 auto;
            overflow: visible;
          }
        }
      `}</style>

      <div className="landing">
        <section className="hero">
          <ChromaKeyVideo src="/video/lumo-flying-1.mp4" className="lumo-firefly hero-patrol" />
          <header>
            <div className="logo-dot" />
            <div className="logo-word">Lumo</div>
          </header>
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow on-forest">Momentos que conectan</div>
              <h1>
                Pequeños momentos.
                <br />
                <em>Grandes recuerdos.</em>
              </h1>
              <p>Historias y oración para terminar el día en paz, juntos.</p>
              <Link href={REGISTRO_HREF} className="btn-pill">
                Comenzar gratis
              </Link>
              <div className="microcopy">Una historia nueva cada día, gratis por 7 días · Premium desbloquea todas las historias</div>
            </div>
            <div className="hero-img-wrap glow-behind">
              <div className="blob blob-a">
                <Image src="/lumo-art/familia-presencia-compartida.png" alt="Una madre y su hija conversando" fill sizes="(max-width: 860px) 90vw, 500px" />
              </div>
            </div>
          </div>
        </section>

        <section className="day-section">
          <div className="eyebrow">Lo de siempre</div>
          <h2>Todos los días termina igual.</h2>
          <div className="plain-list">
            <div className="plain-item">
              <div className="idx">01</div>
              <p>Llegas cansado.</p>
            </div>
            <div className="plain-item">
              <div className="idx">02</div>
              <p>Quieres estar presente, aunque el día ya te dejó sin mucho para dar.</p>
            </div>
            <div className="plain-item">
              <div className="idx">03</div>
              <p>Y sabes que esos minutos no vuelven.</p>
            </div>
          </div>
        </section>

        <div className="break">
          <div className="blob blob-b glow-behind">
            <Image src="/lumo-art/familia-leyendo-juntos.png" alt="Un padre y su hijo leyendo un libro" fill sizes="180px" />
          </div>
          <p>Algunas conversaciones empiezan con una historia.</p>
        </div>

        <section className="steps-section">
          <div className="eyebrow">Así de simple</div>
          <h2>Tres minutos, cada noche.</h2>
          <div className="steps">
            <div className="step">
              <div className="blob blob-a">
                <Image src="/lumo-art/familia-leyendo-juntos.png" alt="" fill sizes="96px" />
              </div>
              <div className="num">1</div>
              <span>Escuchan una historia.</span>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="blob blob-b">
                <Image src="/lumo-art/familia-presencia-compartida.png" alt="" fill sizes="96px" />
              </div>
              <div className="num">2</div>
              <span>Hablan unos minutos.</span>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="blob blob-c">
                <Image src="/lumo-art/familia-arropar-cama.png" alt="" fill sizes="96px" />
              </div>
              <div className="num">3</div>
              <span>Terminan con una oración sencilla.</span>
            </div>
          </div>
        </section>

        <section className="stories-section">
          <div className="stories-head">
            <div className="eyebrow">Historias para cada momento</div>
            <h2>Una historia distinta para cada estado de ánimo.</h2>
            <p>Elegidas con cuidado, no generadas al azar.</p>
          </div>
          <div className="story-grid">
            <div className="story-card">
              <div className="blob blob-a">
                <Image src="/lumo-art/story-david-goliat-v2_600.webp" alt="David y Goliat" fill sizes="220px" />
              </div>
              <div className="tag">Aventuras que inspiran</div>
              <h3>David y el gigante</h3>
            </div>
            <div className="story-card">
              <div className="blob blob-b">
                <Image src="/lumo-art/story-hijo-prodigo-v2_600.webp" alt="El hijo pródigo" fill sizes="220px" />
              </div>
              <div className="tag">Valores que acompañan</div>
              <h3>El hijo pródigo</h3>
            </div>
            <div className="story-card">
              <div className="blob blob-c">
                <Image src="/lumo-art/story-jesus-tormenta-v2_600.webp" alt="Jesús calma la tormenta" fill sizes="220px" />
              </div>
              <div className="tag">Fe y esperanza</div>
              <h3>Jesús calma la tormenta</h3>
            </div>
          </div>
        </section>

        <section className="compare-section">
          <div className="compare-grid">
            <div className="compare-col before">
              <h3>Antes</h3>
              <ul>
                <li>¿Qué hacemos hoy?</li>
                <li>Silencio.</li>
                <li>Improvisación.</li>
                <li>Cansancio.</li>
              </ul>
            </div>
            <div className="compare-col after">
              <h3>Después</h3>
              <ul>
                <li>La historia empieza.</li>
                <li>La conversación aparece sola.</li>
                <li>La oración llega naturalmente.</li>
                <li>Conexión que se siente.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="value-section">
          <div className="value-inner">
            <div className="blob blob-c glow-behind">
              <Image src="/lumo-art/familia-bodegon-juguetes.png" alt="Una canasta de juguetes al pie de una ventana" fill sizes="(max-width: 860px) 90vw, 420px" />
            </div>
            <div>
              <h2>
                Más que una app.
                <br />
                Un momento que se queda.
              </h2>
              <div className="value-list">
                <div className="value-item">
                  <div className="dot" />
                  <p>Historias cuidadosamente elegidas.</p>
                </div>
                <div className="value-item">
                  <div className="dot" />
                  <p>Conversaciones que conectan.</p>
                </div>
                <div className="value-item">
                  <div className="dot" />
                  <p>Oraciones sencillas y profundas.</p>
                </div>
                <div className="value-item">
                  <div className="dot" />
                  <p>Sin pantallas durante el momento.</p>
                </div>
                <div className="value-item">
                  <div className="dot" />
                  <p>Diseñado para rutinas reales.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="precio">
          <div className="eyebrow on-forest">Un plan simple</div>
          <h2>Para familias reales.</h2>
          <LandingPricing />
        </section>

        <section className="faq-section">
          <div className="eyebrow">Preguntas frecuentes</div>
          <h2>Todo lo que quieres saber.</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>¿Mi hijo tiene que leer?</summary>
              <p>No. Las historias se escuchan, pensadas para compartirlas en voz alta.</p>
            </details>
            <details className="faq-item">
              <summary>¿Qué pasa si no tenemos tiempo todas las noches?</summary>
              <p>No pasa nada. Lumo espera. El camino sigue donde lo dejaron.</p>
            </details>
            <details className="faq-item">
              <summary>¿Es apto para todas las edades?</summary>
              <p>Sí, pensado para niños de 4 a 12 años, y para compartir en familia.</p>
            </details>
            <details className="faq-item">
              <summary>¿Puedo cancelar cuando quiera?</summary>
              <p>Sí, sin compromiso, cuando quieras.</p>
            </details>
          </div>
        </section>

        <section className="closing">
          <ChromaKeyVideo src="/video/lumo-flying-2.mp4" className="lumo-firefly closing-patrol" />
          <div className="blob blob-a glow-behind">
            <Image src="/lumo-art/familia-arropar-cama.png" alt="Un padre arropando a su hijo" fill sizes="170px" />
          </div>
          <p className="lead">
            Mañana volverá a haber cansancio.
            <br />
            <em>Ojalá también vuelva este momento.</em>
          </p>
          <Link href={REGISTRO_HREF} className="btn-pill">
            Crear mi plan gratis
          </Link>
          <div className="microcopy">Una historia nueva cada día, gratis por 7 días</div>
        </section>

        <footer>
          <div className="foot-logo">
            <div className="logo-dot" />
            <span>Lumo</span>
          </div>
          Lumo no vende contenido. Lumo protege un momento.
        </footer>
      </div>
    </div>
  );
}
