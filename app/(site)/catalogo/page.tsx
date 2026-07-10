import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/config";
import { breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import CatalogGrid from "@/components/site/CatalogGrid";
import ScrollReveals from "@/components/site/ScrollReveals";

export const metadata: Metadata = {
  title: "Catálogo de Maquinaria Industrial en Guadalajara · ROCCMACH",
  description:
    "Montacargas, grúas, patines y plataformas seminuevos en Guadalajara, Jalisco. Filtra por categoría, precio y capacidad de carga. Compra en línea o coordinamos entrega a toda la República Mexicana.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const products = await getAllProducts();

  return (
    <main>
      <ScrollReveals />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Catálogo", url: `${SITE_URL}/catalogo` },
        ])}
      />
      <section className="block section-light" style={{ paddingTop: 130, paddingBottom: 0 }}>
        <div className="wrap">
          <div className="crumb" style={{ color: "var(--steel-d)", marginBottom: 14 }}>
            <Link href="/">Inicio</Link> / Catálogo
          </div>
          <CatalogGrid products={products} initialCat={cat ?? "all"} title="Catálogo de maquinaria industrial" />
        </div>
      </section>
    </main>
  );
}
