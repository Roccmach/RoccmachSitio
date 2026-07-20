import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { BANNER_HOME_QUERY } from "@/sanity/lib/queries";

export interface BannerHomeData {
  desktopUrl: string;
  mobileUrl: string;
  url: string;
}

/** Banner publicitario de inicio desde el CMS. null = la sección no se muestra. */
export async function getBannerHome(): Promise<BannerHomeData | null> {
  if (!isSanityConfigured) return null;
  try {
    const data = await client.fetch<BannerHomeData | null>(BANNER_HOME_QUERY);
    if (!data?.desktopUrl || !data?.mobileUrl || !data?.url) return null;
    return data;
  } catch {
    return null;
  }
}
