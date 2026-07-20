import "server-only";
import { getFreightQuoteByToken, type TrackedFreightQuote } from "@/lib/freight";
import { getFreightRouteQuoteByToken, type TrackedFreightRouteQuote } from "@/lib/freightRoutes";

export type TrackedFreight =
  | { kind: "cotizacion"; data: TrackedFreightQuote }
  | { kind: "ruta"; data: TrackedFreightRouteQuote };

/** Un token de flete puede ser de una cotización por distancia (freightQuote) o de una ruta
 * fija ("Rutas del Pacífico", freightRouteQuote) — se intenta cada tipo hasta encontrarlo. */
export async function getFreightByToken(token: string): Promise<TrackedFreight | null> {
  const quote = await getFreightQuoteByToken(token);
  if (quote) return { kind: "cotizacion", data: quote };
  const route = await getFreightRouteQuoteByToken(token);
  if (route) return { kind: "ruta", data: route };
  return null;
}
