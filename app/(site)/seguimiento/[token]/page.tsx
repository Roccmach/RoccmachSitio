import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getOrderByToken } from "@/lib/products";
import PageHead from "@/components/site/PageHead";
import OrderTracker from "@/components/site/OrderTracker";
import OrderCelebration from "@/components/site/OrderCelebration";
import HoverGrid from "@/components/site/HoverGrid";

export const metadata: Metadata = {
  title: "Seguimiento de pedido · ROCCMACH",
  robots: { index: false },
};

export default async function SeguimientoTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  return (
    <main>
      <PageHead
        eyebrow="Seguimiento"
        title={<>Tu <em>pedido{order ? ` ${order.orderNumber}` : ""}.</em></>}
        crumb={[{ label: "Inicio", href: "/" }, { label: "Seguimiento", href: "/seguimiento" }]}
        compact
      />
      <section className="block services has-hover-grid" style={{ paddingTop: 30 }}>
        <HoverGrid />
        <div className="wrap" style={{ maxWidth: 720 }}>
          {order ? (
            <>
              <Suspense fallback={null}>
                <OrderCelebration orderNumber={order.orderNumber} />
              </Suspense>
              <OrderTracker order={order} token={token} />
            </>
          ) : (
            <div className="track-empty">
              <p>Este enlace de seguimiento no es válido o el pedido ya no existe.</p>
              <p style={{ marginTop: 14 }}>
                <Link href="/seguimiento" className="btn btn-red">Buscar por número de pedido</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
