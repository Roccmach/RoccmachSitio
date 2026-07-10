import Link from "next/link";
import { formatMXN } from "@/lib/config";
import type { TrackedOrder } from "@/lib/products";

const STEPS = ["Pagado", "En preparación", "Enviado", "Entregado"];
// Un color distinto por paso (en vez de rojo parejo) — azul→morado→ámbar→verde,
// se usa igual para el círculo, la barra y el chip de estatus de arriba.
const STEP_COLORS = [
  { solid: "#3B82F6", glow: "rgba(59,130,246,.45)" },
  { solid: "#8B5CF6", glow: "rgba(139,92,246,.45)" },
  { solid: "#F59E0B", glow: "rgba(245,158,11,.45)" },
  { solid: "#22C55E", glow: "rgba(34,197,94,.45)" },
];

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
  const currentIdx = STEPS.indexOf(order.status);
  const created = fecha(order.createdAt);
  const fillPct = cancelled ? 0 : (currentIdx / (STEPS.length - 1)) * 84;
  const badgeColor = STEP_COLORS[currentIdx]?.solid ?? STEP_COLORS[0].solid;
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
            const stepStyle = {
              "--step-color": STEP_COLORS[i].solid,
              "--step-glow": STEP_COLORS[i].glow,
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
