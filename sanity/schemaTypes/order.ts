import { defineField, defineType } from "sanity";

export const ORDER_STATUSES = [
  "Pendiente de contacto",
  "Cotización enviada",
  "Pendiente de pago",
  "Pagado",
  "En preparación",
  "Enviado",
  "Entregado",
  "Cancelado",
] as const;

// "mercadopago" = compra en línea (<$50k, pago inmediato). "asistido" = compra
// asistida (≥$50k, sin checkout — negociación y pago coordinados por ventas).
// Se pone solo al crearse el pedido (createPendingOrder/createContactOrder);
// nunca lo cambia el equipo a mano.
export const ORDER_KINDS = ["mercadopago", "asistido"] as const;
const ORDER_KIND_LABELS: Record<(typeof ORDER_KINDS)[number], string> = {
  mercadopago: "MercadoPago",
  asistido: "Compra asistida (+$50k)",
};

export const order = defineType({
  name: "order",
  title: "Pedido",
  type: "document",
  fields: [
    defineField({ name: "orderNumber", title: "Número de pedido", type: "string", readOnly: true }),
    defineField({ name: "token", title: "Token de seguimiento", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "kind",
      title: "Tipo de pedido",
      type: "string",
      options: { list: ORDER_KINDS.map((k) => ({ title: ORDER_KIND_LABELS[k], value: k })) },
      readOnly: true,
      description: "Se asigna solo al crearse el pedido, según venga de MercadoPago o del formulario de compra asistida.",
    }),
    defineField({
      name: "status",
      title: "Estatus",
      type: "string",
      options: { list: [...ORDER_STATUSES], layout: "dropdown" },
      initialValue: "Pendiente de contacto",
      description: "Cámbialo conforme avanza el pedido. El cliente lo ve en su seguimiento.",
    }),
    defineField({
      name: "statusNote",
      title: "Nota para el cliente",
      type: "string",
      description: "Mensaje visible en el seguimiento. Ej: 'En camino, llega el martes'.",
    }),
    defineField({ name: "customerName", title: "Cliente", type: "string" }),
    defineField({ name: "company", title: "Empresa", type: "string" }),
    defineField({ name: "customerPhone", title: "Teléfono", type: "string" }),
    defineField({ name: "customerEmail", title: "Correo", type: "string" }),
    defineField({ name: "city", title: "Ciudad / Estado", type: "string" }),
    defineField({
      name: "items",
      title: "Equipos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Equipo", type: "string" },
            { name: "price", title: "Precio", type: "number" },
            { name: "qty", title: "Cantidad", type: "number" },
          ],
          preview: { select: { title: "title", subtitle: "price" } },
        },
      ],
    }),
    defineField({ name: "total", title: "Total (MXN)", type: "number" }),
    defineField({ name: "mpPaymentId", title: "ID de pago (MP)", type: "string", readOnly: true }),
    defineField({ name: "mpStatus", title: "Estatus MP", type: "string", readOnly: true }),
    defineField({ name: "adminNotes", title: "Notas internas", type: "text", rows: 3 }),
    defineField({ name: "createdAt", title: "Fecha", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Más recientes", name: "recent", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "orderNumber", subtitle: "status", customer: "customerName", total: "total", kind: "kind" },
    prepare: ({ title, subtitle, customer, total, kind }) => ({
      title: `${title}${customer ? " · " + customer : ""}`,
      subtitle: `${kind ? `[${ORDER_KIND_LABELS[kind as (typeof ORDER_KINDS)[number]] ?? kind}] ` : ""}${subtitle}${total ? " · $" + total.toLocaleString("es-MX") : ""}`,
    }),
  },
});
