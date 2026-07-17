import { NextResponse } from "next/server";
import { createFreightRouteQuote, type BoxType } from "@/lib/freightRoutes";
import { sendFreightRouteConfirmation } from "@/lib/email";

const BOX_TYPES: BoxType[] = ["Caja Seca", "Plana", "Low Boy"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { routeSlug, boxType, name, company, phone, email } = body ?? {};

    if (!routeSlug || !BOX_TYPES.includes(boxType)) {
      return NextResponse.json({ ok: false, error: "Faltan datos de la ruta" }, { status: 400 });
    }
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Faltan datos de contacto" }, { status: 400 });
    }

    const quote = await createFreightRouteQuote({
      routeSlug: String(routeSlug),
      boxType,
      customerName: String(name).slice(0, 120),
      company: company ? String(company).slice(0, 160) : undefined,
      customerPhone: String(phone).slice(0, 40),
      customerEmail: email ? String(email).slice(0, 160) : undefined,
    });

    if (email) {
      await sendFreightRouteConfirmation({
        to: String(email),
        folio: quote.folio,
        token: quote.token,
        destino: quote.destino,
        boxType: quote.boxType,
        total: quote.total,
        customerName: name,
      });
    }

    return NextResponse.json({ ok: true, ...quote });
  } catch (err) {
    console.error("[api/flete/ruta/quote] error:", err);
    const message = err instanceof Error ? err.message : "No se pudo generar la cotización";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
