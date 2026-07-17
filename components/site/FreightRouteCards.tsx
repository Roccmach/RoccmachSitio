"use client";

import type { FreightRouteCard } from "@/lib/freightRoutes";
import { openFreightRouteQuote } from "./freight-route-events";

const ROUTE_IMAGES: Record<string, string> = {
  tijuana: "/routes/tijuana.jpg",
  mexicali: "/routes/mexicali.jpg",
  hermosillo: "/routes/hermosillo.jpg",
  "cd-obregon": "/routes/cd-obregon.jpg",
  "los-mochis": "/routes/los-mochis.jpg",
  culiacan: "/routes/culiacan.jpg",
  mazatlan: "/routes/mazatlan.jpg",
  tepic: "/routes/tepic.jpg",
};

export default function FreightRouteCards({ routes }: { routes: FreightRouteCard[] }) {
  if (!routes.length) return null;

  return (
    <div className="route-grid">
      {routes.map((r) => (
        <div className="route-card reveal" key={r.slug}>
          <div
            className="route-media"
            style={ROUTE_IMAGES[r.slug] ? { backgroundImage: `url(${ROUTE_IMAGES[r.slug]})` } : undefined}
            role={ROUTE_IMAGES[r.slug] ? "img" : undefined}
            aria-label={ROUTE_IMAGES[r.slug] ? `Vista de ${r.destino}` : undefined}
          >
            <div className="route-from">Desde GDL</div>
            <h3>{r.destino}</h3>
          </div>
          <div className="route-foot">
            <button
              type="button"
              className="btn btn-red"
              aria-label={`Cotizar flete desde Guadalajara a ${r.destino}`}
              onClick={() => openFreightRouteQuote(r)}
            >
              Cotizar ahora →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
