import "server-only";
import { Resend } from "resend";
import { BRAND, SITE_URL, formatMXN } from "@/lib/config";

export const isEmailConfigured = !!process.env.RESEND_API_KEY;

// Para pruebas Resend permite enviar desde onboarding@resend.dev.
// Al verificar un dominio, cámbialo por algo como "ROCCMACH <pedidos@tudominio.mx>".
const FROM = process.env.RESEND_FROM || "ROCCMACH <onboarding@resend.dev>";

let resend: Resend | null = null;
function getResend() {
  if (!isEmailConfigured) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function shell(title: string, bodyHtml: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0B0B0C">
    <div style="background:#0B0B0C;padding:22px 28px">
      <span style="font-size:22px;font-weight:bold;font-style:italic;color:#fff">ROCC<span style="color:#E4151F">MACH</span></span>
      <div style="font-size:8px;letter-spacing:3px;color:#8A9099;margin-top:2px">MAQUINARIA INDUSTRIAL</div>
    </div>
    <div style="height:4px;background:#E4151F"></div>
    <div style="padding:30px 28px">
      <h1 style="font-size:22px;margin:0 0 14px">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #eee;font-size:12px;color:#6B7178">
      ROCCMACH · ${BRAND.city} · WhatsApp +${BRAND.whatsapp}
    </div>
  </div>`;
}

function trackButton(token: string) {
  return `<a href="${SITE_URL}/seguimiento/${token}" style="display:inline-block;background:#E4151F;color:#fff;text-decoration:none;font-weight:bold;padding:14px 26px;border-radius:8px;margin:10px 0">Seguir mi pedido →</a>`;
}

export async function sendOrderConfirmation(opts: {
  to: string; orderNumber: string; token: string; total?: number; customerName?: string;
}) {
  const r = getResend();
  if (!r || !opts.to) return;
  try {
    await r.emails.send({
      from: FROM,
      to: opts.to,
      subject: `Pedido confirmado · ${opts.orderNumber}`,
      html: shell("¡Gracias por tu compra! 🎉", `
        <p>${opts.customerName ? `Hola ${opts.customerName}, ` : ""}recibimos tu pago y estamos preparando tu equipo.</p>
        <p style="font-size:14px;color:#6B7178">Número de pedido</p>
        <p style="font-size:24px;font-weight:bold;color:#E4151F;margin:0 0 6px">${opts.orderNumber}</p>
        ${typeof opts.total === "number" ? `<p><b>Total:</b> ${formatMXN(opts.total)} MXN</p>` : ""}
        <p>${trackButton(opts.token)}</p>
        <p style="font-size:13px;color:#6B7178">Te avisaremos por aquí cuando tu pedido avance.</p>
      `),
    });
  } catch (err) {
    console.error("[email] confirmation error:", err);
  }
}

/** Confirmación para la compra asistida (sin pago aún, distinto copy al de pago confirmado). */
export async function sendContactOrderConfirmation(opts: {
  to: string; orderNumber: string; token: string; productTitle: string; customerName?: string;
}) {
  const r = getResend();
  if (!r || !opts.to) return;
  try {
    await r.emails.send({
      from: FROM,
      to: opts.to,
      subject: `Solicitud recibida · ${opts.orderNumber}`,
      html: shell("¡Recibimos tu solicitud! 🔧", `
        <p>${opts.customerName ? `Hola ${opts.customerName}, ` : ""}gracias por tu interés en <b>${opts.productTitle}</b>.</p>
        <p style="font-size:14px;color:#6B7178">Número de pedido</p>
        <p style="font-size:24px;font-weight:bold;color:#E4151F;margin:0 0 6px">${opts.orderNumber}</p>
        <p>Nuestro equipo comercial te contactará en breve para coordinar pago y entrega.</p>
        <p>${trackButton(opts.token)}</p>
        <p style="font-size:13px;color:#6B7178">Ahí verás el estatus de tu pedido en tiempo real.</p>
      `),
    });
  } catch (err) {
    console.error("[email] contact order confirmation error:", err);
  }
}

/** Confirmación de cotización de flete por ruta fija (precio pactado, no calculado). */
export async function sendFreightRouteConfirmation(opts: {
  to: string; folio: string; token: string; destino: string; boxType: string; total: number; customerName?: string;
}) {
  const r = getResend();
  if (!r || !opts.to) return;
  const pdfUrl = `${SITE_URL}/api/flete/ruta/${opts.token}/pdf`;
  try {
    await r.emails.send({
      from: FROM,
      to: opts.to,
      subject: `Cotización de flete · ${opts.folio}`,
      html: shell("¡Tu cotización de flete está lista! 🚛", `
        <p>${opts.customerName ? `Hola ${opts.customerName}, ` : ""}gracias por cotizar tu flete con ROCCMACH.</p>
        <p style="font-size:14px;color:#6B7178">Folio</p>
        <p style="font-size:24px;font-weight:bold;color:#E4151F;margin:0 0 6px">${opts.folio}</p>
        <p><b>Ruta:</b> Guadalajara → ${opts.destino}</p>
        <p><b>Tipo de caja:</b> ${opts.boxType}</p>
        <p><b>Precio pactado:</b> ${formatMXN(opts.total)} MXN</p>
        <p><a href="${pdfUrl}" style="display:inline-block;background:#E4151F;color:#fff;text-decoration:none;font-weight:bold;padding:14px 26px;border-radius:8px;margin:10px 0">Descargar cotización PDF →</a></p>
        <p style="font-size:13px;color:#6B7178">Nuestro equipo comercial te contactará para coordinar fecha y horarios.</p>
      `),
    });
  } catch (err) {
    console.error("[email] freight route confirmation error:", err);
  }
}

export async function sendStatusUpdate(opts: {
  to: string; orderNumber: string; token: string; status: string; statusNote?: string;
}) {
  const r = getResend();
  if (!r || !opts.to) return;
  try {
    await r.emails.send({
      from: FROM,
      to: opts.to,
      subject: `Tu pedido ${opts.orderNumber}: ${opts.status}`,
      html: shell(`Tu pedido va: ${opts.status}`, `
        <p>Actualizamos el estatus de tu pedido <b>${opts.orderNumber}</b>.</p>
        <p style="font-size:20px;font-weight:bold;color:#E4151F">${opts.status}</p>
        ${opts.statusNote ? `<p style="font-style:italic;border-left:3px solid #E4151F;padding-left:12px;color:#333">${opts.statusNote}</p>` : ""}
        <p>${trackButton(opts.token)}</p>
      `),
    });
  } catch (err) {
    console.error("[email] status update error:", err);
  }
}
