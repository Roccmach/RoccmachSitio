import { NextResponse } from "next/server";
import { sendStatusUpdate } from "@/lib/email";

// Lo llama un webhook de Sanity cuando cambia un pedido.
// Configúralo en manage → API → Webhooks: filtro _type == "order",
// proyección { orderNumber, token, status, statusNote, customerEmail }.
export async function POST(request: Request) {
  try {
    // Seguridad opcional: ?secret=... debe coincidir con SANITY_WEBHOOK_SECRET.
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (secret) {
      const url = new URL(request.url);
      if (url.searchParams.get("secret") !== secret) {
        return NextResponse.json({ ok: false }, { status: 401 });
      }
    }

    const body = await request.json().catch(() => ({}));
    const { orderNumber, token, status, statusNote, customerEmail } = body ?? {};

    // Solo notificamos estatus de avance (no "Pendiente de pago").
    const notifiable = ["Pagado", "En preparación", "Enviado", "Entregado", "Cancelado"];
    if (customerEmail && token && orderNumber && notifiable.includes(status)) {
      await sendStatusUpdate({ to: customerEmail, orderNumber, token, status, statusNote });
      return NextResponse.json({ ok: true, sent: true });
    }

    return NextResponse.json({ ok: true, sent: false });
  } catch (err) {
    console.error("[api/notify] error:", err);
    return NextResponse.json({ ok: true, sent: false });
  }
}
