import { defineField, defineType } from "sanity";

export const freightSettings = defineType({
  name: "freightSettings",
  title: "Configuración de flete",
  type: "document",
  description: "Precio por kilómetro usado para calcular las cotizaciones de flete en /flete. Solo debe existir un documento de este tipo.",
  fields: [
    defineField({
      name: "pricePerKm",
      title: "Precio por KM (MXN)",
      type: "number",
      validation: (r) => r.required().min(0),
      description: "Se multiplica por la distancia calculada entre origen y destino.",
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
    select: { price: "pricePerKm" },
    prepare: ({ price }) => ({ title: "Configuración de flete", subtitle: price ? `$${price}/km` : "Sin precio configurado" }),
  },
});
