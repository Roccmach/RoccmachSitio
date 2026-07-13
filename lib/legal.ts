import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { LEGAL_PAGE_QUERY } from "@/sanity/lib/queries";

export interface LegalPageData {
  title?: string;
  content?: PortableTextBlock[];
}

export async function getLegalPage(kind: "terminos" | "privacidad"): Promise<LegalPageData | null> {
  if (!isSanityConfigured) return null;
  try {
    const data = await client.fetch<LegalPageData | null>(LEGAL_PAGE_QUERY, { kind });
    return data ?? null;
  } catch {
    return null;
  }
}
