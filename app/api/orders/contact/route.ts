import { NextResponse } from "next/server";
import { createContactOrder } from "@/lib/orders";
import { sendContactOrderConfirmation } from "@/lib/email";

// Crea un pedido "Pendiente de contacto" para la compra asistida (sin checkout en línea):
// le da al cliente folio + link de seguimiento, igual que una compra pagada con Mercado Pago.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, city, productTitle, productPrice } = body ?? {};

    if (!name || !phone || !productTitle) {
      return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    }

    const order = await createContactOrder({
      customerName: String(name).slice(0, 120),
      customerPhone: String(phone).slice(0, 40),
      customerEmail: email ? String(email).slice(0, 160) : undefined,
      company: company ? String(company).slice(0, 160) : undefined,
      city: city ? String(city).slice(0, 160) : undefined,
      productTitle: String(productTitle).slice(0, 160),
      productPrice: typeof productPrice === "number" ? productPrice : undefined,
    });

    if (!order) {
      return NextResponse.json({ ok: true, saved: false });
    }

    if (email) {
      await sendContactOrderConfirmation({
        to: email,
        orderNumber: order.orderNumber,
        token: order.token,
        productTitle: String(productTitle),
        customerName: name,
      });
    }

    return NextResponse.json({ ok: true, saved: true, orderNumber: order.orderNumber, token: order.token });
  } catch (err) {
    console.error("[api/orders/contact] error:", err);
    // Nunca bloqueamos: si falla, el front sigue a WhatsApp sin folio.
    return NextResponse.json({ ok: true, saved: false });
  }
}
