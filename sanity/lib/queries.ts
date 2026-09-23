import { groq } from "next-sanity";

// Devuelve la MISMA forma que el tipo Product del front (+ imageUrl).
const productProjection = groq`{
  "slug": slug.current,
  brand,
  model,
  "category": category->slug.current,
  shortSpec,
  price,
  condition,
  description,
  specs,
  "imageUrl": image.asset->url,
  "gallery": gallery[].asset->url
}`;

export const PRODUCTS_QUERY = groq`*[_type == "product" && available == true]
  | order(featured desc, price asc) ${productProjection}`;

export const PRODUCT_SLUGS_QUERY = groq`*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`;

export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0] ${productProjection}`;

export const FEATURED_PRODUCTS_QUERY = groq`*[_type == "product" && available == true && featured == true]
  | order(price asc)[0...$limit] ${productProjection}`;

export const CATEGORIES_QUERY = groq`*[_type == "category"] | order(order asc){
  "slug": slug.current, "name": title, blurb, "iconUrl": icon.asset->url
}`;

// Tope de 4 aplicado también aquí (defensa extra: la validación del Studio no bloquea escrituras por API).
export const HERO_SLIDES_QUERY = groq`*[_type == "heroSlide" && defined(image.asset)] | order(order asc) [0...4]{
  title, subtitle, ctaLabel, ctaHref, "imageUrl": image.asset->url
}`;

// Tope de 8 aplicado también aquí (defensa extra: la validación del Studio no bloquea escrituras por API).
export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial" && defined(image.asset)] | order(order asc) [0...8]{
  name, company, feedback, "imageUrl": image.asset->url
}`;

export const BANNER_HOME_QUERY = groq`*[_type == "bannerHome"][0]{
  title,
  "desktopUrl": desktopImage.asset->url,
  "mobileUrl": mobileImage.asset->url,
  url
}`;

export const LEGAL_PAGE_QUERY = groq`*[_type == "legalPage" && kind == $kind][0]{ title, content }`;

// Solo campos seguros para el seguimiento público (sin teléfono/correo).
export const ORDER_BY_NUMBER_QUERY = groq`*[_type == "order" && orderNumber == $n][0]{
  orderNumber, kind, status, statusNote, total, createdAt, customerName, company, city,
  "items": items[]{ title, price, qty }
}`;

// Por token (URL única secreta) — mismo set seguro.
export const ORDER_BY_TOKEN_QUERY = groq`*[_type == "order" && token == $t][0]{
  orderNumber, kind, status, statusNote, total, createdAt, customerName, company, city,
  "items": items[]{ title, price, qty }
}`;

export const FREIGHT_SETTINGS_QUERY = groq`*[_type == "freightSettings"][0]{ pricePerKmCajaSeca, pricePerKmPlana, pricePerKmLowBoy, minCharge }`;

export const FREIGHT_QUOTE_BY_TOKEN_QUERY = groq`*[_type == "freightQuote" && token == $t][0]{
  folio, status, statusNote, origen, destino, tipoCaja, tipoCarga, empaque, pesoNeto, pesoBruto,
  horarioCarga, horarioDescarga, customerName, company, distanceKm, distanceSource,
  pricePerKmUsed, total, createdAt
}`;

// Rutas activas para las tarjetas de /transporte-de-carga — OJO: nunca se piden los campos de
// precio aquí, solo se ven después de cotizar (el precio se calcula server-side en /api/flete/ruta/quote).
export const FREIGHT_ROUTES_QUERY = groq`*[_type == "freightRoute" && activo == true] | order(order asc){
  destino, "slug": slug.current
}`;

export const FREIGHT_ROUTE_BY_SLUG_QUERY = groq`*[_type == "freightRoute" && slug.current == $slug && activo == true][0]{
  destino, precioCajaSeca, precioPlana, precioLowBoy
}`;

export const FREIGHT_ROUTE_QUOTE_BY_TOKEN_QUERY = groq`*[_type == "freightRouteQuote" && token == $t][0]{
  folio, status, statusNote, destino, tipoCaja, total, customerName, company, createdAt
}`;
