// Siembra categorías + productos en Sanity desde los datos mock.
// Uso:
//   1) Pon NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_WRITE_TOKEN en .env.local
//   2) node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("❌ Falta NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

const CATEGORIES = [
  { slug: "montacargas", title: "Montacargas", blurb: "Combustión y eléctricos, de 1.5 a 7 toneladas.", order: 1 },
  { slug: "gruas", title: "Grúas", blurb: "Telescópicas e industriales para maniobras pesadas.", order: 2 },
  { slug: "patines", title: "Patines", blurb: "Manuales y eléctricos para tarima y almacén.", order: 3 },
  { slug: "plataformas", title: "Plataformas", blurb: "De tijera y articuladas para trabajo en altura.", order: 4 },
];

const PRODUCTS = [
  { slug: "toyota-8fgcu25", brand: "Toyota", model: "8FGCU25", category: "montacargas", shortSpec: "2.5 ton · GLP · 4.7m", price: 418000, condition: "Nuevo", description: "El estándar de la industria. Montacargas GLP de 2.5 toneladas con sistema de seguridad SAS.", specs: [["Capacidad", "2,500 kg"], ["Combustible", "GLP"], ["Altura de elevación", "4,700 mm"], ["Tipo de llanta", "Neumática"]] },
  { slug: "crown-pe4500", brand: "Crown", model: "PE 4500", category: "patines", shortSpec: "2.0 ton · eléctrico", price: 42500, condition: "Nuevo", description: "Patín eléctrico de operador a bordo, ideal para recorridos largos en almacén.", specs: [["Capacidad", "2,000 kg"], ["Tipo", "Eléctrico"], ["Operación", "Operador a bordo"]] },
  { slug: "caterpillar-gp25n", brand: "Caterpillar", model: "GP25N", category: "montacargas", shortSpec: "2.5 ton · diésel", price: 389000, condition: "Seminuevo", description: "Montacargas diésel robusto para exteriores y trabajo rudo, certificado por ROCCMACH.", specs: [["Capacidad", "2,500 kg"], ["Combustible", "Diésel"], ["Altura de elevación", "4,500 mm"]] },
  { slug: "hyster-w45z", brand: "Hyster", model: "W45Z", category: "patines", shortSpec: "2.0 ton · manual", price: 18900, condition: "Nuevo", description: "Patín hidráulico manual de 2 toneladas. Resistente y de bajo mantenimiento.", specs: [["Capacidad", "2,000 kg"], ["Tipo", "Manual hidráulico"], ["Ancho de horquilla", "685 mm"]] },
  { slug: "yale-glp050", brand: "Yale", model: "GLP050", category: "montacargas", shortSpec: "2.2 ton · GLP", price: 355000, condition: "Nuevo", description: "Montacargas GLP versátil y económico de operar.", specs: [["Capacidad", "2,270 kg"], ["Combustible", "GLP"], ["Altura de elevación", "4,200 mm"]] },
  { slug: "genie-gs1930", brand: "Genie", model: "GS-1930", category: "plataformas", shortSpec: "5.8m · eléctrica", price: 285000, condition: "Seminuevo", description: "Plataforma de tijera eléctrica compacta para trabajo en interiores.", specs: [["Altura de trabajo", "5.8 m"], ["Capacidad", "227 kg"], ["Energía", "Eléctrica"]] },
  { slug: "clark-c25", brand: "Clark", model: "C25", category: "montacargas", shortSpec: "2.5 ton · gasolina", price: 298000, condition: "Seminuevo", description: "Montacargas a gasolina confiable y de arranque inmediato.", specs: [["Capacidad", "2,500 kg"], ["Combustible", "Gasolina"], ["Altura de elevación", "4,000 mm"]] },
  { slug: "jlg-1230es", brand: "JLG", model: "1230ES", category: "plataformas", shortSpec: "3.6m · vertical", price: 46800, condition: "Nuevo", description: "Elevador vertical de personal de bajo perfil para pasillos estrechos.", specs: [["Altura de trabajo", "3.6 m"], ["Capacidad", "159 kg"], ["Energía", "Eléctrica"]] },
  { slug: "manitou-mt625", brand: "Manitou", model: "MT 625", category: "gruas", shortSpec: "2.5 ton · telescópica", price: 1250000, condition: "Nuevo", description: "Manipulador telescópico todo terreno para obra, agro e industria pesada.", specs: [["Capacidad", "2,500 kg"], ["Altura de elevación", "5.85 m"], ["Tracción", "4x4"]] },
  { slug: "raymond-8410", brand: "Raymond", model: "8410", category: "patines", shortSpec: "2.7 ton · eléctrico", price: 38500, condition: "Seminuevo", description: "Patín eléctrico de plataforma plegable, alta productividad en recibo y embarque.", specs: [["Capacidad", "2,700 kg"], ["Tipo", "Eléctrico"], ["Operación", "Plataforma plegable"]] },
  { slug: "komatsu-fg25", brand: "Komatsu", model: "FG25", category: "montacargas", shortSpec: "2.5 ton · GLP", price: 362000, condition: "Nuevo", description: "Montacargas GLP con motor Komatsu de bajo consumo, para doble turno.", specs: [["Capacidad", "2,500 kg"], ["Combustible", "GLP"], ["Altura de elevación", "4,500 mm"]] },
  { slug: "toyota-bt-levio", brand: "Toyota", model: "BT Levio", category: "patines", shortSpec: "1.6 ton · walkie", price: 49900, condition: "Nuevo", description: "Patín eléctrico tipo walkie compacto y maniobrable.", specs: [["Capacidad", "1,600 kg"], ["Tipo", "Eléctrico walkie"], ["Timón", "Ergonómico"]] },
];

async function run() {
  const tx = client.transaction();

  for (const c of CATEGORIES) {
    tx.createOrReplace({
      _id: `category.${c.slug}`,
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      blurb: c.blurb,
      order: c.order,
    });
  }

  for (const p of PRODUCTS) {
    tx.createOrReplace({
      _id: `product.${p.slug}`,
      _type: "product",
      brand: p.brand,
      model: p.model,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: `category.${p.category}` },
      price: p.price,
      condition: p.condition,
      shortSpec: p.shortSpec,
      description: p.description,
      specs: p.specs.map(([label, value], i) => ({ _key: `s${i}`, label, value })),
      available: true,
      featured: false,
    });
  }

  await tx.commit();
  console.log(`✅ Sembrados ${CATEGORIES.length} categorías y ${PRODUCTS.length} equipos en "${dataset}".`);
}

run().catch((e) => {
  console.error("❌ Error al sembrar:", e.message);
  process.exit(1);
});
