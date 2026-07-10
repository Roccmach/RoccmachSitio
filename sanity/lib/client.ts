import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Dataset privado → leemos con token SOLO del lado servidor.
// (Los datos se consumen en Server Components; el token nunca llega al navegador.)
// Preferimos un token de lectura dedicado; si no existe, usamos el de escritura.
const token =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  // Con token, useCdn debe ir en false (respuestas autenticadas no se cachean en CDN).
  useCdn: false,
});
