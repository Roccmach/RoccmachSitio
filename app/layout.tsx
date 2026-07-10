import type { Metadata, Viewport } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import { organizationJsonLd } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0C",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ROCCMACH · Maquinaria Industrial en Guadalajara — Venta, Renta y Refacciones",
  description:
    "Distribuidor de montacargas, grúas, patines y plataformas en Guadalajara, Jalisco, con entrega a toda la República Mexicana. Compra en línea, renta o solicita tu equipo con atención personalizada.",
  keywords: [
    "montacargas Guadalajara",
    "maquinaria industrial Jalisco",
    "renta de montacargas México",
    "venta de montacargas seminuevos",
    "grúas industriales Guadalajara",
    "patines eléctricos industriales",
    "plataformas de elevación",
    "refacciones para montacargas",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ROCCMACH · Maquinaria Industrial en Guadalajara",
    description:
      "Venta, renta, refacciones y servicio de maquinaria industrial en Guadalajara, con entrega a todo México.",
    url: SITE_URL,
    siteName: "ROCCMACH",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/nosotros-banner.png", width: 1298, height: 311, alt: "Flota de maquinaria industrial ROCCMACH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROCCMACH · Maquinaria Industrial en Guadalajara",
    description:
      "Venta, renta, refacciones y servicio de maquinaria industrial en Guadalajara, con entrega a todo México.",
    images: ["/nosotros-banner.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${openSans.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
