// Reemplaza el catálogo mock por el catálogo REAL extraído del PDF (datos + fotos).
// Uso: node --env-file=.env.local scripts/seed-catalog.mjs
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = "/private/tmp/claude-501/-Users-issac-Claude/6ff91f12-a0ef-454a-8ff4-8e1da1d63e2d/scratchpad/catalog";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) { console.error("Falta projectId o token"); process.exit(1); }

const client = createClient({ projectId, dataset: "production", token, apiVersion: "2024-10-01", useCdn: false });

const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "products.json"), "utf8"));

const CATEGORIES = [
  { slug: "montacargas", title: "Montacargas", blurb: "Combustión y eléctricos de las mejores marcas.", order: 1 },
  { slug: "patines", title: "Patines", blurb: "Eléctricos e hidráulicos para tarima y almacén.", order: 2 },
  { slug: "plataformas", title: "Plataformas", blurb: "De tijera para trabajo en altura.", order: 3 },
];

// Destacados: primeros equipos con precio real y foto (mezcla de marcas).
const FEATURED = new Set(["hyster-w30zr", "yale-erc050vgn36te083", "caterpillar-2et4000", "skyjack-sjiii3219", "toyota-8fgu25", "nissan-mug1f2a30lv"]);

async function run() {
  console.log("🗑  Borrando catálogo anterior…");
  await client.delete({ query: '*[_type == "product"]' });
  await client.delete({ query: '*[_type == "category"]' });

  console.log("📂 Creando categorías…");
  const tx = client.transaction();
  for (const c of CATEGORIES) {
    tx.createOrReplace({ _id: `category.${c.slug}`, _type: "category", title: c.title, slug: { _type: "slug", current: c.slug }, blurb: c.blurb, order: c.order });
  }
  await tx.commit();

  console.log(`📦 Subiendo ${products.length} equipos con foto…`);
  let n = 0;
  for (const p of products) {
    let image;
    if (p.image) {
      const buf = fs.readFileSync(path.join(DATA_DIR, p.image));
      const asset = await client.assets.upload("image", buf, { filename: p.image });
      image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    }
    await client.createOrReplace({
      _id: `product.${p.slug}`,
      _type: "product",
      brand: p.brand,
      model: p.model,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: `category.${p.category}` },
      price: p.price,
      condition: "Seminuevo",
      shortSpec: p.shortSpec,
      description: p.description || "",
      specs: (p.specs || []).map((s, i) => ({ _key: `s${i}`, ...s })),
      ...(image ? { image } : {}),
      featured: FEATURED.has(p.slug),
      available: true,
    });
    n++;
    if (n % 10 === 0) console.log(`   … ${n}/${products.length}`);
  }
  console.log(`✅ Catálogo real cargado: ${CATEGORIES.length} categorías, ${n} equipos.`);
}
run().catch((e) => { console.error("❌", e.message); process.exit(1); });
