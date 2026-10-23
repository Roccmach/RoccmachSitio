import { defineField, defineType } from "sanity";
import { diezDigitos } from "../../lib/telefono";

// Lo lee lib/contacto.ts. Un campo vacío usa el valor de lib/config.ts, así que el sitio nunca
// se queda sin teléfono ni WhatsApp. Solo hay campos que el sitio usa de verdad: un campo que no
// lee nadie hace que el cliente lo cambie y crea que el sitio está roto (pasó con el teléfono, oct-2026).

/** Acepta el número como lo escriba la persona; la regla es la misma que usa el sitio. */
const validarNumero = (v?: string) =>
  !v || diezDigitos(v) ? true : "Escribe los 10 dígitos del número, por ejemplo 33 1702 4727.";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      description: "Se muestra en el pie de página y en Contacto. Ej: 33 1702 4727",
      validation: (r) => r.custom(validarNumero),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      description: "El número al que abren chat el botón verde y los botones de compra. Ej: 33 1702 4727",
      validation: (r) => r.custom(validarNumero),
    }),
    defineField({
      name: "email",
      title: "Correo",
      type: "string",
      description:
        "El que se muestra en el sitio, los correos y los PDFs. No cambia a dónde llegan los avisos de pedidos.",
      validation: (r) => r.email().error("Revisa el correo: le falta algo, por ejemplo la @."),
    }),
    defineField({ name: "instagram", title: "Instagram", type: "url", description: "Enlace completo al perfil. Ej: https://www.instagram.com/nombre-de-la-cuenta" }),
    defineField({ name: "facebook", title: "Facebook", type: "url", description: "Enlace completo a la página. Ej: https://www.facebook.com/nombre-de-la-pagina" }),
  ],
  preview: { prepare: () => ({ title: "Configuración del sitio" }) },
});
