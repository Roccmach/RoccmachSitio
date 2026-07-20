import { defineField, defineType } from "sanity";

export const FREIGHT_STATUSES = ["Nueva", "Contactado", "Programada", "En tránsito", "Entregada", "Cancelada"] as const;

const addressFields = [
  defineField({ name: "ciudad", title: "Ciudad", type: "string" }),
  defineField({ name: "cp", title: "Código Postal", type: "string" }),
];

export const freightQuote = defineType({
  name: "freightQuote",
  title: "Cotización de flete",
  type: "document",
  fields: [
    defineField({ name: "folio", title: "Folio", type: "string", readOnly: true }),
    defineField({ name: "token", title: "Token", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "status",
      title: "Estatus",
      type: "string",
      options: { list: [...FREIGHT_STATUSES], layout: "dropdown" },
      initialValue: "Nueva",
      description: "Cámbialo conforme avanza el envío. El cliente lo ve en su seguimiento.",
    }),
    defineField({
      name: "statusNote",
      title: "Nota para el cliente",
      type: "string",
      description: "Mensaje visible en el seguimiento. Ej: 'Recogemos el martes a las 9am'.",
    }),
    defineField({ name: "origen", title: "Origen", type: "object", fields: addressFields }),
    defineField({ name: "destino", title: "Destino", type: "object", fields: addressFields }),
    defineField({
      name: "tipoCaja",
      title: "Tipo de caja",
      type: "string",
      options: { list: ["Caja Seca", "Plana", "Low Boy"], layout: "radio" },
    }),
    defineField({ name: "tipoCarga", title: "Tipo de carga", type: "string" }),
    defineField({
      name: "empaque",
      title: "Pieza o caja",
      type: "string",
      options: { list: ["Pieza", "Caja"], layout: "radio" },
    }),
    defineField({ name: "pesoNeto", title: "Peso neto (kg)", type: "number" }),
    defineField({ name: "pesoBruto", title: "Peso bruto (kg)", type: "number" }),
    defineField({ name: "horarioCarga", title: "Horario de carga", type: "string" }),
    defineField({ name: "horarioDescarga", title: "Horario de descarga", type: "string" }),
    defineField({ name: "customerName", title: "Cliente", type: "string" }),
    defineField({ name: "company", title: "Empresa", type: "string" }),
    defineField({ name: "customerPhone", title: "Teléfono", type: "string" }),
    defineField({ name: "customerEmail", title: "Correo", type: "string" }),
    defineField({ name: "distanceKm", title: "Distancia (km)", type: "number", readOnly: true }),
    defineField({
      name: "distanceSource",
      title: "Fuente de la distancia",
      type: "string",
      readOnly: true,
      description: "osrm = ruta real por carretera. straight-line = línea recta (respaldo si OSRM falla).",
    }),
    defineField({ name: "pricePerKmUsed", title: "Precio/km usado", type: "number", readOnly: true }),
    defineField({ name: "total", title: "Total (MXN)", type: "number", readOnly: true }),
    defineField({ name: "adminNotes", title: "Notas internas", type: "text", rows: 3 }),
    defineField({ name: "createdAt", title: "Fecha", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Más recientes", name: "recent", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "folio", subtitle: "status", customer: "customerName", total: "total" },
    prepare: ({ title, subtitle, customer, total }) => ({
      title: `${title}${customer ? " · " + customer : ""}`,
      subtitle: `${subtitle}${total ? " · $" + total.toLocaleString("es-MX") : ""}`,
    }),
  },
});
