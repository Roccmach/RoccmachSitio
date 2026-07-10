import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
      description: "Identificador para URLs, se genera solo a partir del nombre.",
    }),
    defineField({
      name: "icon",
      title: "Ícono",
      type: "image",
      description: "Ícono que se muestra en la home. PNG/SVG con fondo transparente recomendado.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "blurb", title: "Descripción corta", type: "string" }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "blurb", media: "icon" } },
});
