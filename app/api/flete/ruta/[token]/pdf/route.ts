import { renderToBuffer } from "@react-pdf/renderer";
import { getFreightRouteQuoteByToken } from "@/lib/freightRoutes";
import { FreightRoutePdf } from "@/lib/pdf/FreightRoutePdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const quote = await getFreightRouteQuoteByToken(token);

  if (!quote) {
    return new Response("Cotización no encontrada", { status: 404 });
  }

  const buffer = await renderToBuffer(FreightRoutePdf({ quote }));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ROCCMACH-Flete-${quote.folio}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
