import type { Metadata } from "next";
import { getOrderByNumber } from "@/lib/products";
import PageHead from "@/components/site/PageHead";
import TrackForm from "@/components/site/TrackForm";
import OrderTracker from "@/components/site/OrderTracker";

export const metadata: Metadata = {
  title: "Seguimiento de pedido · ROCCMACH",
  description: "Rastrea tu pedido de maquinaria industrial con tu número de pedido.",
};

export default async function SeguimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;
  const order = pedido ? await getOrderByNumber(pedido) : null;

  return (
    <main>
      <PageHead
        eyebrow="Seguimiento"
        title={<>Rastrea tu <em>pedido.</em></>}
        subtitle="Ingresa tu número de pedido (te lo dimos al confirmar tu compra) para ver el estatus de tu entrega."
        crumb={[{ label: "Inicio", href: "/" }, { label: "Seguimiento", href: "/seguimiento" }]}
      />

      <section className="block services">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <TrackForm initial={pedido ?? ""} />

          {pedido && !order && (
            <div className="track-empty">
              <p>No encontramos un pedido con el número <b>{pedido}</b>.</p>
              <p style={{ color: "var(--steel)" }}>Revisa que esté bien escrito o contáctanos por WhatsApp y te ayudamos.</p>
            </div>
          )}

          {order && <OrderTracker order={order} />}
        </div>
      </section>
    </main>
  );
}
