import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryName, type Product } from "@/lib/catalog";
import { getAllProducts, getProductBySlug, getProductSlugs } from "@/lib/products";
import { isBuyable, formatMXN, SITE_URL } from "@/lib/config";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import ForkliftIcon from "@/components/site/ForkliftIcon";
import ProductCard from "@/components/site/ProductCard";
import BuyButton from "@/components/site/BuyButton";
import QuoteTrigger from "@/components/site/QuoteTrigger";
import ScrollReveals from "@/components/site/ScrollReveals";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Descripción de respaldo cuando el equipo no tiene `description` propia (varios no la
 * tienen desde el fix de datos del catálogo) — arma una a partir de specs reales, nunca vacía. */
function metaDescription(p: Product) {
  const priceText = p.price > 0 ? `Desde ${formatMXN(p.price)} MXN + IVA.` : "Precio a consultar.";
  const spec = p.shortSpec.replace(/\.?$/, "."); // garantiza un solo punto final, tenga o no ya uno
  const base = p.description || `${p.brand} ${p.model}, ${categoryName(p.category).toLowerCase()} ${p.condition.toLowerCase()}. ${spec}`;
  return `${base} ${priceText} Disponible en Guadalajara con entrega a toda la República Mexicana.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Equipo no encontrado · ROCCMACH" };
  const title = `${p.brand} ${p.model} — ${categoryName(p.category)} ${p.condition.toLowerCase()} en Guadalajara · ROCCMACH`;
  const description = metaDescription(p);
  return {
    title,
    description,
    alternates: { canonical: `/catalogo/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/catalogo/${p.slug}`,
      images: p.imageUrl ? [{ url: p.imageUrl, alt: `${p.brand} ${p.model}` }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const buy = isBuyable(p.price);
  const all = await getAllProducts();
  const related = all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);

  return (
    <main>
      <ScrollReveals />
      <JsonLd data={productJsonLd(p)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: SITE_URL },
          { name: "Catálogo", url: `${SITE_URL}/catalogo` },
          { name: categoryName(p.category), url: `${SITE_URL}/catalogo?cat=${p.category}` },
          { name: p.model, url: `${SITE_URL}/catalogo/${p.slug}` },
        ])}
      />
      <section className="section-light pd" style={{ paddingTop: 130 }}>
        <div className="wrap">
          <div className="crumb" style={{ color: "var(--steel-d)", marginBottom: 24 }}>
            <Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> /{" "}
            <Link href={`/catalogo?cat=${p.category}`}>{categoryName(p.category)}</Link> / {p.model}
          </div>

          <div className="pd-grid">
            <div className="pd-media">
              <span className={`badge ${buy ? "buy" : "quote"}`}>{buy ? "Compra en línea" : "Disponible"}</span>
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={`${p.brand} ${p.model} — ${categoryName(p.category).toLowerCase()} ${p.condition.toLowerCase()} en Guadalajara`}
                  style={{ width: "82%", objectFit: "contain" }}
                />
              ) : (
                <ForkliftIcon />
              )}
            </div>

            <div className="pd-info">
              <span className="brand">{p.brand}</span>
              <h1>{p.model}</h1>
              <span className="pd-cond">{p.condition}</span>

              <table className="pd-specs">
                <tbody>
                  {p.specs.map((s) => (
                    <tr key={s.label}>
                      <td>{s.label}</td>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {buy ? (
                <div className="pd-price">{formatMXN(p.price)}<small>MXN + IVA · Compra en línea disponible</small></div>
              ) : p.price > 0 ? (
                <div className="pd-price">{formatMXN(p.price)}<small>MXN + IVA · Coordinamos pago y entrega contigo</small></div>
              ) : (
                <div className="pd-price">Precio a consultar<small>Contáctanos y te armamos tu propuesta</small></div>
              )}

              <div className="pd-cta">
                {buy ? (
                  <BuyButton slug={p.slug} />
                ) : (
                  <QuoteTrigger className="btn btn-green" product={{ slug: p.slug, brand: p.brand, model: p.model, price: p.price }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
                    Comprar este equipo
                  </QuoteTrigger>
                )}
                <Link className="pd-back" href="/catalogo">← Volver al catálogo</Link>
              </div>
            </div>
          </div>

          {p.description && <p className="pd-desc-full">{p.description}</p>}
        </div>
      </section>

      {related.length > 0 && (
        <section className="block section-light" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head light reveal">
              <div className="eyebrow">También te puede servir</div>
              <h2 className="display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
                Más {categoryName(p.category).toLowerCase()}
              </h2>
            </div>
            <div className="prod-grid">
              {related.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
