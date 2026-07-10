// Configuración central de marca y regla de negocio.
// La regla de los $50k vive AQUÍ y en ningún otro lado.

export const BRAND = {
  name: "ROCCMACH",
  tagline: "Maquinaria Industrial",
  whatsapp: "523343393126", // formato wa.me (sin +)
  phone: "+52 33 4339 3126",
  email: "contacto@roccmach.com",
  city: "Guadalajara, Jalisco · MX",
  // Dirección estructurada (para JSON-LD LocalBusiness y datos de contacto formales).
  address: {
    street: "Isla Cozumel #3713",
    neighborhood: "Col. Villa Guerrero",
    postalCode: "44987",
    locality: "Guadalajara",
    region: "Jalisco",
    country: "MX",
  },
  // Coordenadas aproximadas de Guadalajara (suficiente para SEO local, no necesita ser exacta al metro).
  geo: { lat: 20.6597, lng: -103.3496 },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;

/** Umbral: por debajo se compra en línea (Mercado Pago), por encima va a "compra asistida"
 * (formulario completo → lead + WhatsApp). La UX nunca dice "cotización": ambos flujos se
 * presentan como comprar, solo cambia el método de cierre. */
export const PRICE_THRESHOLD = 50000;

/** ¿El equipo se puede comprar directo en línea? (con precio real y bajo el umbral) */
export const isBuyable = (price: number) => price > 0 && price < PRICE_THRESHOLD;

/** Formato de moneda MXN. */
export const formatMXN = (n: number) => "$" + n.toLocaleString("es-MX");

export const waLink = (text: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

/** URL base del sitio (para back_urls de Mercado Pago, links de correo/seguimiento, JSON-LD, etc.).
 * Si NEXT_PUBLIC_SITE_URL viene mal configurada apuntando a localhost (ej. copiada por error
 * desde .env.local a las env vars de Vercel), se ignora y se usa la URL real de producción que
 * Vercel ya provee automáticamente — así nunca se manda a un cliente real a su propia máquina. */
const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const SITE_URL =
  envSiteUrl && !envSiteUrl.includes("localhost")
    ? envSiteUrl
    : vercelUrl
      ? `https://${vercelUrl}`
      : envSiteUrl || "http://localhost:3000";
