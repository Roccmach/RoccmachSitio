import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getLegalPage } from "@/lib/legal";
import JsonLd from "@/components/site/JsonLd";
import PageHead from "@/components/site/PageHead";
import LegalContent from "@/components/site/LegalContent";
import ScrollReveals from "@/components/site/ScrollReveals";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Aviso de Privacidad · ROCCMACH",
  description: "Aviso de privacidad sobre el tratamiento de datos personales en ROCCMACH Maquinaria Industrial.",
  alternates: { canonical: "/aviso-de-privacidad" },
};

export default async function AvisoPrivacidadPage() {
  const page = await getLegalPage("privacidad");

  return (
    <main>
      <ScrollReveals />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Aviso de Privacidad", url: `${SITE_URL}/aviso-de-privacidad` },
        ])}
      />
      <PageHead
        eyebrow="Legal"
        title={page?.title || "Aviso de Privacidad"}
        crumb={[{ label: "Inicio", href: "/" }, { label: "Aviso de Privacidad", href: "/aviso-de-privacidad" }]}
        compact
      />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 820 }}>
          {page?.content ? (
            <LegalContent content={page.content} />
          ) : (
            <p className="reveal" style={{ color: "var(--steel-d)" }}>
              Aún no se ha publicado este contenido. Vuelve pronto.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
