import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { isMpConfigured } from "@/lib/mercadopago";
import { markOrderPaid } from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/email";

// Mercado Pago notifica aquí cuando cambia un pago. Consultamos el pago,
// y si fue aprobado, marcamos el pedido como Pagado en Sanity.
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({} as Record<string, unknown>));

    // MP manda el id del pago por query (?data.id=) o en el body.
    const paymentId =
      url.searchParams.get("data.id") ||
      url.searchParams.get("id") ||
      (body as { data?: { id?: string } })?.data?.id ||
      (body as { id?: string })?.id;

    const type = url.searchParams.get("type") || (body as { type?: string })?.type;

    if (!paymentId || (type && type !== "payment") || !isMpConfigured) {
      return NextResponse.json({ received: true });
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });
    const payment = await new Payment(client).get({ id: String(paymentId) });

    const orderNumber = payment.external_reference || payment.metadata?.order_number;
    if (orderNumber && payment.status === "approved") {
      const customerName =
        [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(" ") || undefined;
      const email = payment.payer?.email || undefined;

      const result = await markOrderPaid(String(orderNumber), {
        mpPaymentId: String(payment.id),
        mpStatus: payment.status,
        customerName,
        customerEmail: email,
      });

      if (result?.token && email) {
        await sendOrderConfirmation({
          to: email,
          orderNumber: String(orderNumber),
          token: result.token,
          total: result.total,
          customerName,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[mercadopago/webhook] error:", err);
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
