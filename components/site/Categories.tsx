import Link from "next/link";
import { getCategories, getAllProducts } from "@/lib/products";

export default async function Categories() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  if (categories.length === 0) return null;

  return (
    <section className="block cats">
      <div className="wrap">
        <div className="sec-head light reveal">
          <div className="eyebrow">Catálogo por categoría</div>
          <h2 className="display">Encuentra tu equipo.</h2>
        </div>
        <div className="cat-strip reveal">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Link className="cat" key={c.slug} href={`/catalogo?cat=${c.slug}`}>
                <span className="cat-idx">{String(i + 1).padStart(2, "0")}</span>
                <div className="cic">{c.iconUrl && <img src={c.iconUrl} alt="" />}</div>
                <div className="cat-copy">
                  <h4>{c.name}</h4>
                  {c.blurb && <p className="cat-blurb">{c.blurb}</p>}
                  <span className="arrow">{count > 0 ? "Ver equipos →" : "Muy pronto →"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
