// Catálogo mock (Fase 1). En Fase 2 esto se reemplaza por queries a Sanity,
// manteniendo la misma forma de datos.

export type CategorySlug = "montacargas" | "gruas" | "patines" | "plataformas";

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  brand: string;
  model: string;
  category: CategorySlug;
  shortSpec: string;
  price: number;
  condition: "Nuevo" | "Seminuevo";
  description: string;
  specs: Spec[];
  imageUrl?: string; // presente cuando viene de Sanity
}

export const CATEGORIES: { slug: CategorySlug; name: string; blurb: string }[] = [
  { slug: "montacargas", name: "Montacargas", blurb: "Combustión y eléctricos, de 1.5 a 7 toneladas." },
  { slug: "gruas", name: "Grúas", blurb: "Telescópicas e industriales para maniobras pesadas." },
  { slug: "patines", name: "Patines", blurb: "Manuales y eléctricos para tarima y almacén." },
  { slug: "plataformas", name: "Plataformas", blurb: "De tijera y articuladas para trabajo en altura." },
];

export const PRODUCTS: Product[] = [
  {
    slug: "toyota-8fgcu25", brand: "Toyota", model: "8FGCU25", category: "montacargas",
    shortSpec: "2.5 ton · GLP · 4.7m", price: 418000, condition: "Nuevo",
    description: "El estándar de la industria. Montacargas de combustión GLP con capacidad de 2.5 toneladas, sistema de seguridad SAS y excelente visibilidad del mástil.",
    specs: [
      { label: "Capacidad", value: "2,500 kg" }, { label: "Combustible", value: "GLP" },
      { label: "Altura de elevación", value: "4,700 mm" }, { label: "Tipo de llanta", value: "Neumática" },
      { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "crown-pe4500", brand: "Crown", model: "PE 4500", category: "patines",
    shortSpec: "2.0 ton · eléctrico", price: 42500, condition: "Nuevo",
    description: "Patín eléctrico de operador a bordo, ideal para recorridos largos en almacén. Batería de larga duración y manejo ágil.",
    specs: [
      { label: "Capacidad", value: "2,000 kg" }, { label: "Tipo", value: "Eléctrico" },
      { label: "Operación", value: "Operador a bordo" }, { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "caterpillar-gp25n", brand: "Caterpillar", model: "GP25N", category: "montacargas",
    shortSpec: "2.5 ton · diésel", price: 389000, condition: "Seminuevo",
    description: "Montacargas diésel robusto para exteriores y trabajo rudo. Motor de alto par y transmisión confiable, revisado y certificado por ROCCMACH.",
    specs: [
      { label: "Capacidad", value: "2,500 kg" }, { label: "Combustible", value: "Diésel" },
      { label: "Altura de elevación", value: "4,500 mm" }, { label: "Condición", value: "Seminuevo certificado" },
    ],
  },
  {
    slug: "hyster-w45z", brand: "Hyster", model: "W45Z", category: "patines",
    shortSpec: "2.0 ton · manual", price: 18900, condition: "Nuevo",
    description: "Patín hidráulico manual de 2 toneladas. La herramienta básica e indispensable de cualquier almacén. Resistente y de bajo mantenimiento.",
    specs: [
      { label: "Capacidad", value: "2,000 kg" }, { label: "Tipo", value: "Manual hidráulico" },
      { label: "Ancho de horquilla", value: "685 mm" }, { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "yale-glp050", brand: "Yale", model: "GLP050", category: "montacargas",
    shortSpec: "2.2 ton · GLP", price: 355000, condition: "Nuevo",
    description: "Montacargas GLP versátil y económico de operar. Equilibrio perfecto entre desempeño y costo para operaciones de almacén medianas.",
    specs: [
      { label: "Capacidad", value: "2,270 kg" }, { label: "Combustible", value: "GLP" },
      { label: "Altura de elevación", value: "4,200 mm" }, { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "genie-gs1930", brand: "Genie", model: "GS-1930", category: "plataformas",
    shortSpec: "5.8m · eléctrica", price: 285000, condition: "Seminuevo",
    description: "Plataforma de tijera eléctrica compacta para trabajo en interiores. Pasa por puertas estándar y opera silenciosamente sin emisiones.",
    specs: [
      { label: "Altura de trabajo", value: "5.8 m" }, { label: "Capacidad", value: "227 kg" },
      { label: "Energía", value: "Eléctrica" }, { label: "Condición", value: "Seminuevo certificado" },
    ],
  },
  {
    slug: "clark-c25", brand: "Clark", model: "C25", category: "montacargas",
    shortSpec: "2.5 ton · gasolina", price: 298000, condition: "Seminuevo",
    description: "Montacargas a gasolina confiable y de arranque inmediato. Excelente opción de entrada para operaciones que arrancan o necesitan respaldo.",
    specs: [
      { label: "Capacidad", value: "2,500 kg" }, { label: "Combustible", value: "Gasolina" },
      { label: "Altura de elevación", value: "4,000 mm" }, { label: "Condición", value: "Seminuevo certificado" },
    ],
  },
  {
    slug: "jlg-1230es", brand: "JLG", model: "1230ES", category: "plataformas",
    shortSpec: "3.6m · vertical", price: 46800, condition: "Nuevo",
    description: "Elevador vertical de personal de bajo perfil. Ideal para mantenimiento, instalación y picking en pasillos estrechos.",
    specs: [
      { label: "Altura de trabajo", value: "3.6 m" }, { label: "Capacidad", value: "159 kg" },
      { label: "Energía", value: "Eléctrica" }, { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "manitou-mt625", brand: "Manitou", model: "MT 625", category: "gruas",
    shortSpec: "2.5 ton · telescópica", price: 1250000, condition: "Nuevo",
    description: "Manipulador telescópico todo terreno. Alcance y altura para obra, agro e industria pesada. Maniobra cargas donde otros no llegan.",
    specs: [
      { label: "Capacidad", value: "2,500 kg" }, { label: "Altura de elevación", value: "5.85 m" },
      { label: "Tracción", value: "4x4" }, { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "raymond-8410", brand: "Raymond", model: "8410", category: "patines",
    shortSpec: "2.7 ton · eléctrico", price: 38500, condition: "Seminuevo",
    description: "Patín eléctrico de plataforma plegable. Productividad alta en recibo y embarque, con la durabilidad legendaria de Raymond.",
    specs: [
      { label: "Capacidad", value: "2,700 kg" }, { label: "Tipo", value: "Eléctrico" },
      { label: "Operación", value: "Plataforma plegable" }, { label: "Condición", value: "Seminuevo certificado" },
    ],
  },
  {
    slug: "komatsu-fg25", brand: "Komatsu", model: "FG25", category: "montacargas",
    shortSpec: "2.5 ton · GLP", price: 362000, condition: "Nuevo",
    description: "Montacargas GLP con motor Komatsu de bajo consumo. Construido para durar en operaciones intensivas de doble turno.",
    specs: [
      { label: "Capacidad", value: "2,500 kg" }, { label: "Combustible", value: "GLP" },
      { label: "Altura de elevación", value: "4,500 mm" }, { label: "Condición", value: "Nuevo" },
    ],
  },
  {
    slug: "toyota-bt-levio", brand: "Toyota", model: "BT Levio", category: "patines",
    shortSpec: "1.6 ton · walkie", price: 49900, condition: "Nuevo",
    description: "Patín eléctrico tipo walkie compacto y maniobrable. Perfecto para tiendas, andenes y almacenes con espacio limitado.",
    specs: [
      { label: "Capacidad", value: "1,600 kg" }, { label: "Tipo", value: "Eléctrico walkie" },
      { label: "Timón", value: "Ergonómico" }, { label: "Condición", value: "Nuevo" },
    ],
  },
];

export const getProducts = (cat?: string) =>
  !cat || cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const categoryName = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? "Equipo";
