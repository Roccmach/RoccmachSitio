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
    // Mini editor: lo que pide una ficha de equipo y nada más (sin enlaces, sin tamaños de título).
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "array",
      description:
        "Puedes pegar desde Word. Usa «Subtítulo» para separar secciones (ej. CONDICIONES COMERCIALES) y la viñeta para listas.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Subtítulo", value: "h3" },
          ],
          lists: [{ title: "Viñetas", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
    }),
    // El campo de antes (texto simple). Su contenido se copió a «Descripción» (oct-2026); queda de
    // solo lectura y se oculta en cuanto está vacío. El sitio lo usa si «Descripción» está vacía.
    defineField({
      name: "description",
      title: "Descripción anterior (texto simple)",
      type: "text",
      rows: 4,
      readOnly: true,
      hidden: ({ value }) => !value,
    }),
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
      title: "Foto principal",
      type: "image",
      options: { hotspot: true },
      description: "La que se ve en el catálogo y al compartir el equipo en redes.",
    }),
    defineField({
      name: "gallery",
      title: "Más fotos (opcional)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.max(4),
      description:
        "Hasta 4 fotos adicionales. Aparecen como miniaturas debajo de la foto principal en la página del equipo; al darles clic se hacen grandes. Si lo dejas vacío, la página se ve igual que siempre.",
      options: { layout: "grid" },
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
