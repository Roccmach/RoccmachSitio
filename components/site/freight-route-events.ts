export const FREIGHT_ROUTE_EVENT = "roccmach:open-freight-route-quote";

export interface FreightRoutePrefill {
  slug: string;
  destino: string;
}

/** Abre el modal de cotización de ruta fija con la ciudad ya elegida (client-side). */
export function openFreightRouteQuote(route: FreightRoutePrefill) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FREIGHT_ROUTE_EVENT, { detail: route }));
  }
}
