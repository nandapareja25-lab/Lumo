"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Moon,
  Smartphone,
  Heart,
  BookOpen,
  MessageCircle,
  Users,
  Clock,
  ChevronDown,
  Menu,
} from "lucide-react";
import { LandingPricing } from "@/components/app/landing-pricing";

const REGISTRO_HREF = "/onboarding";

const PROBLEMA = [
  { icon: Moon, text: "Llegas cansado." },
  { icon: Smartphone, text: "Quieres estar presente, pero ya no te queda nada para dar." },
  { icon: Heart, text: "Y sabes que esos minutos no vuelven." },
];

const PASOS = [
  { label: "Escuchan una historia.", img: "/lumo-art/familia-leyendo-juntos.png", zoom: 1 },
  { label: "Hablan unos minutos.", img: "/lumo-art/familia-presencia-compartida.png", zoom: 1 },
  { label: "Terminan con una oración sencilla.", img: "/lumo-art/familia-arropar-cama.png", zoom: 1.6 },
];

const CATALOGO = [
  { label: "Aventuras que inspiran", img: "/lumo-art/story-david-goliat-v2_600.webp" },
  { label: "Valores que acompañan", img: "/lumo-art/story-hijo-prodigo-v2_600.webp" },
  { label: "Fe y esperanza para el corazón", img: "/lumo-art/story-jesus-tormenta-v2_600.webp" },
];

const ANTES = ["¿Qué hacemos hoy?", "Silencio.", "Improvisación.", "Cansancio."];
const DESPUES = ["La historia empieza.", "La conversación aparece sola.", "La oración llega naturalmente.", "Conexión que se siente."];

const BENEFICIOS = [
  { icon: BookOpen, text: "Historias cuidadosamente elegidas." },
  { icon: MessageCircle, text: "Conversaciones que conectan." },
  { icon: Heart, text: "Oraciones sencillas y profundas." },
  { icon: Smartphone, text: "Sin pantallas durante el momento." },
  { icon: Users, text: "Para toda la familia." },
  { icon: Clock, text: "Diseñado para rutinas reales." },
];

