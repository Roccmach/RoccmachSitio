import { defineField, defineType } from "sanity";

const MAX_TESTIMONIALS = 8;

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  description: `Hasta ${MAX_TESTIMONIALS} testimonios de clientes con foto, para la sección "Lo que dicen nuestros clientes" en Inicio.`,
  fields: [
    defineField({ name: "name", title: "Nombre del cliente", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Empresa (opcional)", type: "string" }),
    defineField({
      name: "feedback",
      title: "Testimonio",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0, description: "Menor número aparece primero." }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "feedback", media: "image" },
  },
  // Límite de 8: se valida en el Studio (no bloquea escrituras hechas por API/scripts).
  // OJO: cuenta IDs únicos (sin el prefijo "drafts.") — un conteo crudo de documentos
  // duplica cualquier testimonio que tenga a la vez versión borrador y publicada
  // (normal mientras se edita uno), lo que bloqueaba publicar de más.
  validation: (Rule) =>
    Rule.custom(async (_value, context) => {
      const id = context.document?._id;
      if (!id) return true;
      const client = context.getClient({ apiVersion: "2024-10-01" });
      const baseId = id.replace(/^drafts\./, "");
      const ids = await client.fetch<string[]>(`*[_type == "testimonial"]._id`);
      const baseIds = new Set(ids.map((i) => i.replace(/^drafts\./, "")));
      baseIds.delete(baseId);
      return baseIds.size < MAX_TESTIMONIALS || `Ya hay ${MAX_TESTIMONIALS} testimonios. Borra uno antes de agregar otro.`;
    }),
});
