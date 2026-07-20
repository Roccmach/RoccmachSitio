import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";
import { breadcrumbJsonLd, freightServiceJsonLd } from "@/lib/seo";
import { getFreightRoutes } from "@/lib/freightRoutes";
import JsonLd from "@/components/site/JsonLd";
import FreightHero from "@/components/site/FreightHero";
import FreightQuoteTrigger from "@/components/site/FreightQuoteTrigger";
import FreightQuoteModal from "@/components/site/FreightQuoteModal";
import FreightRouteCards from "@/components/site/FreightRouteCards";
import FreightRouteModal from "@/components/site/FreightRouteModal";
import ScrollReveals from "@/components/site/ScrollReveals";
import ScrollParallax from "@/components/site/ScrollParallax";
import HoverGrid from "@/components/site/HoverGrid";

export const revalidate = 60;

const TITLE = "Flete y Transporte de Carga desde Guadalajara · ROCCMACH";
const DESCRIPTION = "Cotiza flete desde Guadalajara a Tijuana, Mazatlán, Hermosillo y más — precio pactado o por distancia real, cotización al instante.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/flete" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/flete`,
    images: [{ url: `${SITE_URL}/flete-banner.jpg`, width: 1600, height: 900, alt: "Flete y transporte de carga ROCCMACH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/flete-banner.jpg`],
  },
};

const PILARES = [
  {
    title: "Confiabilidad",
    desc: "Cumplimos horarios de carga y descarga, y damos seguimiento real a tu envío desde que sale hasta que llega.",
    accent: "#E4151F",
    glow: "rgba(228,21,31,.45)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Rentabilidad",
    desc: "Precio calculado por distancia real, sin sorpresas ni cargos ocultos — pagas por lo que realmente se transporta.",
    accent: "#F2A93B",
    glow: "rgba(242,169,59,.45)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Experiencia",
    desc: "Más de 15 años moviendo carga industrial en México: sabemos cómo cuidar tu equipo en cada kilómetro.",
    accent: "#3B82C4",
    glow: "rgba(59,130,196,.45)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: "1",
    t: "Origen y destino",
    d: "Danos la dirección donde recogemos y donde entregamos la carga.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="5" cy="6" r="2.3" />
        <circle cx="19" cy="18" r="2.3" fill="currentColor" stroke="none" />
        <path d="M7.2 7.6 16.8 16.4" strokeDasharray="2.6 3.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "2",
    t: "Detalle de la carga",
    d: "Tipo de carga, empaque y peso neto/bruto.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 8 12 3l9 5-9 5-9-5z" strokeLinejoin="round" />
        <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    n: "3",
    t: "Horarios",
    d: "Cuándo se carga y cuándo se descarga.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: "4",
    t: "Tu cotización",
    d: "Calculamos la distancia real y te damos el precio al instante, con recibo en PDF.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M6 2h9l5 5v15H6z" strokeLinejoin="round" />
        <path d="M15 2v5h5" strokeLinejoin="round" />
        <path d="M9 13h6M9 17h6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default async function FletePage() {
  const routes = await getFreightRoutes();

  return (
    <main>
      <ScrollReveals />
      <ScrollParallax />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Flete", url: `${SITE_URL}/flete` },
        ])}
      />
      <JsonLd data={freightServiceJsonLd(routes.map((r) => r.destino))} />
      <FreightQuoteModal />
      <FreightRouteModal />

      <FreightHero />

      <section className="block services">
        <div className="svc-orb-clip" aria-hidden="true">
          <div className="svc-orb" data-parallax="0.12" />
        </div>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">Por qué ROCCMACH</div>
            <h2 className="display">Flete que puedes<br />planear con certeza.</h2>
            <p>¿También necesitas comprar o rentar equipo? Ve nuestro <Link href="/catalogo">catálogo de maquinaria</Link>.</p>
          </div>
          <div className="value-grid">
            {PILARES.map((p) => (
              <div className="value reveal" key={p.title} style={{ "--v-accent": p.accent, "--v-glow": p.glow } as React.CSSProperties}>
                <div className="ic">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {routes.length > 0 && (
        <section className="block">
          <div className="value-orb-clip" aria-hidden="true">
            <div className="value-orb" data-parallax="0.1" />
          </div>
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">Rutas del Pacífico</div>
              <h2 className="display">Salidas fijas<br />desde Guadalajara.</h2>
              <p>Elige tu destino y cotiza al instante — el precio ya está pactado con nosotros.</p>
            </div>
            <FreightRouteCards routes={routes} />
          </div>
        </section>
      )}

      <section className="block has-hover-grid">
        <HoverGrid />
        <div className="cats-orb-clip" aria-hidden="true">
          <div className="cats-orb" data-parallax="0.1" />
        </div>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">¿Tu destino no está en la lista?</div>
            <h2 className="display">Cotiza a tu destino en segundos.</h2>
          </div>
          <div className="steps-flow reveal">
            <div className="steps-line" aria-hidden="true">
              <span className="steps-line-runner" />
            </div>
            {STEPS.map((s, i) => (
              <div className="step-card" key={s.n} style={{ "--step-delay": `${0.15 + i * 0.18}s` } as React.CSSProperties}>
                <div className="step-ic" aria-hidden="true">{s.icon}</div>
                <div className="step-num" aria-hidden="true"><span>{s.n}</span></div>
                <h3><span className="sr-only">Paso {s.n}: </span>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 50 }} className="reveal">
            <FreightQuoteTrigger className="btn btn-red">Cotiza con dirección personalizada →</FreightQuoteTrigger>
          </div>
        </div>
      </section>
    </main>
  );
}
