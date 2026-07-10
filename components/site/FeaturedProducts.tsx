import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);
  if (!products.length) return null;

  return (
    <section className="block catalog" id="destacados">
      <div className="wrap">
        <div className="sec-head light reveal">
          <div className="eyebrow">Catálogo destacado</div>
          <h2 className="display">Equipo listo<br />para trabajar.</h2>
          <p>
            Montacargas, patines y plataformas seminuevos, revisados y listos para operar desde
            el día uno. Compra en línea o coordinamos pago y entrega directo contigo, en Guadalajara
            y todo México.
          </p>
        </div>

        <div className="prod-grid">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 50 }} className="reveal">
          <Link href="/catalogo" className="btn btn-dark">Ver catálogo completo →</Link>
        </div>
      </div>
    </section>
  );
}
