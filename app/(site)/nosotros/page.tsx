import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/site/PageHead";
import ScrollReveals from "@/components/site/ScrollReveals";
import HoverGrid from "@/components/site/HoverGrid";
import JsonLd from "@/components/site/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nosotros — Maquinaria Industrial en Guadalajara · ROCCMACH",
  description:
    "Empresa mexicana con más de 15 años de experiencia en venta y renta de maquinaria industrial. Con sede en Guadalajara, Jalisco, damos servicio y entrega a toda la República Mexicana.",
  alternates: { canonical: "/nosotros" },
};

const VALUES = [
  {
    title: "Respaldo real",
    desc: "No desaparecemos después de la venta. Servicio, refacciones y soporte que mantienen tu equipo trabajando.",
    icon: "/icons/icon-warranty.png",
    accent: "#E4151F",
    glow: "rgba(228,21,31,.45)",
  },
  {
    title: "Marcas líderes",
    desc: "Trabajamos solo con fabricantes probados: Toyota, Caterpillar, Hyster, Yale, Crown y más.",
    icon: "/icons/icon-crane.png",
    accent: "#F2A93B",
    glow: "rgba(242,169,59,.45)",
  },
  {
    title: "Cobertura nacional",
    desc: "Entregamos y damos servicio en todo México. Donde esté tu operación, ahí estamos.",
    icon: "/icons/icon-handshake.png",
    accent: "#3B82C4",
    glow: "rgba(59,130,196,.45)",
  },
  {
    title: "Atención personalizada",
    desc: "Un especialista real te acompaña de principio a fin: dudas, cotización y soporte post-venta.",
    icon: "/icons/icon-support.png",
    accent: "#7C6CF2",
    glow: "rgba(124,108,242,.45)",
  },
];

const STATS = [
  { b: "+15", s: "años de experiencia" },
  { b: "500+", s: "equipos entregados" },
  { b: "15+", s: "marcas líderes" },
  { b: "24/7", s: "servicio y refacciones" },
];

const MISION_VISION = [
  {
    label: "Misión",
    title: "Soluciones que impulsan tu operación",
    desc: "Proporcionar soluciones a las empresas a través de la adquisición de maquinaria industrial y refacciones, con atención personalizada que garantiza respuestas rápidas y acertadas para cada cliente.",
  },
  {
    label: "Visión",
    title: "Ser líderes en el sector",
    desc: "Ser líderes en la distribución y el servicio de maquinaria industrial y refacciones, destacando por la excelencia en la calidad de nuestros productos y la atención al cliente.",
  },
];

export default function NosotrosPage() {
  return (
    <main>
      <ScrollReveals />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Nosotros", url: `${SITE_URL}/nosotros` },
        ])}
      />
      <PageHead
        eyebrow="Nosotros"
        title={<>Movemos la <em>industria.</em></>}
        subtitle="Desde Guadalajara para todo México: maquinaria industrial con el respaldo que tu operación necesita."
        crumb={[{ label: "Inicio", href: "/" }, { label: "Nosotros", href: "/nosotros" }]}
        image="/nosotros-banner.png"
      />

      <div className="ph-medallion" aria-hidden="true">
        <span className="ph-medallion-ring" />
        <span className="disc disc-top" />
        <span className="disc disc-bottom" />
      </div>

      <section className="block services">
        <div className="wrap">
          <p className="about-lead reveal">
            Somos una empresa mexicana, <em>apasionada por el servicio</em>: tu socio confiable en la
            adquisición y renta de maquinaria industrial, refacciones y servicio en Guadalajara y todo México.
          </p>
          <p className="reveal" style={{ color: "var(--cream)", fontSize: "1.05rem", maxWidth: 720, marginTop: 16 }}>
            Con una sólida experiencia en el mercado, nos destacamos por ofrecer una atención exclusiva y
            personalizada, adaptándonos a las necesidades específicas de cada cliente.
          </p>

          <div className="value-grid value-grid-4">
            {VALUES.map((v) => (
              <div
                className="value reveal"
                key={v.title}
                style={{ "--v-accent": v.accent, "--v-glow": v.glow } as React.CSSProperties}
              >
                <div className="ic"><img src={v.icon} alt="" /></div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="mv-grid">
            {MISION_VISION.map((mv) => (
              <div className="value reveal" key={mv.label}>
                <div className="eyebrow">{mv.label}</div>
                <h3>{mv.title}</h3>
                <p>{mv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block cats">
        <div className="wrap">
          <div className="stat-band reveal">
            {STATS.map((st) => (
              <div key={st.s}>
                <b>{st.b}</b>
                <span>{st.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block services has-hover-grid" style={{ textAlign: "center" }}>
        <HoverGrid />
        <div className="wrap">
          <h2 className="display reveal" style={{ fontSize: "clamp(2rem,5vw,3.6rem)", color: "#fff" }}>
            ¿Listo para mover tu operación?
          </h2>
          <div className="reveal" style={{ marginTop: 28, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/catalogo" className="btn btn-red">Ver catálogo</Link>
            <Link href="/contacto" className="btn btn-ghost">Contáctanos</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
