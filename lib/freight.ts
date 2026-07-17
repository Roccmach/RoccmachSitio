import "server-only";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { FREIGHT_SETTINGS_QUERY, FREIGHT_QUOTE_BY_TOKEN_QUERY } from "@/sanity/lib/queries";
import { generateToken } from "@/lib/orders";
import { geocodeAddress, getRoadDistanceKm } from "@/lib/geo";

export interface Address {
  ciudad: string;
  cp: string;
}

export type FreightBoxType = "Caja Seca" | "Plana" | "Low Boy";

export interface FreightQuoteInput {
  origen: Address;
  destino: Address;
  tipoCaja: FreightBoxType;
  tipoCarga: string;
  empaque: "Pieza" | "Caja";
  pesoNeto?: number;
  pesoBruto?: number;
  horarioCarga: string;
  horarioDescarga: string;
  customerName: string;
  company?: string;
  customerPhone: string;
  customerEmail?: string;
}

export interface FreightQuoteResult {
  folio: string;
  token: string;
  distanceKm: number;
  distanceSource: "osrm" | "straight-line";
  pricePerKmUsed: number;
  total: number;
}

/** Genera un folio legible de flete: FL-XXXXXX */
function generateFreightFolio(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `FL-${s}`;
}

const fullAddress = (a: Address) => `${a.cp} ${a.ciudad}, México`;

interface FreightSettings {
  pricePerKmCajaSeca?: number;
  pricePerKmPlana?: number;
  pricePerKmLowBoy?: number;
  minCharge?: number;
}

const priceForBoxType = (settings: FreightSettings | null, tipoCaja: FreightBoxType): number => {
  if (!settings) return 0;
  if (tipoCaja === "Caja Seca") return settings.pricePerKmCajaSeca ?? 0;
  if (tipoCaja === "Plana") return settings.pricePerKmPlana ?? 0;
  return settings.pricePerKmLowBoy ?? 0;
};

/**
 * Geocodifica origen/destino (ciudad + CP, suficiente para una cotización aproximada), calcula
 * distancia por carretera (OSRM, con respaldo de línea recta) y aplica el precio/km del tipo de
 * caja elegido (configurado en Sanity) para armar la cotización. Guarda el resultado como un
 * documento "freightQuote" con folio + token para el recibo en PDF.
 */
export async function createFreightQuote(input: FreightQuoteInput): Promise<FreightQuoteResult | null> {
  const settings = await client.fetch<FreightSettings | null>(FREIGHT_SETTINGS_QUERY).catch(() => null);
  const pricePerKm = priceForBoxType(settings, input.tipoCaja);
  const minCharge = settings?.minCharge ?? 0;

  const [origenPt, destinoPt] = await Promise.all([
    geocodeAddress(fullAddress(input.origen)),
    geocodeAddress(fullAddress(input.destino)),
  ]);

  if (!origenPt || !destinoPt) {
    throw new Error("No pudimos ubicar una de las 2 direcciones. Revisa la ciudad y el código postal.");
  }

  const { km, source } = await getRoadDistanceKm(origenPt, destinoPt);
  const distanceKm = Math.round(km * 10) / 10;
  const total = Math.max(Math.round(distanceKm * pricePerKm), minCharge);

  const folio = generateFreightFolio();
  const token = generateToken();

  if (isSanityConfigured) {
    try {
      await writeClient.create({
        _type: "freightQuote",
        folio,
        token,
        status: "Nueva",
        origen: input.origen,
        destino: input.destino,
        tipoCaja: input.tipoCaja,
        tipoCarga: input.tipoCarga,
        empaque: input.empaque,
        pesoNeto: input.pesoNeto,
        pesoBruto: input.pesoBruto,
        horarioCarga: input.horarioCarga,
        horarioDescarga: input.horarioDescarga,
        customerName: input.customerName,
        company: input.company,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        distanceKm,
        distanceSource: source,
        pricePerKmUsed: pricePerKm,
        total,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[freight] createFreightQuote save error:", err);
    }
  }

  return { folio, token, distanceKm, distanceSource: source, pricePerKmUsed: pricePerKm, total };
}

export interface TrackedFreightQuote {
  folio: string;
  status: string;
  origen: Address;
  destino: Address;
  tipoCaja: FreightBoxType;
  tipoCarga: string;
  empaque: string;
  pesoNeto?: number;
  pesoBruto?: number;
  horarioCarga: string;
  horarioDescarga: string;
  customerName?: string;
  company?: string;
  distanceKm: number;
  distanceSource: string;
  pricePerKmUsed: number;
  total: number;
  createdAt: string;
}

export async function getFreightQuoteByToken(token: string): Promise<TrackedFreightQuote | null> {
  if (!isSanityConfigured) return null;
  try {
    const data = await client.fetch<TrackedFreightQuote | null>(FREIGHT_QUOTE_BY_TOKEN_QUERY, { t: token });
    return data ?? null;
  } catch {
    return null;
  }
}
