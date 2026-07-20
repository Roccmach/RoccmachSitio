import Link from "next/link";
import { formatMXN } from "@/lib/config";
import type { TrackedOrder } from "@/lib/products";

// Pasos distintos según el tipo de pedido: MercadoPago paga en línea desde el
// inicio; la compra asistida (+$50k) negocia primero y no pasa por "Pendiente
// de pago" — ambos comparten el mismo tramo final (Pagado → Entregado).
const STEPS_BY_KIND: Record<"mercadopago" | "asistido", string[]> = {
  mercadopago: ["Pendiente de pago", "Pagado", "En preparación", "Enviado", "Entregado"],
  asistido: ["Pendiente de contacto", "Cotización enviada", "Pagado", "En preparación", "Enviado", "Entregado"],
};

// Color por status (no por posición en el arreglo) — así "Pagado" siempre es
// azul en cualquiera de los dos flujos, y el chip de arriba nunca queda sin
// color aunque el status no esté en la lista de pasos del pedido.
const STATUS_COLORS: Record<string, { solid: string; glow: string }> = {
  "Pendiente de contacto": { solid: "#8A9099", glow: "rgba(138,144,153,.45)" },
  "Cotización enviada": { solid: "#06B6D4", glow: "rgba(6,182,212,.45)" },
  "Pendiente de pago": { solid: "#8A9099", glow: "rgba(138,144,153,.45)" },
  Pagado: { solid: "#3B82F6", glow: "rgba(59,130,246,.45)" },
  "En preparación": { solid: "#8B5CF6", glow: "rgba(139,92,246,.45)" },
  Enviado: { solid: "#F59E0B", glow: "rgba(245,158,11,.45)" },
  Entregado: { solid: "#22C55E", glow: "rgba(34,197,94,.45)" },
};
const FALLBACK_COLOR = STATUS_COLORS["Pendiente de contacto"];

function fecha(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return null;
  }
}

export default function OrderTracker({ order, token }: { order: TrackedOrder; token?: string }) {
  const cancelled = order.status === "Cancelado";
  // Pedidos creados antes de que existiera `kind`: se infiere del status —
  // solo el flujo asistido pasa por "Pendiente de contacto"/"Cotización enviada".
  const kind: "mercadopago" | "asistido" =
    order.kind ?? (order.status === "Pendiente de contacto" || order.status === "Cotización enviada" ? "asistido" : "mercadopago");
  const STEPS = STEPS_BY_KIND[kind];
  const currentIdx = STEPS.indexOf(order.status);
  const created = fecha(order.createdAt);
  const fillPct = cancelled || currentIdx < 0 ? 0 : (currentIdx / (STEPS.length - 1)) * 84;
  const badgeColor = (STATUS_COLORS[order.status] ?? FALLBACK_COLOR).solid;
  const fillColor = badgeColor;

  return (
    <div className="track-card">
      <div className="track-top">
        <div>
          {(order.customerName || order.company || created) && (
            <span style={{ display: "block", color: "var(--steel)", fontSize: ".9rem" }}>
              {[order.customerName, order.company, created].filter(Boolean).join(" · ")}
            </span>
          )}
          {order.city && (
            <span style={{ display: "block", color: "var(--steel)", fontSize: ".82rem", marginTop: 2 }}>
              📍 {order.city}
            </span>
          )}
        </div>
        <span
          className={`track-badge${cancelled ? " cancel" : ""}`}
          style={cancelled ? undefined : { background: badgeColor }}
        >
          {order.status}
        </span>
      </div>

      {order.statusNote && <p className="track-note">“{order.statusNote}”</p>}

      {cancelled ? (
        <p style={{ color: "var(--steel)", marginTop: 16 }}>
          Este pedido fue cancelado. Si crees que es un error, escríbenos por WhatsApp.
        </p>
      ) : (
        <div className="track-steps">
          <div className="track-steps-fill" style={{ width: `${fillPct}%`, background: fillColor }} />
          {STEPS.map((step, i) => {
            const done = currentIdx >= i;
            const current = currentIdx === i;
            const color = STATUS_COLORS[step] ?? FALLBACK_COLOR;
            const stepStyle = {
              "--step-color": color.solid,
              "--step-glow": color.glow,
            } as React.CSSProperties;
            return (
              <div
                key={step}
                className={`track-step${done ? " done" : ""}${current ? " current" : ""}`}
                style={stepStyle}
              >
                <span className="dot">{done ? "✓" : i + 1}</span>
                <span className="lbl">{step}</span>
              </div>
            );
          })}
        </div>
      )}

      {order.items && order.items.length > 0 && (
        <div className="track-items">
          {order.items.map((it, i) => (
            <div className="track-item" key={i}>
              <span>{it.title}{it.qty > 1 ? ` ×${it.qty}` : ""}</span>
              <b>{it.price > 0 ? formatMXN(it.price * it.qty) : "Precio a consultar"}</b>
            </div>
          ))}
          {typeof order.total === "number" && order.total > 0 && (
            <div className="track-item track-total">
              <span>Total</span><b>{formatMXN(order.total)} MXN</b>
            </div>
          )}
        </div>
      )}

      <div className="track-cta">
        {token && (
          <a className="btn btn-amber" href={`/api/orders/${token}/pdf`} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6M9 15h6" />
            </svg>
            Descargar comprobante
          </a>
        )}
        <Link href="/catalogo" className="btn btn-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
            <circle cx="12" cy="12" r="9" /><path d="M9 8l5 4-5 4z" fill="currentColor" stroke="none" />
          </svg>
          Seguir viendo equipo
        </Link>
      </div>
    </div>
  );
}