const FAQS = [
  {
    q: "¿Mi hijo tiene que leer?",
    a: "No. Todo en Lumo se escucha — las historias, las oraciones y las reflexiones. Pensado para que la familia escuche junta, sin depender de que el niño ya sepa leer.",
  },
  {
    q: "¿Qué pasa si no tenemos tiempo todas las noches?",
    a: "Nada. Lumo está ahí cuando quieran usarlo — no hay rachas que mantener ni notificaciones que presionen. Cuando quieran, ahí va a estar.",
  },
  {
    q: "¿Es apto para todas las edades?",
    a: "Sí. Las historias y oraciones están pensadas para escucharse en familia, con niños de distintas edades presentes al mismo tiempo.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, en cualquier momento, sin preguntas ni pasos adicionales.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[rgba(42,31,23,0.10)] py-1 last:border-b">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-[18px] text-left"
      >
        <span className="font-heading text-[16px]">{q}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform"
          style={{ color: "#B8791F", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && <p className="max-w-[56ch] pb-[22px] text-[14.5px] text-[#6B5A4A]">{a}</p>}
    </div>
  );
}

/**
 * Landing — universo visual del ritual familiar (ver ROADMAP.md 2026-07-22). Recorrido:
 * problema → ritual → producto → evidencia → decisión → emoción final. La sección de producto
 * (capturas reales de la app) queda pendiente — se integra aparte, no con arte generado.
 */
export default function LandingPage() {
  return (
    <div className="bg-[#F1EEE7] font-sans text-[#2A1F17]">
    <div className="mx-auto max-w-[520px] bg-[#FAF3EE] md:shadow-[0_0_80px_rgba(42,31,23,0.08)]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background: "radial-gradient(circle, #F3C878 0%, #E8A33D 60%, rgba(232,163,61,0) 100%)",
              boxShadow: "0 0 12px 3px rgba(232,163,61,0.5)",
            }}
          />
          <span className="font-heading text-[19px]">Lumo</span>
        </div>
        <Menu className="h-5 w-5 text-[#2A1F17]" aria-hidden />
      </nav>

      {/* 1. HERO */}
      <section className="px-6 pb-16 pt-4">
        <span
          className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ background: "rgba(184,121,31,0.10)", color: "#B8791F" }}
        >
          Momentos que conectan
        </span>
        <h1 className="mb-4 max-w-[14ch] text-balance font-heading text-[clamp(30px,7vw,44px)] font-medium leading-[1.12]">
          Pequeños momentos. Grandes recuerdos.
        </h1>
        <p className="mb-6 max-w-[36ch] text-[16px] text-[#6B5A4A]">
          Historias y oración para terminar el día en paz, juntos.
        </p>
        <Link
          href={REGISTRO_HREF}
          className="inline-block rounded-full px-8 py-4 text-[15px] font-bold text-[#1F1712]"
          style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)", boxShadow: "0 10px 30px rgba(232,163,61,0.28)" }}
        >
          Comenzar gratis
        </Link>
        <p className="mt-3 text-xs text-[#6B5A4A]">Una historia nueva cada día, gratis por 7 días · Premium desbloquea todas las historias</p>

        <div
          className="relative mt-9 aspect-[4/5] w-full overflow-hidden rounded-[28px]"
          style={{ boxShadow: "0 24px 60px -20px rgba(42,31,23,0.30)" }}
        >
          <Image
            src="/lumo-art/familia-presencia-compartida.png"
            alt="Una madre y su hija conversando en el piso del living, en un momento de calma antes de dormir"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      </section>

      {/* 2. EL PROBLEMA */}
      <section className="px-6 pb-16">
        <h2 className="mb-8 text-center font-heading text-[clamp(22px,5vw,28px)] font-medium">
          Todos los días termina igual.
        </h2>
        <div className="mx-auto flex max-w-[420px] flex-col gap-7">
          {PROBLEMA.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(232,163,61,0.12)" }}
              >
                <Icon className="h-5 w-5" style={{ color: "#E8A33D" }} />
              </span>
              <p className="text-body text-balance">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRANSICIÓN EMOCIONAL */}
      <section className="px-6 pb-16">
        <div className="relative mx-auto aspect-[16/10] max-w-[600px] overflow-hidden rounded-[24px]">
          <Image
            src="/lumo-art/familia-leyendo-juntos.png"
            alt="Un padre y su hijo leyendo un libro juntos en el sillón"
            fill
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(16,11,8,0.85) 0%, rgba(16,11,8,0.1) 50%, rgba(16,11,8,0) 70%)" }}
          />
          <p className="absolute inset-x-0 bottom-0 px-6 pb-6 text-center font-heading text-[clamp(18px,3.6vw,22px)] text-white">
            Algunas conversaciones empiezan con una historia.
          </p>
        </div>
      </section>

      {/* 4. CÓMO FUNCIONA */}
      <section className="px-6 pb-16">
        <h2 className="mb-9 text-center font-heading text-[clamp(22px,5vw,28px)] font-medium">Así de simple.</h2>
        <div className="mx-auto flex max-w-[460px] justify-between gap-3">
          {PASOS.map((p, i) => (
            <div key={p.label} className="flex flex-1 flex-col items-center gap-3 text-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full" style={{ boxShadow: "0 8px 20px -8px rgba(42,31,23,0.28)" }}>
                <Image
                  src={p.img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  style={{ transform: `scale(${p.zoom})` }}
                />
              </div>
              <p className="text-[12.5px] leading-snug text-[#6B5A4A]">
                <span className="mr-1 font-semibold text-[#B8791F]">{i + 1}.</span>
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CATÁLOGO */}
      <section className="pb-16">
        <h2 className="mb-6 px-6 text-center font-heading text-[clamp(22px,5vw,28px)] font-medium">
          Historias para cada momento
        </h2>
        <div className="flex gap-3 overflow-x-auto px-6 pb-2">
          {CATALOGO.map((c) => (
            <div
              key={c.label}
              className="relative aspect-[3/4] w-[42%] shrink-0 overflow-hidden rounded-2xl"
              style={{ boxShadow: "0 10px 24px -12px rgba(42,31,23,0.28)" }}
            >
              <Image src={c.img} alt={c.label} fill sizes="45vw" className="object-cover" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(0deg, rgba(16,11,8,0.85) 0%, rgba(16,11,8,0.1) 50%, rgba(16,11,8,0) 70%)" }}
              />
              <p className="absolute inset-x-0 bottom-0 p-3 text-[13px] font-medium leading-snug text-white">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ANTES / DESPUÉS */}
      <section className="px-6 pb-6">
        <div className="mx-auto grid max-w-[520px] grid-cols-2 gap-3">
          <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(42,31,23,0.10)" }}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B5A4A]">Antes</p>
            <ul className="flex flex-col gap-2">
              {ANTES.map((t) => (
                <li key={t} className="text-[13.5px] text-[#6B5A4A]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: "#B8791F", background: "rgba(184,121,31,0.06)" }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#B8791F" }}>
              Después
            </p>
            <ul className="flex flex-col gap-2">
              {DESPUES.map((t) => (
                <li key={t} className="text-[13.5px]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="px-6 pb-16">
        <div className="relative mx-auto aspect-[4/3] max-w-[520px] overflow-hidden rounded-[24px]">
          <Image
            src="/lumo-art/familia-bodegon-juguetes.png"
            alt="Una canasta de juguetes al pie de una ventana, en casa"
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className="object-cover"
          />
        </div>
      </section>

      {/* 7. PRODUCTO — pendiente: capturas reales de la app dentro de marcos de dispositivo */}

      {/* 8. BENEFICIOS */}
      <section className="px-6 pb-16">
        <h2 className="mb-9 text-center font-heading text-[clamp(22px,5vw,28px)] font-medium leading-[1.3]">
          Más que una app.
          <br />
          Un momento que se queda.
        </h2>
        <div className="mx-auto grid max-w-[480px] grid-cols-2 gap-4">
          {BENEFICIOS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-start gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "rgba(184,121,31,0.10)" }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color: "#B8791F" }} />
              </span>
              <p className="text-[13.5px] leading-snug text-[#6B5A4A]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TESTIMONIO */}
      <section className="px-6 pb-16">
        <div className="relative mx-auto aspect-[4/5] max-w-[520px] overflow-hidden rounded-[28px]">
          <Image
            src="/lumo-art/familia-testimonio.png"
            alt="Una madre y su hija abrazadas, en calma"
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(16,11,8,0.88) 0%, rgba(16,11,8,0.2) 55%, rgba(16,11,8,0) 75%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="mb-3 text-balance font-heading text-[19px] italic leading-[1.4] text-white">
              &ldquo;Lumo nos dio algo que no teníamos: un momento lindo, sin tener que inventarlo cada noche.&rdquo;
            </p>
            <p className="text-[13px] text-[#C9BBA3]">— Mamá de Sofía, 7 años</p>
          </div>
        </div>
      </section>

      {/* 10. PRICING */}
      <section id="precio" className="px-6 pb-16">
        <h2 className="mb-9 text-center font-heading text-[clamp(22px,5vw,28px)] font-medium">
          Un plan simple para familias reales.
        </h2>
        <LandingPricing />
      </section>

      {/* 11. FAQ */}
      <section className="px-6 pb-16">
        <h2 className="mb-6 text-center font-heading text-[clamp(22px,5vw,28px)] font-medium">Preguntas frecuentes</h2>
        <div className="mx-auto max-w-[560px]">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* 12. CIERRE */}
      <section className="px-6 pb-16">
        <div className="relative mx-auto aspect-[4/5] max-w-[560px] overflow-hidden rounded-[28px]">
          <Image
            src="/lumo-art/familia-arropar-cama.png"
            alt="Un padre arropando a su hijo ya dormido"
            fill
            sizes="(max-width: 640px) 100vw, 560px"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(16,11,8,0.9) 0%, rgba(16,11,8,0.25) 55%, rgba(16,11,8,0) 75%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 p-7 text-center">
            <p className="max-w-[26ch] text-balance font-heading text-[clamp(19px,4vw,24px)] leading-[1.4] text-white">
              Mañana volverá a haber cansancio. Ojalá también vuelva este momento.
            </p>
            <div>
              <Link
                href={REGISTRO_HREF}
                className="inline-block rounded-full px-8 py-4 text-[15px] font-bold text-[#1F1712]"
                style={{ background: "linear-gradient(180deg, #F3C878, #F0B860)" }}
              >
                Crear mi plan gratis
              </Link>
              <p className="mt-3 text-xs text-[#C9BBA3]">Una historia nueva cada día, gratis por 7 días · Premium desbloquea todas las historias</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(42,31,23,0.10)] px-7 py-10 text-center">
        <p className="mb-2.5 font-heading text-base">Lumo</p>
        <p className="text-xs text-[#6B5A4A] opacity-60">Lumo no vende contenido. Lumo protege un momento.</p>
      </footer>
    </div>
    </div>
  );
}
