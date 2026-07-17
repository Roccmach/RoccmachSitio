export const FREIGHT_QUOTE_EVENT = "roccmach:open-freight-quote";

/** Abre el modal de cotización de flete desde cualquier parte de /flete (client-side). */
export function openFreightQuote() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FREIGHT_QUOTE_EVENT));
  }
}
