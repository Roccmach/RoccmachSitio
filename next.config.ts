import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // /flete se renombró a /transporte-de-carga (nombre más profesional) — se
  // deja el redirect por si algún link/marcador viejo sigue apuntando a /flete.
  async redirects() {
    return [
      { source: "/flete", destination: "/transporte-de-carga", permanent: true },
      { source: "/flete/seguimiento/:token", destination: "/transporte-de-carga/seguimiento/:token", permanent: true },
    ];
  },
};

export default nextConfig;
