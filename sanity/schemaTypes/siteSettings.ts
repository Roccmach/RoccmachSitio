import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  fields: [
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp (formato wa.me, sin +)", type: "string", description: "Ej: 523300000000" }),
    defineField({ name: "email", title: "Correo", type: "string" }),
    defineField({ name: "city", title: "Ciudad / Dirección", type: "string" }),
    defineField({ name: "instagram", title: "Instagram (URL)", type: "url" }),
    defineField({ name: "facebook", title: "Facebook (URL)", type: "url" }),
    defineField({ name: "about", title: "Sobre nosotros (texto)", type: "text", rows: 4 }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
  ],
  preview: { prepare: () => ({ title: "Configuración del sitio" }) },
});
