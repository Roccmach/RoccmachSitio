import { defineField, defineType } from "sanity";

export const freightRoute = defineType({
  name: "freightRoute",
  title: "Ruta de transporte",
  type: "document",
  description: "Rutas fijas de transporte desde Guadalajara, con precio pactado por tipo de caja. Se muestran como tarjetas en /transporte-de-carga (el precio nunca se ve en la tarjeta, solo tras cotizar).",
  fields: [
    defineField({ name: "destino", title: "Ciudad destino", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "destino" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "precioCajaSeca", title: "Precio Caja Seca (MXN)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "precioPlana", title: "Precio Plana (MXN)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "precioLowBoy", title: "Precio Low Boy (MXN)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "order", title: "Orden", type: "number", initialValue: 0, description: "Menor número aparece primero." }),
    defineField({ name: "activo", title: "Activa", type: "boolean", initialValue: true, description: "Desactívala para ocultarla de /transporte-de-carga sin borrarla." }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "destino", caja: "precioCajaSeca", plana: "precioPlana", lowboy: "precioLowBoy" },
    prepare: ({ title, caja, plana, lowboy }) => ({
      title: `Desde GDL → ${title}`,
      subtitle: `Caja Seca $${caja} · Plana $${plana} · Low Boy $${lowboy}`,
    }),
  },
});
