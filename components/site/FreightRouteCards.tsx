"use client";

import type { FreightRouteCard } from "@/lib/freightRoutes";
import { openFreightRouteQuote } from "./freight-route-events";

export default function FreightRouteCards({ routes }: { routes: FreightRouteCard[] }) {
  if (!routes.length) return null;

  return (
    <div className="route-grid">
      {routes.map((r) => (
        <div className="route-card reveal" key={r.slug}>
          <div className="route-from">Desde GDL</div>
          <h3>{r.destino}</h3>
          <button type="button" className="btn btn-red" onClick={() => openFreightRouteQuote(r)}>
            Cotizar ahora →
          </button>
        </div>
      ))}
    </div>
  );
}
