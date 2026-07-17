import "server-only";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  FREIGHT_ROUTES_QUERY,
  FREIGHT_ROUTE_BY_SLUG_QUERY,
  FREIGHT_ROUTE_QUOTE_BY_TOKEN_QUERY,
} from "@/sanity/lib/queries";
import { generateToken } from "@/lib/orders";

export type BoxType = "Caja Seca" | "Plana" | "Low Boy";

export interface FreightRouteCard {
  destino: string;
  slug: string;
}

/** Rutas para las tarjetas — solo nombre/slug, jamás precio (eso se revela hasta cotizar). */
export async function getFreightRoutes(): Promise<FreightRouteCard[]> {
  if (!isSanityConfigured) return [];
  try {
    const data = await client.fetch<FreightRouteCard[]>(FREIGHT_ROUTES_QUERY);
    return data ?? [];
  } catch {
    return [];
  }
}

interface RoutePrices {
  destino: string;
  precioCajaSeca: number;
  precioPlana: number;
  precioLowBoy: number;
}

const priceFor = (route: RoutePrices, boxType: BoxType) =>
  boxType === "Caja Seca" ? route.precioCajaSeca : boxType === "Plana" ? route.precioPlana : route.precioLowBoy;

function generateRouteFolio(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `FR-${s}`;
}

export interface FreightRouteQuoteInput {
  routeSlug: string;
  boxType: BoxType;
  customerName: string;
  company?: string;
  customerPhone: string;
  customerEmail?: string;
}

export interface FreightRouteQuoteResult {
  folio: string;
  token: string;
  destino: string;
  boxType: BoxType;
  total: number;
}

/** Busca el precio pactado en Sanity (server-side, nunca expuesto antes de este punto) y arma
 * la cotización con folio + token para el recibo en PDF y el correo de confirmación. */
export async function createFreightRouteQuote(input: FreightRouteQuoteInput): Promise<FreightRouteQuoteResult> {
  const route = await client.fetch<RoutePrices | null>(FREIGHT_ROUTE_BY_SLUG_QUERY, { slug: input.routeSlug });
  if (!route) {
    throw new Error("No encontramos esa ruta. Intenta de nuevo.");
  }

  const total = priceFor(route, input.boxType);
  const folio = generateRouteFolio();
  const token = generateToken();

  if (isSanityConfigured) {
    try {
      await writeClient.create({
        _type: "freightRouteQuote",
        folio,
        token,
        status: "Nueva",
        destino: route.destino,
        tipoCaja: input.boxType,
        total,
        customerName: input.customerName,
        company: input.company,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[freightRoutes] createFreightRouteQuote save error:", err);
    }
  }

  return { folio, token, destino: route.destino, boxType: input.boxType, total };
}

export interface TrackedFreightRouteQuote {
  folio: string;
  status: string;
  destino: string;
  tipoCaja: string;
  total: number;
  customerName?: string;
  company?: string;
  createdAt: string;
}

export async function getFreightRouteQuoteByToken(token: string): Promise<TrackedFreightRouteQuote | null> {
  if (!isSanityConfigured) return null;
  try {
    const data = await client.fetch<TrackedFreightRouteQuote | null>(FREIGHT_ROUTE_QUOTE_BY_TOKEN_QUERY, { t: token });
    return data ?? null;
  } catch {
    return null;
  }
}
