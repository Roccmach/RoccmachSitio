import { defineField, defineType } from "sanity";

export const FREIGHT_ROUTE_STATUSES = ["Nueva", "Contactado", "Programada", "En tránsito", "Entregada", "Cancelada"] as const;

export const freightRouteQuote = defineType({
  name: "freightRouteQuote",
  title: "Cotización de ruta",
  type: "document",
  description: "Cotizaciones generadas desde las tarjetas de rutas fijas en /flete.",
  fields: [
    defineField({ name: "folio", title: "Folio", type: "string", readOnly: true }),
    defineField({ name: "token", title: "Token", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "status",
      title: "Estatus",
      type: "string",
      options: { list: [...FREIGHT_ROUTE_STATUSES], layout: "dropdown" },
      initialValue: "Nueva",
      description: "Cámbialo conforme avanza el envío. El cliente lo ve en su seguimiento.",
    }),
    defineField({
      name: "statusNote",
      title: "Nota para el cliente",
      type: "string",
      description: "Mensaje visible en el seguimiento. Ej: 'Recogemos el martes a las 9am'.",
    }),
    defineField({ name: "destino", title: "Destino", type: "string", readOnly: true }),
    defineField({
      name: "tipoCaja",
      title: "Tipo de caja",
      type: "string",
      options: { list: ["Caja Seca", "Plana", "Low Boy"] },
      readOnly: true,
    }),
    defineField({ name: "total", title: "Precio pactado (MXN)", type: "number", readOnly: true }),
    defineField({ name: "customerName", title: "Cliente", type: "string" }),
    defineField({ name: "company", title: "Empresa", type: "string" }),
    defineField({ name: "customerPhone", title: "Teléfono", type: "string" }),
    defineField({ name: "customerEmail", title: "Correo", type: "string" }),
    defineField({ name: "adminNotes", title: "Notas internas", type: "text", rows: 3 }),
    defineField({ name: "createdAt", title: "Fecha", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Más recientes", name: "recent", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "folio", subtitle: "status", destino: "destino", total: "total" },
    prepare: ({ title, subtitle, destino, total }) => ({
      title: `${title} · ${destino}`,
      subtitle: `${subtitle}${total ? " · $" + total.toLocaleString("es-MX") : ""}`,
    }),
  },
});
