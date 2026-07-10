import { defineField, defineType } from "sanity";

export const ORDER_STATUSES = [
  "Pendiente de contacto",
  "Pendiente de pago",
  "Pagado",
  "En preparación",
  "Enviado",
  "Entregado",
  "Cancelado",
] as const;

export const order = defineType({
  name: "order",
  title: "Pedido",
  type: "document",
  fields: [
    defineField({ name: "orderNumber", title: "Número de pedido", type: "string", readOnly: true }),
    defineField({ name: "token", title: "Token de seguimiento", type: "string", readOnly: true, hidden: true }),
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
    select: { title: "orderNumber", subtitle: "status", customer: "customerName", total: "total" },
    prepare: ({ title, subtitle, customer, total }) => ({
      title: `${title}${customer ? " · " + customer : ""}`,
      subtitle: `${subtitle}${total ? " · $" + total.toLocaleString("es-MX") : ""}`,
    }),
  },
});
