import { defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Página legal",
  type: "document",
  description: "Términos y Condiciones y Aviso de Privacidad del sitio — texto completo con formato (negritas, viñetas, títulos).",
  fields: [
    defineField({
      name: "kind",
      title: "Tipo de página",
      type: "string",
      options: {
        list: [
          { title: "Términos y Condiciones", value: "terminos" },
          { title: "Aviso de Privacidad", value: "privacidad" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Título visible en la página", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "content",
      title: "Contenido",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "kind" },
  },
});
