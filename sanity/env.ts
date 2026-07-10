export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// "dummy" es un projectId con formato válido que permite construir el cliente
// sin romper el build cuando aún no se ha conectado un proyecto real.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dummy";

/** True solo cuando hay un proyecto Sanity real configurado. */
export const isSanityConfigured =
  !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "dummy";
