import "server-only";
import { writeClient } from "@/sanity/lib/writeClient";
import { isSanityConfigured } from "@/sanity/env";

export interface OrderItem {
  title: string;
  price: number;
  qty: number;
}

/** Genera un número de pedido legible: RM-XXXXXX */
export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RM-${s}`;
}

/** Token secreto para la URL única de seguimiento (no adivinable). */
export function generateToken(): string {
  const a = crypto.randomUUID().replace(/-/g, "");
  return a.slice(0, 24);
}

export interface CreatedOrder {
  orderNumber: string;
  token: string;
}

/** Crea un pedido pendiente de pago. Devuelve {orderNumber, token} (o null si Sanity no está). */
export async function createPendingOrder(items: OrderItem[]): Promise<CreatedOrder | null> {
  if (!isSanityConfigured) return null;
  const orderNumber = generateOrderNumber();
  const token = generateToken();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  try {
    await writeClient.create({
      _type: "order",
      orderNumber,
      token,
      kind: "mercadopago",
      status: "Pendiente de pago",
      items: items.map((i, idx) => ({ _key: `it${idx}`, ...i })),
      total,
      createdAt: new Date().toISOString(),
    });
    return { orderNumber, token };
  } catch (err) {
    console.error("[orders] createPendingOrder error:", err);
    return null;
  }
}

export interface ContactOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  company?: string;
  city?: string;
  productTitle: string;
  productPrice?: number;
}

/**
 * Crea un pedido "Pendiente de contacto" para la compra asistida (equipos ≥$50k o sin
 * checkout en línea): no hay pago aún, pero el cliente recibe folio + link de seguimiento
 * igual que en una compra real, y el equipo de ventas lo atiende desde Sanity.
 */
export async function createContactOrder(input: ContactOrderInput): Promise<CreatedOrder | null> {
  if (!isSanityConfigured) return null;
  const orderNumber = generateOrderNumber();
  const token = generateToken();
  const price = input.productPrice ?? 0;
  try {
    await writeClient.create({
      _type: "order",
      orderNumber,
      token,
      kind: "asistido",
      status: "Pendiente de contacto",
      statusNote: "Recibimos tu solicitud. Nuestro equipo comercial te contactará en breve para coordinar tu compra.",
      customerName: input.customerName,
      company: input.company,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      city: input.city,
      items: [{ _key: "it0", title: input.productTitle, price, qty: 1 }],
      total: price,
      createdAt: new Date().toISOString(),
    });
    return { orderNumber, token };
  } catch (err) {
    console.error("[orders] createContactOrder error:", err);
    return null;
  }
}

/** Marca un pedido como pagado (desde el webhook de MP). Devuelve datos para el correo. */
export async function markOrderPaid(
  orderNumber: string,
  info: { mpPaymentId?: string; mpStatus?: string; customerName?: string; customerEmail?: string; customerPhone?: string }
): Promise<{ token?: string; total?: number; customerName?: string } | null> {
  if (!isSanityConfigured) return null;
  try {
    const existing = await writeClient.fetch<{ _id: string; token?: string; total?: number } | null>(
      `*[_type == "order" && orderNumber == $n][0]{_id, token, total}`,
      { n: orderNumber }
    );
    if (!existing?._id) return null;
    await writeClient
      .patch(existing._id)
      .set({
        status: "Pagado",
        mpPaymentId: info.mpPaymentId,
        mpStatus: info.mpStatus,
        ...(info.customerName ? { customerName: info.customerName } : {}),
        ...(info.customerEmail ? { customerEmail: info.customerEmail } : {}),
        ...(info.customerPhone ? { customerPhone: info.customerPhone } : {}),
      })
      .commit();
    return { token: existing.token, total: existing.total, customerName: info.customerName };
  } catch (err) {
    console.error("[orders] markOrderPaid error:", err);
    return null;
  }
}
