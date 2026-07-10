import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { TESTIMONIALS_QUERY } from "@/sanity/lib/queries";

export interface TestimonialData {
  name: string;
  company?: string;
  feedback: string;
  imageUrl: string;
}

/** Testimonios de clientes desde el CMS (hasta 8). Array vacío = la sección no se muestra. */
export async function getTestimonials(): Promise<TestimonialData[]> {
  if (!isSanityConfigured) return [];
  try {
    const data = await client.fetch<TestimonialData[]>(TESTIMONIALS_QUERY);
    return data ?? [];
  } catch {
    return [];
  }
}
