import { NextResponse } from "next/server";
import { createFreightQuote, type FreightBoxType } from "@/lib/freight";

const BOX_TYPES: FreightBoxType[] = ["Caja Seca", "Plana", "Low Boy"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origen, destino, tipoCaja, tipoCarga, empaque, pesoNeto, pesoBruto, horarioCarga, horarioDescarga, name, company, phone, email } = body ?? {};

    if (!origen?.ciudad || !origen?.cp || !destino?.ciudad || !destino?.cp) {
      return NextResponse.json({ ok: false, error: "Faltan datos de origen o destino" }, { status: 400 });
    }
    if (!BOX_TYPES.includes(tipoCaja)) {
      return NextResponse.json({ ok: false, error: "Falta el tipo de caja" }, { status: 400 });
    }
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Faltan datos de contacto" }, { status: 400 });
    }

    const quote = await createFreightQuote({
      origen: { ciudad: String(origen.ciudad).slice(0, 120), cp: String(origen.cp).slice(0, 10) },
      destino: { ciudad: String(destino.ciudad).slice(0, 120), cp: String(destino.cp).slice(0, 10) },
      tipoCaja: tipoCaja as FreightBoxType,
      tipoCarga: String(tipoCarga || "").slice(0, 160),
      empaque: empaque === "Caja" ? "Caja" : "Pieza",
      pesoNeto: typeof pesoNeto === "number" ? pesoNeto : undefined,
      pesoBruto: typeof pesoBruto === "number" ? pesoBruto : undefined,
      horarioCarga: String(horarioCarga || "").slice(0, 80),
      horarioDescarga: String(horarioDescarga || "").slice(0, 80),
      customerName: String(name).slice(0, 120),
      company: company ? String(company).slice(0, 160) : undefined,
      customerPhone: String(phone).slice(0, 40),
      customerEmail: email ? String(email).slice(0, 160) : undefined,
    });

    if (!quote) {
      return NextResponse.json({ ok: false, error: "No se pudo calcular la cotización" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, ...quote });
  } catch (err) {
    console.error("[api/flete/quote] error:", err);
    const message = err instanceof Error ? err.message : "No se pudo calcular la cotización";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
