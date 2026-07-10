import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { createPendingOrder } from "@/lib/orders";
import { isBuyable, SITE_URL } from "@/lib/config";
import { getPreferenceClient, isMpConfigured } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ ok: false, reason: "missing_slug" }, { status: 400 });
    }

    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    }

    // Blindaje de la regla: solo se compra en línea lo menor a $50k.
    if (!isBuyable(product.price)) {
      return NextResponse.json({ ok: false, reason: "requires_quote" }, { status: 400 });
    }

    // Sin credenciales → el front cae a WhatsApp.
    if (!isMpConfigured) {
      return NextResponse.json({ ok: false, reason: "not_configured" });
    }

    // Crea el pedido pendiente en Sanity (para seguimiento). external_reference lo liga al pago.
    const order = await createPendingOrder([
      { title: `${product.brand} ${product.model}`, price: product.price, qty: 1 },
    ]);
    const orderNumber = order?.orderNumber;
    const token = order?.token;
    const tParam = token ? `&t=${token}` : "";

    // MP exige URLs públicas (https) para auto_return y webhooks.
    // En local (localhost) los omitimos para que el checkout funcione igual.
    const isPublic = SITE_URL.startsWith("https://");

    const preference = getPreferenceClient();
    const result = await preference!.create({
      body: {
        items: [
          {
            id: product.slug,
            title: `${product.brand} ${product.model}`,
            description: product.shortSpec,
            quantity: 1,
            unit_price: product.price,
            currency_id: "MXN",
          },
        ],
        ...(orderNumber ? { external_reference: orderNumber } : {}),
        back_urls: {
          success: `${SITE_URL}/checkout?status=success${tParam}`,
          pending: `${SITE_URL}/checkout?status=pending${tParam}`,
          failure: `${SITE_URL}/checkout?status=failure${tParam}`,
        },
        ...(isPublic
          ? {
              auto_return: "approved" as const,
              notification_url: `${SITE_URL}/api/mercadopago/webhook`,
            }
          : {}),
        statement_descriptor: "ROCCMACH",
        metadata: { slug: product.slug, order_number: orderNumber },
      },
    });

    const url = result.init_point ?? result.sandbox_init_point;
    return NextResponse.json({ ok: true, url, orderNumber, token });
  } catch (err) {
    console.error("[mercadopago/preference] error:", err);
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
