import { NextResponse } from "next/server";
import { createFreightQuote } from "@/lib/freight";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origen, destino, tipoCarga, empaque, pesoNeto, pesoBruto, horarioCarga, horarioDescarga, name, company, phone, email } = body ?? {};

    if (!origen?.calle || !origen?.numero || !origen?.cp || !destino?.calle || !destino?.numero || !destino?.cp) {
      return NextResponse.json({ ok: false, error: "Faltan datos de origen o destino" }, { status: 400 });
    }
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Faltan datos de contacto" }, { status: 400 });
    }

    const quote = await createFreightQuote({
      origen: { calle: String(origen.calle).slice(0, 160), numero: String(origen.numero).slice(0, 20), cp: String(origen.cp).slice(0, 10) },
      destino: { calle: String(destino.calle).slice(0, 160), numero: String(destino.numero).slice(0, 20), cp: String(destino.cp).slice(0, 10) },
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
