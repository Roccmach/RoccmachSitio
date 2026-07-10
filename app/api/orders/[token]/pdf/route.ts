import { renderToBuffer } from "@react-pdf/renderer";
import { getOrderByToken } from "@/lib/products";
import { OrderPdf } from "@/lib/pdf/OrderPdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  if (!order) {
    return new Response("Pedido no encontrado", { status: 404 });
  }

  const buffer = await renderToBuffer(OrderPdf({ order }));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ROCCMACH-${order.orderNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
