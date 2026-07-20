import { defineField, defineType } from "sanity";

export const bannerHome = defineType({
  name: "bannerHome",
  title: "Banner Home",
  type: "document",
  description: "Banner publicitario en la página de inicio, entre Testimonios y Compra asistida. Si falta imagen/link, el banner no se muestra.",
  fields: [
    defineField({
      name: "title",
      title: "Titular",
      type: "string",
      description: "Ej: ¿Necesitas una refacción? Visítanos ahora.",
    }),
    defineField({
      name: "desktopImage",
      title: "Imagen (desktop)",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Imagen (celular)",
      type: "image",
      options: { hotspot: true },
      description: "Vertical, para pantallas angostas. Sube una versión ligera (menos de ~300KB) para que cargue rápido.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Link de redirección",
      type: "url",
      description: "A dónde lleva al hacer clic. Ej: https://posisol.mx",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { media: "desktopImage", title: "title", url: "url" },
    prepare: ({ media, title, url }) => ({ title: title || "Banner Home", subtitle: url, media }),
  },
});
