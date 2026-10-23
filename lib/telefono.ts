// Números de teléfono de México como los escribe una persona. Lo usan el sitio (lib/contacto.ts)
// y la validación del panel de Sanity (siteSettings), para que acepten exactamente lo mismo.

/** Los 10 dígitos del número, se escriba como se escriba («33 1702 4727», «+52 33…», «523317024727»).
 * null si no son 10 dígitos (con o sin el 52 de país). */
export function diezDigitos(v?: string | null): string | null {
  const d = (v ?? "").replace(/\D/g, "");
  if (d.length === 10) return d;
  if (d.length === 12 && d.startsWith("52")) return d.slice(2);
  return null;
}

/** «+52 33 1702 4727». Lada de 2 dígitos en GDL, CDMX y MTY; de 3 en el resto del país. */
export function telefonoVisible(diez: string): string {
  const lada2 = ["33", "55", "81"].includes(diez.slice(0, 2));
  return lada2
    ? `+52 ${diez.slice(0, 2)} ${diez.slice(2, 6)} ${diez.slice(6)}`
    : `+52 ${diez.slice(0, 3)} ${diez.slice(3, 6)} ${diez.slice(6)}`;
}
