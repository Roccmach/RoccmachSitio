import type { Metadata } from "next";
import { BRAND, waLink, SITE_URL } from "@/lib/config";
import { breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import PageHead from "@/components/site/PageHead";
import ContactForm from "@/components/site/ContactForm";
import ScrollReveals from "@/components/site/ScrollReveals";
import HoverGrid from "@/components/site/HoverGrid";

export const metadata: Metadata = {
  title: "Contacto — Maquinaria Industrial en Guadalajara · ROCCMACH",
  description:
    "Escríbenos por WhatsApp, llama o visítanos en Guadalajara, Jalisco. Compra montacargas, grúas, patines y plataformas industriales con atención personalizada.",
  alternates: { canonical: "/contacto" },
};

const INFO = [
  {
    label: "WhatsApp",
    value: "Escríbenos directo",
    href: waLink("Hola ROCCMACH, quiero información"),
    icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2" /></svg>,
  },
  {
    label: "Teléfono",
    value: BRAND.phone,
    href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>,
  },
  {
    label: "Correo",
    value: BRAND.email,
    href: `mailto:${BRAND.email}`,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>,
  },
  {
    label: "Ubicación",
    value: BRAND.city,
    href: "#",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  },
];

export default function ContactoPage() {
  return (
    <main>
      <ScrollReveals />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Contacto", url: `${SITE_URL}/contacto` },
        ])}
      />
      <PageHead
        eyebrow="Contacto"
        title={<>Hablemos de tu <em>operación.</em></>}
        subtitle="Cuéntanos qué necesitas y te respondemos rápido. Compras, renta, refacciones o servicio."
        crumb={[{ label: "Inicio", href: "/" }, { label: "Contacto", href: "/contacto" }]}
      />

      <section className="block services has-hover-grid">
        <HoverGrid />
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="display reveal" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#fff", marginBottom: 20 }}>
                Canales directos
              </h2>
              {INFO.map((c) => (
                <a className="ci reveal" key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                  <div className="ic">{c.icon}</div>
                  <div>
                    <span>{c.label}</span>
                    <b>{c.value}</b>
                  </div>
                </a>
              ))}
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
