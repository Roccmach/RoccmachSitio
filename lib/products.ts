// Capa de acceso a datos: intenta Sanity, cae a mock si no está configurado
// o si algo falla. Así el sitio SIEMPRE funciona.

import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  CATEGORIES_QUERY,
  ORDER_BY_NUMBER_QUERY,
  ORDER_BY_TOKEN_QUERY,
} from "@/sanity/lib/queries";
import {
  PRODUCTS,
  CATEGORIES,
  getProduct as mockGetProduct,
  type Product,
  type CategorySlug,
} from "@/lib/catalog";

export interface CategoryInfo {
  slug: string;
  name: string;
  blurb?: string;
  iconUrl?: string;
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return PRODUCTS;
  try {
    const data = await client.fetch<Product[]>(PRODUCTS_QUERY);
    return data && data.length ? data : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSanityConfigured) return mockGetProduct(slug);
  try {
    const data = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug });
    return data ?? mockGetProduct(slug);
  } catch {
    return mockGetProduct(slug);
  }
}

export async function getProductSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return PRODUCTS.map((p) => p.slug);
  try {
    const data = await client.fetch<{ slug: string }[]>(PRODUCT_SLUGS_QUERY);
    return data && data.length ? data.map((d) => d.slug) : PRODUCTS.map((p) => p.slug);
  } catch {
    return PRODUCTS.map((p) => p.slug);
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (isSanityConfigured) {
    try {
      const data = await client.fetch<Product[]>(FEATURED_PRODUCTS_QUERY, { limit });
      if (data && data.length) return data;
    } catch {
      /* cae a fallback */
    }
  }
  // Fallback: los primeros equipos disponibles.
  const all = await getAllProducts();
  return all.slice(0, limit);
}

// A diferencia de otros getters, un array VACÍO es un resultado legítimo aquí
// (el cliente puede borrar todas sus categorías) — solo se cae al mock si la
// consulta a Sanity falla de verdad, no cuando simplemente no hay documentos.
export async function getCategories(): Promise<CategoryInfo[]> {
  if (isSanityConfigured) {
    try {
      const data = await client.fetch<CategoryInfo[]>(CATEGORIES_QUERY);
      return data ?? [];
    } catch {
      /* cae a fallback */
    }
  }
  return CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, blurb: c.blurb }));
}

export const CATEGORY_SLUGS: CategorySlug[] = ["gruas", "montacargas", "patines", "plataformas"];

export interface TrackedOrder {
  orderNumber: string;
  status: string;
  statusNote?: string;
  total?: number;
  createdAt?: string;
  customerName?: string;
  company?: string;
  city?: string;
  items?: { title: string; price: number; qty: number }[];
}

/** Consulta un pedido por número (para el seguimiento del cliente). */
export async function getOrderByNumber(orderNumber: string): Promise<TrackedOrder | null> {
  if (!isSanityConfigured || !orderNumber) return null;
  try {
    return await client.fetch<TrackedOrder | null>(ORDER_BY_NUMBER_QUERY, {
      n: orderNumber.trim().toUpperCase(),
    });
  } catch {
    return null;
  }
}

/** Consulta un pedido por token (URL única de seguimiento). */
export async function getOrderByToken(token: string): Promise<TrackedOrder | null> {
  if (!isSanityConfigured || !token) return null;
  try {
    return await client.fetch<TrackedOrder | null>(ORDER_BY_TOKEN_QUERY, { t: token.trim() });
  } catch {
    return null;
  }
}
