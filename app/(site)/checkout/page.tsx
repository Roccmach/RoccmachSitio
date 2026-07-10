import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Checkout · ROCCMACH", robots: { index: false } };

const STATES = {
  success: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>,
    color: "#0E7C3A",
    title: "¡Pago confirmado!",
    text: "Gracias por tu compra. Te contactaremos para coordinar la entrega de tu equipo.",
  },
  pending: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></svg>,
    color: "#F97316",
    title: "Pago pendiente",
    text: "Tu pago está en proceso. En cuanto se confirme, te avisamos y coordinamos la entrega.",
  },
  failure: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>,
    color: "#E4151F",
    title: "El pago no se completó",
    text: "No se realizó ningún cargo. Puedes intentar de nuevo o escribirnos por WhatsApp.",
  },
} as const;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; external_reference?: string; t?: string }>;
}) {
  const { status, external_reference, t } = await searchParams;
  const s = STATES[(status as keyof typeof STATES) ?? "success"] ?? STATES.success;
  const isSuccess = (status ?? "success") === "success";
  const orderNumber = external_reference;
  const trackHref = t ? `/seguimiento/${t}` : orderNumber ? `/seguimiento?pedido=${orderNumber}` : "/seguimiento";

  return (
    <main>
      <section className="block services" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div style={{ width: 88, height: 88, borderRadius: 24, margin: "0 auto 28px", display: "grid", placeItems: "center", color: "#fff", background: s.color }}>
            <div style={{ width: 44, height: 44 }}>{s.icon}</div>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", color: "#fff" }}>{s.title}</h1>
          <p style={{ color: "var(--steel)", fontSize: "1.1rem", margin: "16px 0 24px" }}>{s.text}</p>

          {isSuccess && orderNumber && (
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 22px", marginBottom: 26 }}>
              <span style={{ display: "block", fontSize: ".78rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--steel)" }}>Tu número de pedido</span>
              <b className="display" style={{ fontSize: "1.8rem", color: "#fff", letterSpacing: ".04em" }}>{orderNumber}</b>
              <span style={{ display: "block", fontSize: ".9rem", color: "var(--steel)", marginTop: 6 }}>Guárdalo para dar seguimiento a tu entrega.</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {isSuccess && orderNumber ? (
              <Link href={trackHref} className="btn btn-red">Seguir mi pedido →</Link>
            ) : (
              <Link href="/catalogo" className="btn btn-red">Volver al catálogo</Link>
            )}
            <Link href="/" className="btn btn-ghost">Ir al inicio</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
