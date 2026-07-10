import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { HERO_SLIDES_QUERY } from "@/sanity/lib/queries";

export interface HeroSlideData {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl: string;
}

/** Slides del hero desde el CMS (1-4). Array vacío = el sitio usa el hero por defecto. */
export async function getHeroSlides(): Promise<HeroSlideData[]> {
  if (!isSanityConfigured) return [];
  try {
    const data = await client.fetch<HeroSlideData[]>(HERO_SLIDES_QUERY);
    return data ?? [];
  } catch {
    return [];
  }
}
