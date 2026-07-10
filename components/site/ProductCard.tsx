import Link from "next/link";
import { isBuyable, formatMXN } from "@/lib/config";
import type { Product } from "@/lib/catalog";
import ForkliftIcon from "./ForkliftIcon";
import QuoteTrigger from "./QuoteTrigger";

export default function ProductCard({ p }: { p: Product }) {
  const buy = isBuyable(p.price);
  const href = `/catalogo/${p.slug}`;

  return (
    <article className="card reveal">
      <Link href={href} className="media" aria-label={`${p.brand} ${p.model}`}>
        <span className={`badge ${buy ? "buy" : "quote"}`}>{buy ? "Compra en línea" : "Disponible"}</span>
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={`${p.brand} ${p.model}`} style={{ width: "88%", objectFit: "contain" }} />
        ) : (
          <ForkliftIcon />
        )}
      </Link>
      <div className="body">
        <span className="brand">{p.brand}</span>
        <h3><Link href={href}>{p.model}</Link></h3>
        <div className="spec">{p.shortSpec}</div>
        <div className="foot">
          {buy ? (
            <>
              <div className="price">{formatMXN(p.price)}<small>MXN + IVA</small></div>
              <Link className="act buy" href={href}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
                Comprar
              </Link>
            </>
          ) : (
            <>
              <div className="price">
                {p.price > 0 ? formatMXN(p.price) : "Precio a consultar"}
                <small>{p.price > 0 ? "MXN + IVA" : "Contáctanos"}</small>
              </div>
              <QuoteTrigger className="act quote" product={{ slug: p.slug, brand: p.brand, model: p.model, price: p.price }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
                Comprar
              </QuoteTrigger>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
