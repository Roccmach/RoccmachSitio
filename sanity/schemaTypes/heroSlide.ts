import { defineField, defineType } from "sanity";

const MAX_SLIDES = 4;

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Imagen de Hero",
  type: "document",
  description: `Hasta ${MAX_SLIDES} imágenes para el carrusel del hero (inicio). Si no hay ninguna, el sitio usa el hero por defecto.`,
  fields: [
    defineField({ name: "title", title: "Título", type: "string", description: "Ej: Fuerza que mueve tu operación." }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "text", rows: 2 }),
    defineField({
      name: "image",
      title: "Foto de fondo",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón",
      type: "string",
      description: "Ej: Ver catálogo, Cotizar maquinaria",
      initialValue: "Ver catálogo",
    }),
    defineField({
      name: "ctaHref",
      title: "Link de redirección",
      type: "string",
      description: "A dónde lleva el botón al hacer clic. Ej: /catalogo, /contacto, o una URL completa (https://...).",
      initialValue: "/catalogo",
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0, description: "Menor número aparece primero." }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Imagen de Hero", subtitle, media }),
  },
  // Límite de 4 slides: se valida en el Studio (no bloquea escrituras hechas por API/scripts).
  // OJO: cuenta IDs únicos (sin el prefijo "drafts.") — un conteo crudo de documentos
  // duplica cualquier slide que tenga a la vez versión borrador y publicada (normal
  // mientras se edita uno), lo que bloqueaba publicar de más.
  validation: (Rule) =>
    Rule.custom(async (_value, context) => {
      const id = context.document?._id;
      if (!id) return true;
      const client = context.getClient({ apiVersion: "2024-10-01" });
      const baseId = id.replace(/^drafts\./, "");
      const ids = await client.fetch<string[]>(`*[_type == "heroSlide"]._id`);
      const baseIds = new Set(ids.map((i) => i.replace(/^drafts\./, "")));
      baseIds.delete(baseId);
      return baseIds.size < MAX_SLIDES || `Ya hay ${MAX_SLIDES} imágenes de hero. Borra una antes de agregar otra.`;
    }),
});
