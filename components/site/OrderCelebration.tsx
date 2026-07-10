"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const COLORS = ["#0E7C3A", "#22C55E", "#7CE3A6", "#0B5C2A", "#B6F2CE"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 2.4 + Math.random() * 1.8,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
      })),
    []
  );
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Confeti + felicitación en el primer aterrizaje a /seguimiento/[token] justo después de
 * completar una compra (MP o compra asistida) — ambos flujos agregan ?welcome=1 al link.
 * Se limpia el query param al mostrarse para que un refresh no lo repita. */
export default function OrderCelebration({ orderNumber }: { orderNumber?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "1") {
      setOpen(true);
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  return createPortal(
    <div className="celebration-overlay" role="dialog" aria-modal="true" aria-label="Pedido confirmado">
      <Confetti />
      <div className="celebration-card">
        <div className="celebration-check">✓</div>
        <h2 className="display">¡Pedido confirmado!</h2>
        <p>
          {orderNumber ? (
            <>
              Tu pedido <b>{orderNumber}</b> quedó registrado.{" "}
            </>
          ) : null}
          Nuestro equipo ya está en contacto para coordinar todo. ¡Gracias por confiar en ROCCMACH!
        </p>
        <button type="button" className="btn btn-green" onClick={() => setOpen(false)}>
          Ver mi pedido →
        </button>
      </div>
    </div>,
    document.body
  );
}
