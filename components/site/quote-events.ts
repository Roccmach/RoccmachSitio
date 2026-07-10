export const QUOTE_EVENT = "roccmach:open-quote";

export interface QuoteProduct {
  slug: string;
  brand: string;
  model: string;
  price: number;
}

export interface QuotePrefill {
  category?: string;
  /** Cuando viene de un equipo específico, se salta la selección de categoría/modalidad. */
  product?: QuoteProduct;
}

/** Abre el modal de compra asistida desde cualquier parte (client-side). */
export function openQuote(prefill?: QuotePrefill) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(QUOTE_EVENT, { detail: prefill ?? {} }));
  }
}
