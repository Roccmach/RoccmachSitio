import type { Metadata, Viewport } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import { organizationJsonLd } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import "./globals.css";

const GTM_ID = "GTM-57X9PQ9C";

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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
