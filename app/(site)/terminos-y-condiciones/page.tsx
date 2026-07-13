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
  title: "Términos y Condiciones · ROCCMACH",
  description: "Términos y condiciones de compra, renta y servicio de ROCCMACH Maquinaria Industrial.",
  alternates: { canonical: "/terminos-y-condiciones" },
};

export default async function TerminosPage() {
  const page = await getLegalPage("terminos");

  return (
    <main>
      <ScrollReveals />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Términos y Condiciones", url: `${SITE_URL}/terminos-y-condiciones` },
        ])}
      />
      <PageHead
        eyebrow="Legal"
        title={page?.title || "Términos y Condiciones"}
        crumb={[{ label: "Inicio", href: "/" }, { label: "Términos y Condiciones", href: "/terminos-y-condiciones" }]}
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
