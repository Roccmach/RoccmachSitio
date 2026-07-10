// Corrige 22 productos cuyos specs "Mástil y elevación" / "Horómetro" / "Tipo" / "Tipo de llanta"
// y el campo `description` quedaron mal mapeados en la extracción original del PDF
// (texto de un campo se "derramó" al campo vecino, o el campo faltaba por completo).
// Fuente de verdad: re-lectura manual de las páginas correspondientes de
// "CATALOGO NUEVO ROCCMACH.pdf" (ver tabla abajo, page = página del PDF, 1-indexed).
//
// Uso: node --env-file=.env.local scripts/fix-mismapped-specs.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Falta NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

// specs: array de {label, value} YA en el orden final (Capacidad, Tipo, Tipo de llanta,
// Dimensiones, Mástil y elevación, Horómetro, Serie, Ubicación) — se omiten los campos
// sin valor real en el PDF fuente (nunca se muestra un spec vacío).
const FIXES = {
  "yale-ndr035eanl36te": {
    description: "Excelente para almacenes con racks altos, trabaja en pasillos angostos, menor consumo por ser eléctrico.",
    specs: [
      ["Capacidad", "3,500 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Poliuterano"],
      ["Dimensiones", "Alto 3.64m × Largo 2.23m × Ancho 1.12m"], ["Mástil y elevación", "Tríplex 7.4 m"],
      ["Serie", "C861N03186J"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "crown-rm6025-45": {
    description: "",
    specs: [
      ["Capacidad", "4,500 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Poliuterano"],
      ["Dimensiones", "Alto 3.78m × Largo 2.0m × Ancho 1.14m"], ["Mástil y elevación", "Monomastil 8.30 m"],
      ["Serie", "1A544996"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "ep-equipment-ept-2547-30": {
    description: "",
    specs: [
      ["Capacidad", "3,000 lbs"], ["Tipo", "Eléctrico"],
      ["Dimensiones", "Alto 1.28m × Largo 1.66m × Ancho 72m"], ["Mástil y elevación", "No aplica"],
      ["Serie", "180740"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "moffett-m5000": {
    description: "Los montacargas Moffett permiten montar/desmontar con rapidez.",
    specs: [
      ["Capacidad", "4,500 lbs"], ["Tipo", "Diesel"], ["Tipo de llanta", "Neumática"],
      ["Dimensiones", "Alto 2.85m × Largo 2.50m × Ancho 2.56m"], ["Mástil y elevación", "Tríplex 3.66 m"],
      ["Serie", "7437"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "toyota-8fbcu20": {
    description: "",
    specs: [
      ["Capacidad", "2,950 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Cushion"],
      ["Dimensiones", "Alto 2.24m × Largo 2.06m × Ancho 1.16m"], ["Mástil y elevación", "Dúplex 3.34 m"],
      ["Serie", "68692"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "clark-ecg25": {
    description: "Ideal para uso en suelo liso. Se entrega listo para trabajar (solicitar T.E.)",
    specs: [
      ["Capacidad", "5,500 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Cushion"],
      ["Dimensiones", "Alto 2.22m × Largo 2.20m × Ancho 1.08m"], ["Mástil y elevación", "Tríplex 4.80 m"],
      ["Serie", "ECG358-0144-677755"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "skyjack-sjiii3219": {
    description: "Un sistema confiable que utiliza codificación por colores y números, lo que facilita la detección de fallos.",
    specs: [
      ["Capacidad", "500 lbs"], ["Tipo", "Eléctrica"],
      ["Dimensiones", "Alto 1.98m × Largo 1.87m × Ancho 80m"], ["Mástil y elevación", "No aplica"],
      ["Serie", "22090116"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "crown-pc4500-60-9796": {
    description: "",
    specs: [
      ["Capacidad", "6,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Solidas de poli"],
      ["Dimensiones", "Alto 1.62m × Largo 3.68m × Ancho 85m"], ["Mástil y elevación", "No aplica"],
      ["Serie", "6A299796"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "hyster-b60zac": {
    description: "",
    specs: [
      ["Capacidad", "6,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Poliuterano"],
      ["Dimensiones", "Alto 1.50m × Largo 3.27m × Ancho 94m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "Sin batería"], ["Serie", "B230N01763E"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "yale-mtr007lfn24t": {
    description: "",
    specs: [
      ["Capacidad", "15,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Solidas de poli"],
      ["Dimensiones", "Alto 2.13m × Largo 1.74m × Ancho 95m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "20,817"], ["Serie", "C903N01633M"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "hyster-b80zhd": {
    description: "",
    specs: [
      ["Capacidad", "8,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Solidas de poli"],
      ["Dimensiones", "Alto 1.59m × Largo 3.48m × Ancho 94m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "7,577"], ["Serie", "B257N01860P"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "big-joe-d-40": {
    description: "",
    specs: [
      ["Capacidad", "4,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Solidas de poli"],
      ["Dimensiones", "Alto 1.60m × Largo 1.30m × Ancho 65m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "No enciende"], ["Serie", "326120032"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "hyster-b80zhd-859p": {
    description: "",
    specs: [
      ["Capacidad", "8,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Solidas de poli"],
      ["Dimensiones", "Alto 1.60m × Largo 3.44m × Ancho 94m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "No enciende"], ["Serie", "B257N01859P"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "big-joe-d-40-0027": {
    description: "",
    specs: [
      ["Capacidad", "4,000 lbs"], ["Tipo", "Eléctrico"],
      ["Dimensiones", "Alto 1.60m × Largo 1.30m × Ancho 65m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "No enciende"], ["Serie", "326120027"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "lifter-cx-12": {
    description: "",
    specs: [
      ["Capacidad", "2,600 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Solidas de poli"],
      ["Dimensiones", "Alto 1.35m × Largo 1.52m × Ancho 52m"], ["Mástil y elevación", "No aplica"],
      ["Serie", "-"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "yale-erc065vgn48tf088": {
    description: "Ideal para uso en suelo liso, batería de 4hr carga continua.",
    specs: [
      ["Capacidad", "2,860 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Cushion"],
      ["Dimensiones", "Alto 2.40m × Largo 2.31m × Ancho 1.13m"], ["Mástil y elevación", "Dúplex 3.31 m"],
      ["Serie", "A968N08495L"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "moffett-m5000-6114": {
    description: "Los montacargas Moffett permiten montar/desmontar con rapidez.",
    specs: [
      ["Capacidad", "5,000 lbs"], ["Tipo", "Diesel"], ["Tipo de llanta", "Neumática"],
      ["Dimensiones", "Alto 2.85m × Largo 2.50m × Ancho 2.56m"], ["Mástil y elevación", "Dúplex 3.66 m"],
      ["Serie", "6114"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "raymond-easi-r45tt": {
    description: "",
    specs: [
      ["Capacidad", "5,350 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Cushion"],
      ["Dimensiones", "Alto 3.58m × Largo 2.06m × Ancho 1.34m"], ["Mástil y elevación", "Tríplex 7.11 m"],
      ["Serie", "EZ-D-05-32642"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "jlg-2030es": {
    description: "",
    specs: [
      ["Capacidad", "3,700 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Sólidas"],
      ["Dimensiones", "Alto 2.38m × Largo 2.29m × Ancho 76m"], ["Mástil y elevación", "No aplica"],
      ["Serie", "0200121174"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "yale-mpe060lfn24t2736": {
    description: "Ruedas de poliuretano que protegen pisos industriales lisos, operación eléctrica silenciosa y sin emisiones.",
    specs: [
      ["Capacidad", "6,000 lbs"], ["Tipo", "Eléctrico"], ["Tipo de llanta", "Poliuterano"],
      ["Dimensiones", "Alto 1.60m × Largo 1.92m × Ancho 95m"], ["Mástil y elevación", "No aplica"],
      ["Horómetro", "Sin pila"], ["Serie", "B896N03249F"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "yale-glp080lgngbe088": {
    description: "",
    specs: [
      ["Capacidad", "8,000 lbs"], ["Tipo", "Gas LP"], ["Tipo de llanta", "Rudomaticas"],
      ["Dimensiones", "Alto 2.20m × Largo 3.00m × Ancho 1.36m"], ["Mástil y elevación", "Tríplex 4.7 m"],
      ["Serie", "B813D02996U"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
  "nissan-mug1f2a30lv": {
    description: "Al ser un motor tan popular en México, las refacciones son muy baratas, fáciles de conseguir con cualquier proveedor local.",
    specs: [
      ["Capacidad", "6,000 lbs"], ["Tipo", "Gas LP"], ["Tipo de llanta", "Rudomatico"],
      ["Dimensiones", "Alto 2.14m × Largo 2.80m × Ancho 1.26m"], ["Mástil y elevación", "Tríplex 4.80 m"],
      ["Serie", "UG1F2-9L4261"], ["Ubicación", "Bodega Guadalajara"],
    ],
  },
};

function toSpecs(pairs) {
  return pairs.map(([label, value], i) => ({ _key: `s${i}`, _type: "object", label, value }));
}

for (const [slug, fix] of Object.entries(FIXES)) {
  await client
    .patch(`product.${slug}`)
    .set({ description: fix.description, specs: toSpecs(fix.specs) })
    .commit();
  console.log(`OK ${slug}`);
}
console.log(`Corregidos ${Object.keys(FIXES).length} productos en Sanity.`);

// Refresca también el respaldo local en disco con los mismos valores.
const backupPath = "./scripts/catalog-data/products-backup.json";
const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
const list = Array.isArray(backup) ? backup : backup.products;
for (const p of list) {
  const fix = FIXES[p.slug];
  if (!fix) continue;
  p.description = fix.description;
  p.specs = fix.specs.map(([label, value], i) => ({ _key: `s${i}`, label, value }));
}
fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
console.log("products-backup.json actualizado en disco.");
