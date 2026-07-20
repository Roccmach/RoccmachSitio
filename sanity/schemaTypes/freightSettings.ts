import { defineField, defineType } from "sanity";

export const freightSettings = defineType({
  name: "freightSettings",
  title: "Configuración de transporte",
  type: "document",
  description:
    "Precio por kilómetro (uno por tipo de caja) usado para calcular las cotizaciones de transporte por dirección en /transporte-de-carga. Solo debe existir un documento de este tipo.",
  fields: [
    defineField({
      name: "pricePerKmCajaSeca",
      title: "Precio por KM · Caja Seca (MXN)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "pricePerKmPlana",
      title: "Precio por KM · Plana (MXN)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "pricePerKmLowBoy",
      title: "Precio por KM · Low Boy (MXN)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "minCharge",
      title: "Cobro mínimo (MXN)",
      type: "number",
      initialValue: 0,
      description: "Si el cálculo (distancia × precio/km) da menos que esto, se cobra este mínimo. Déjalo en 0 para no aplicar mínimo.",
    }),
  ],
  preview: {
    select: { cs: "pricePerKmCajaSeca", p: "pricePerKmPlana", lb: "pricePerKmLowBoy" },
    prepare: ({ cs, p, lb }) => ({
      title: "Configuración de transporte",
      subtitle: cs ? `Caja Seca $${cs} · Plana $${p} · Low Boy $${lb} /km` : "Sin precios configurados",
    }),
  },
});
