import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getFreightByToken } from "@/lib/freightTracking";
import PageHead from "@/components/site/PageHead";
import FreightTracker from "@/components/site/FreightTracker";
import OrderCelebration from "@/components/site/OrderCelebration";
import HoverGrid from "@/components/site/HoverGrid";

export const metadata: Metadata = {
  title: "Seguimiento de transporte · ROCCMACH",
  robots: { index: false },
};

export default async function TransporteSeguimientoTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const tracked = await getFreightByToken(token);
  const folio = tracked?.data.folio;

  return (
    <main>
      <PageHead
        eyebrow="Seguimiento"
        title={<>Tu <em>cotización{folio ? ` ${folio}` : ""}.</em></>}
        crumb={[{ label: "Inicio", href: "/" }, { label: "Transporte de Carga", href: "/transporte-de-carga" }]}
        compact
      />
      <section className="block services has-hover-grid" style={{ paddingTop: 30 }}>
        <HoverGrid />
        <div className="wrap" style={{ maxWidth: 720 }}>
          {tracked ? (
            <>
              <Suspense fallback={null}>
                <OrderCelebration
                  title="¡Cotización confirmada!"
                  message={
                    <>
                      Tu cotización <b>{folio}</b> quedó registrada. Nuestro equipo se pondrá en
                      contacto para coordinar tu envío. ¡Gracias por confiar en ROCCMACH!
                    </>
                  }
                  buttonLabel="Ver mi cotización →"
                />
              </Suspense>
              {tracked.kind === "cotizacion" ? (
                <FreightTracker
                  status={tracked.data.status}
                  statusNote={tracked.data.statusNote}
                  customerName={tracked.data.customerName}
                  company={tracked.data.company}
                  createdAt={tracked.data.createdAt}
                  total={tracked.data.total}
                  totalLabel="Total estimado"
                  pdfHref={`/api/flete/${token}/pdf`}
                  details={[
                    { label: "Origen", value: `${tracked.data.origen.ciudad}, CP ${tracked.data.origen.cp}` },
                    { label: "Destino", value: `${tracked.data.destino.ciudad}, CP ${tracked.data.destino.cp}` },
                    { label: "Tipo de caja", value: tracked.data.tipoCaja },
                    { label: "Distancia", value: `${tracked.data.distanceKm} km` },
                  ]}
                />
              ) : (
                <FreightTracker
                  status={tracked.data.status}
                  statusNote={tracked.data.statusNote}
                  customerName={tracked.data.customerName}
                  company={tracked.data.company}
                  createdAt={tracked.data.createdAt}
                  total={tracked.data.total}
                  totalLabel="Precio pactado"
                  pdfHref={`/api/flete/ruta/${token}/pdf`}
                  details={[
                    { label: "Ruta", value: `Guadalajara → ${tracked.data.destino}` },
                    { label: "Tipo de caja", value: tracked.data.tipoCaja },
                  ]}
                />
              )}
            </>
          ) : (
            <div className="track-empty">
              <p>Este enlace de seguimiento no es válido o la cotización ya no existe.</p>
              <p style={{ marginTop: 14 }}>
                <Link href="/transporte-de-carga" className="btn btn-red">Ir a Transporte</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
