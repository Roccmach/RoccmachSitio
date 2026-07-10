// Reemplaza las fotos de los 53 equipos por las versiones con fondo transparente
// (el fondo negro original de las fotos se quitó porque generaba una "caja" visible
// distinta al fondo oscuro de la card). Uso: node --env-file=.env.local scripts/replace-images.mjs
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const IMAGES_DIR = path.join(process.cwd(), "scripts/catalog-data/images");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) { console.error("Falta projectId o token"); process.exit(1); }

const client = createClient({ projectId, dataset: "production", token, apiVersion: "2024-10-01", useCdn: false });

async function run() {
  const products = await client.fetch('*[_type=="product"]{_id,"slug":slug.current}');
  console.log(`Actualizando fotos de ${products.length} equipos…`);
  let n = 0;
  for (const p of products) {
    const file = path.join(IMAGES_DIR, `${p.slug}.png`);
    if (!fs.existsSync(file)) {
      console.warn(`  ⚠️  sin imagen para ${p.slug}`);
      continue;
    }
    const buf = fs.readFileSync(file);
    const asset = await client.assets.upload("image", buf, { filename: `${p.slug}.png` });
    await client.patch(p._id).set({ image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
    n++;
    if (n % 10 === 0) console.log(`   … ${n}/${products.length}`);
  }
  console.log(`✅ ${n} fotos reemplazadas por versión con fondo transparente.`);
}
run().catch((e) => { console.error("❌", e.message); process.exit(1); });
