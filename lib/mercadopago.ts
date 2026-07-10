import "server-only";
import { MercadoPagoConfig, Preference } from "mercadopago";

/** True solo cuando hay un access token de Mercado Pago configurado. */
export const isMpConfigured = !!process.env.MP_ACCESS_TOKEN;

let preferenceClient: Preference | null = null;

/** Cliente de Preferencias (Checkout Pro). SOLO servidor. */
export function getPreferenceClient(): Preference | null {
  if (!isMpConfigured) return null;
  if (!preferenceClient) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN as string,
    });
    preferenceClient = new Preference(client);
  }
  return preferenceClient;
}
