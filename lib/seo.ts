// Helpers de datos estructurados (schema.org) — un solo lugar para no repetir
// la forma del JSON-LD en cada página.

import { BRAND, SITE_URL } from "./config";
import type { Product } from "./catalog";

/** Organization + LocalBusiness combinado — va una sola vez en el layout raíz. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.name,
    alternateName: "ROCCMACH Maquinaria Industrial",
    description:
      "Distribución, venta, renta, refacciones y servicio de maquinaria industrial en Guadalajara, Jalisco, con entrega a toda la República Mexicana.",
    url: SITE_URL,
    telephone: BRAND.phone,
    email: BRAND.email,
    image: `${SITE_URL}/nosotros-banner.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.street + ", " + BRAND.address.neighborhood,
      addressLocality: BRAND.address.locality,
      addressRegion: BRAND.address.region,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BRAND.geo.lat,
      longitude: BRAND.geo.lng,
    },
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    sameAs: [BRAND.socials.instagram, BRAND.socials.facebook].filter(
      (u) => u && !u.endsWith(".com")
    ),
  };
}

/** Product + Offer — va en cada ficha de equipo del catálogo. */
export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.model}`,
    brand: { "@type": "Brand", name: p.brand },
    description:
      p.description ||
      `${p.brand} ${p.model} — ${p.shortSpec.replace(/\.?$/, ".")} Equipo ${p.condition.toLowerCase()}, disponible en Guadalajara con entrega a todo México.`,
    image: p.imageUrl,
    sku: p.slug,
    category: p.category,
    itemCondition:
      p.condition?.toLowerCase().includes("nuevo") && !p.condition?.toLowerCase().includes("semi")
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers:
      p.price > 0
        ? {
            "@type": "Offer",
            url: `${SITE_URL}/catalogo/${p.slug}`,
            priceCurrency: "MXN",
            price: p.price,
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: BRAND.name },
          }
        : undefined,
  };
}

/** Service — va en /flete, para que buscadores/IA sepan qué rutas y ciudades cubrimos. */
export function freightServiceJsonLd(cities: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Flete y transporte de carga",
    provider: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
    areaServed: [
      { "@type": "Country", name: "México" },
      { "@type": "City", name: "Guadalajara" },
      ...cities.map((name) => ({ "@type": "City" as const, name })),
    ],
    description:
      "Servicio de flete y transporte de carga desde Guadalajara: rutas fijas con precio pactado a destinos del Pacífico, o cotización por distancia real a cualquier punto de México.",
    url: `${SITE_URL}/flete`,
  };
}

/** BreadcrumbList — para catálogo, categorías y fichas de producto. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
