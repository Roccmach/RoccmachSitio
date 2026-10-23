import "server-only";
import { cache } from "react";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { BRAND } from "@/lib/config";
import { diezDigitos, telefonoVisible } from "@/lib/telefono";

// Datos de contacto del sitio. Los edita el cliente en Sanity («Configuración del sitio»);
// el valor de BRAND (lib/config.ts) es el respaldo cuando un campo está vacío o Sanity falla,
// así el sitio nunca se queda sin teléfono ni WhatsApp.

export type Contacto = {
  phone: string;
  whatsapp: string; // formato wa.me: 52 + 10 dígitos, sin +
  email: string;
  instagram: string;
  facebook: string;
  /** De dónde salió: "sanity" si se leyó el panel, "codigo" si se usó el respaldo. */
  fuente: "sanity" | "codigo";
};

const RESPALDO: Contacto = {
  phone: BRAND.phone,
  whatsapp: BRAND.whatsapp,
  email: BRAND.email,
  instagram: BRAND.socials.instagram,
  facebook: BRAND.socials.facebook,
  fuente: "codigo",
};

type Panel = { phone?: string; whatsapp?: string; email?: string; instagram?: string; facebook?: string } | null;

// cache(): layout, página y JSON-LD comparten una sola consulta por render.
export const getContacto = cache(async (): Promise<Contacto> => {
  if (!isSanityConfigured) return RESPALDO;
  try {
    const s = await client.fetch<Panel>(SITE_SETTINGS_QUERY);
    if (!s) return RESPALDO;
    const tel = diezDigitos(s.phone);
    const wa = diezDigitos(s.whatsapp);
    return {
      phone: tel ? telefonoVisible(tel) : RESPALDO.phone,
      whatsapp: wa ? `52${wa}` : RESPALDO.whatsapp,
      email: s.email?.trim() || RESPALDO.email,
      instagram: s.instagram?.trim() || RESPALDO.instagram,
      facebook: s.facebook?.trim() || RESPALDO.facebook,
      fuente: "sanity",
    };
  } catch {
    return RESPALDO;
  }
});
