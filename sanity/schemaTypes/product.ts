import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Equipo",
  type: "document",
  fields: [
    defineField({ name: "brand", title: "Marca", type: "string", validation: (r) => r.required() }),
    defineField({ name: "model", title: "Modelo", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: (doc) => `${doc.brand}-${doc.model}` },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Precio (MXN)",
      type: "number",
      validation: (r) => r.required().min(0),
      description: "Menor a $50,000 → se vende en línea. Mayor o igual → va por cotización (UI mágica).",
    }),
    defineField({
      name: "condition",
      title: "Condición",
      type: "string",
      options: { list: ["Nuevo", "Seminuevo"], layout: "radio" },
      initialValue: "Nuevo",
    }),
    defineField({ name: "shortSpec", title: "Spec corta (para la card)", type: "string", description: "Ej: 2.5 ton · GLP · 4.7m" }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 4 }),
    defineField({
      name: "specs",
      title: "Especificaciones",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Etiqueta", type: "string" },
            { name: "value", title: "Valor", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Foto del equipo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "featured", title: "Destacado", type: "boolean", initialValue: false }),
    defineField({ name: "available", title: "Disponible", type: "boolean", initialValue: true }),
  ],
  orderings: [
    { title: "Precio ↑", name: "priceAsc", by: [{ field: "price", direction: "asc" }] },
    { title: "Precio ↓", name: "priceDesc", by: [{ field: "price", direction: "desc" }] },
  ],
  preview: {
    select: { title: "model", subtitle: "brand", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title: `${subtitle} ${title}`, subtitle, media }),
  },
});
