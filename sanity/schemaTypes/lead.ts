import { defineField, defineType } from "sanity";

export const lead = defineType({
  name: "lead",
  title: "Lead / Solicitud de compra",
  type: "document",
  // Los leads los crea la web (API). Aquí solo se consultan.
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string" }),
    defineField({ name: "company", title: "Empresa", type: "string" }),
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "email", title: "Correo", type: "string" }),
    defineField({ name: "city", title: "Ciudad de entrega", type: "string" }),
    defineField({ name: "category", title: "Equipo / Interés", type: "string" }),
    defineField({ name: "modo", title: "Modalidad", type: "string" }),
    defineField({ name: "productSlug", title: "Slug del equipo", type: "string" }),
    defineField({ name: "productPrice", title: "Precio del equipo", type: "number" }),
    defineField({ name: "message", title: "Mensaje", type: "text" }),
    defineField({ name: "source", title: "Origen", type: "string" }),
    defineField({ name: "createdAt", title: "Fecha", type: "datetime" }),
  ],
  orderings: [{ title: "Más recientes", name: "recent", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "name", subtitle: "category", date: "createdAt" },
    prepare: ({ title, subtitle }) => ({ title: title || "Lead", subtitle }),
  },
});
