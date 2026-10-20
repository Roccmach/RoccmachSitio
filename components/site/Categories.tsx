import Link from "next/link";
import type { CSSProperties } from "react";
import { getCategories, getAllProducts } from "@/lib/products";

export default async function Categories() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  // Solo categorías con equipos disponibles: una vacía llevaría al catálogo sin filtrar.
  // Aparece sola en cuanto tenga su primer equipo.
  const visibles = categories
    .map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length }))
    .filter((c) => c.count > 0);
  if (visibles.length === 0) return null;

  // Filas parejas de máximo 4: 3→3, 5→3+2, 6→3+3, 7→4+3. La fila corta se estira (CSS).
  const n = visibles.length;
  const cols = Math.ceil(n / Math.ceil(n / 4));

  return (
    <section className="block cats">
      <div className="wrap">
        <div className="sec-head light reveal">
          <div className="eyebrow">Catálogo por categoría</div>
          <h2 className="display">Encuentra tu equipo.</h2>
        </div>
        <div className="cat-strip reveal" style={{ "--cols": cols } as CSSProperties}>
          {visibles.map((c) => (
            <Link className="cat" key={c.slug} href={`/catalogo?cat=${c.slug}`}>
              <div className="cic">{c.iconUrl && <img src={c.iconUrl} alt="" />}</div>
              <div className="cat-copy">
                <h3>{c.name}</h3>
                {c.blurb && <p className="cat-blurb">{c.blurb}</p>}
                <span className="arrow">
                  {c.count} {c.count === 1 ? "equipo" : "equipos"} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
