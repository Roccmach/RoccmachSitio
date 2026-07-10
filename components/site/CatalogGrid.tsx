"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { buildHistogram } from "@/lib/filters";
import ProductCard from "./ProductCard";
import RangeSlider from "./RangeSlider";

const CAT_LABELS: Record<string, string> = {
  montacargas: "Montacargas",
  gruas: "Grúas",
  patines: "Patines",
  plataformas: "Plataformas",
};

type Sort = "destacados" | "price-asc" | "price-desc";
const fmtPrice = (n: number) => `$${Math.round(n / 1000)}k`;
const fmtCap = (n: number) => `${n.toLocaleString("es-MX")} lbs`;

/** Extrae la capacidad en lbs desde la ficha de specs, ej. "2,800 lbs" → 2800. */
function getCapacityLbs(p: Product): number | null {
  const spec = p.specs.find((s) => s.label === "Capacidad");
  if (!spec) return null;
  const match = spec.value.match(/([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
}

export default function CatalogGrid({
  products,
  initialCat = "all",
  title,
}: {
  products: Product[];
  initialCat?: string;
  title?: string;
}) {
  const allCats = Array.from(new Set<string>(products.map((p) => p.category)));
  const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();

  const prices = products.map((p) => p.price).filter((n) => n > 0);
  const priceMin = 0;
  const priceMax = prices.length ? Math.ceil(Math.max(...prices) / 10000) * 10000 : 100000;
  const priceHistogram = buildHistogram(prices, priceMin, priceMax);

  const caps = products.map(getCapacityLbs).filter((n): n is number => n !== null);
  const capMin = 0;
  const capMax = caps.length ? Math.ceil(Math.max(...caps) / 500) * 500 : 10000;
  const capHistogram = buildHistogram(caps, capMin, capMax);

  const validCat = allCats.includes(initialCat) ? initialCat : "all";
  const [cat, setCat] = useState(validCat);
  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax]);
  const [capRange, setCapRange] = useState<[number, number]>([capMin, capMax]);
  const [brands, setBrands] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("destacados");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const priceActive = priceRange[0] > priceMin || priceRange[1] < priceMax;
  const capActive = capRange[0] > capMin || capRange[1] < capMax;

  const inPriceRange = (price: number) => {
    if (!priceActive) return true;
    // price === 0 significa "precio a consultar": no encaja en ningún rango específico.
    if (price <= 0) return false;
    return price >= priceRange[0] && price <= priceRange[1];
  };

  const inCapRange = (cap: number | null) => {
    if (!capActive) return true;
    if (cap === null) return false;
    return cap >= capRange[0] && cap <= capRange[1];
  };

  const query = q.trim().toLowerCase();
  const searched = query
    ? products.filter((p) => `${p.brand} ${p.model} ${p.shortSpec}`.toLowerCase().includes(query))
    : products;

  // Predicados por faceta, para poder combinar "todas menos una" al calcular
  // cada conteo (igual que un marketplace real: te dice cuántos quedan si eliges esto).
  const matchCat = (p: Product) => cat === "all" || p.category === cat;
  const matchPrice = (p: Product) => inPriceRange(p.price);
  const matchCap = (p: Product) => inCapRange(getCapacityLbs(p));
  const matchBrand = (p: Product) => brands.length === 0 || brands.includes(p.brand);

  const catCounts = Object.fromEntries(
    allCats.map((c) => [c, searched.filter((p) => p.category === c && matchPrice(p) && matchCap(p) && matchBrand(p)).length])
  );
  const brandCounts = Object.fromEntries(
    allBrands.map((b) => [b, searched.filter((p) => matchCat(p) && matchPrice(p) && matchCap(p) && p.brand === b).length])
  );

  let items = searched.filter((p) => matchCat(p) && matchPrice(p) && matchCap(p) && matchBrand(p));
  if (sort === "price-asc") items = items.toSorted((a, b) => a.price - b.price);
  if (sort === "price-desc") items = items.toSorted((a, b) => b.price - a.price);

  const toggleBrand = (b: string) =>
    setBrands((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]));

  const activeCount = (cat !== "all" ? 1 : 0) + (priceActive ? 1 : 0) + (capActive ? 1 : 0) + brands.length;
  const clearAll = () => {
    setCat("all");
    setPriceRange([priceMin, priceMax]);
    setCapRange([capMin, capMax]);
    setBrands([]);
  };

  return (
    <div className="catalog-layout">
      <aside className={`cat-sidebar${filtersOpen ? " open" : ""}`}>
        <div className="cat-sidebar-inner">
        <button type="button" className="cat-sidebar-close" onClick={() => setFiltersOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12" /></svg>
          Cerrar filtros
        </button>
        <div className="facet">
          <h4>Categoría</h4>
          <label>
            <span><input type="radio" name="cat" checked={cat === "all"} onChange={() => setCat("all")} /> Todo</span>
          </label>
          {allCats.map((c) => (
            <label key={c}>
              <span><input type="radio" name="cat" checked={cat === c} onChange={() => setCat(c)} /> {CAT_LABELS[c] ?? c}</span>
              <span className="facet-count">{catCounts[c]}</span>
            </label>
          ))}
        </div>

        <div className="facet">
          <h4>Precio</h4>
          <RangeSlider
            min={priceMin}
            max={priceMax}
            value={priceRange}
            onChange={setPriceRange}
            histogram={priceHistogram}
            accent="#E4151F"
            format={fmtPrice}
          />
        </div>

        <div className="facet">
          <h4>Capacidad de carga</h4>
          <RangeSlider
            min={capMin}
            max={capMax}
            value={capRange}
            onChange={setCapRange}
            histogram={capHistogram}
            accent="#3B82C4"
            format={fmtCap}
          />
        </div>

        <div className="facet">
          <h4>Marca</h4>
          <div className="facet-scroll">
            {allBrands.map((b) => (
              <label key={b}>
                <span><input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> {b}</span>
                <span className="facet-count">{brandCounts[b]}</span>
              </label>
            ))}
          </div>
        </div>

        {activeCount > 0 && (
          <button type="button" className="clear-filters" onClick={clearAll}>
            Limpiar filtros ({activeCount})
          </button>
        )}
        </div>
      </aside>

      <div className="cat-content">
        <div className="cat-toolbar">
          {title && <h1 className="cat-h1">{title}</h1>}
          <button type="button" className="filters-toggle" onClick={() => setFiltersOpen((s) => !s)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <div className="cat-tools">
            <div className="cat-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar equipo…"
                aria-label="Buscar equipo"
              />
            </div>
            <select className="cat-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Ordenar">
              <option value="destacados">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <p className="cat-count">
          <b>{items.length}</b> equipo{items.length === 1 ? "" : "s"} {activeCount > 0 || q ? "encontrados" : "disponibles"}
        </p>

        {items.length > 0 ? (
          <div className="prod-grid">
            {items.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--steel-d)", padding: "40px 0" }}>
            No encontramos equipos con esos criterios. Escríbenos y te conseguimos lo que necesitas.
          </p>
        )}
      </div>
    </div>
  );
}
