"use client";

import { useState } from "react";
import { waLink } from "@/lib/config";

export default function BuyButton({
  slug,
  label = "Comprar ahora",
}: {
  slug: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (data.ok && data.url) {
        window.location.href = data.url; // → Checkout Pro
        return;
      }

      // Sin credenciales aún → fallback a WhatsApp para no perder la venta.
      if (data.reason === "not_configured") {
        window.open(waLink(`Hola ROCCMACH, quiero comprar el equipo ${slug}`), "_blank");
        return;
      }

      setError("No pudimos iniciar el pago. Intenta por WhatsApp.");
    } catch {
      setError("No pudimos iniciar el pago. Intenta por WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-green" onClick={buy} disabled={loading}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
        {loading ? "Redirigiendo…" : label}
      </button>
      {error && <p style={{ color: "var(--red)", fontSize: ".85rem", marginTop: 8 }}>{error}</p>}
    </>
  );
}
