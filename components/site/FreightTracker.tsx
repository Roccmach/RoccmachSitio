import Link from "next/link";
import { formatMXN } from "@/lib/config";

const STEPS = ["Nueva", "Contactado", "Programada", "En tránsito", "Entregada"];

const STATUS_COLORS: Record<string, { solid: string; glow: string }> = {
  Nueva: { solid: "#8A9099", glow: "rgba(138,144,153,.45)" },
  Contactado: { solid: "#06B6D4", glow: "rgba(6,182,212,.45)" },
  Programada: { solid: "#8B5CF6", glow: "rgba(139,92,246,.45)" },
  "En tránsito": { solid: "#F59E0B", glow: "rgba(245,158,11,.45)" },
  Entregada: { solid: "#22C55E", glow: "rgba(34,197,94,.45)" },
};
const FALLBACK_COLOR = STATUS_COLORS.Nueva;

function fecha(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return null;
  }
}

interface Detail {
  label: string;
  value: string;
}

/** Seguimiento para ambos tipos de cotización de flete (por distancia y rutas fijas) — la
 * página arma los `details` según el tipo, este componente solo pinta el stepper genérico. */
export default function FreightTracker({
  status,
  statusNote,
  customerName,
  company,
  createdAt,
  total,
  totalLabel = "Total",
  details,
  pdfHref,
}: {
  status: string;
  statusNote?: string;
  customerName?: string;
  company?: string;
  createdAt?: string;
  total?: number;
  totalLabel?: string;
  details: Detail[];
  pdfHref?: string;
}) {
  const cancelled = status === "Cancelada";
  const currentIdx = STEPS.indexOf(status);
  const created = fecha(createdAt);
  const fillPct = cancelled || currentIdx < 0 ? 0 : (currentIdx / (STEPS.length - 1)) * 84;
  const badgeColor = (STATUS_COLORS[status] ?? FALLBACK_COLOR).solid;

  return (
    <div className="track-card">
      <div className="track-top">
        <div>
          {(customerName || company || created) && (
            <span style={{ display: "block", color: "var(--steel)", fontSize: ".9rem" }}>
              {[customerName, company, created].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
        <span
          className={`track-badge${cancelled ? " cancel" : ""}`}
          style={cancelled ? undefined : { background: badgeColor }}
        >
          {status}
        </span>
      </div>

      {statusNote && <p className="track-note">“{statusNote}”</p>}

      {cancelled ? (
        <p style={{ color: "var(--steel)", marginTop: 16 }}>
          Esta cotización fue cancelada. Si crees que es un error, escríbenos por WhatsApp.
        </p>
      ) : (
        <div className="track-steps">
          <div className="track-steps-fill" style={{ width: `${fillPct}%`, background: badgeColor }} />
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

      <div className="track-items">
        {details.map((d, i) => (
          <div className="track-item" key={i}>
            <span>{d.label}</span>
            <b>{d.value}</b>
          </div>
        ))}
        {typeof total === "number" && total > 0 && (
          <div className="track-item track-total">
            <span>{totalLabel}</span>
            <b>{formatMXN(total)} MXN</b>
          </div>
        )}
      </div>

      <div className="track-cta">
        {pdfHref && (
          <a className="btn btn-amber" href={pdfHref} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6M9 15h6" />
            </svg>
            Descargar PDF
          </a>
        )}
        <Link href="/transporte-de-carga" className="btn btn-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 15, height: 15 }}>
            <circle cx="12" cy="12" r="9" /><path d="M9 8l5 4-5 4z" fill="currentColor" stroke="none" />
          </svg>
          Ver más de transporte
        </Link>
      </div>
    </div>
  );
}
