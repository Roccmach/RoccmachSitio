// Marcas reales del catálogo (scripts/catalog-data/products-backup.json), no una lista genérica.
const BRANDS = [
  "Toyota", "Caterpillar", "Hyster", "Yale", "Clark", "Crown", "Raymond", "Nissan",
  "Jungheinrich", "Big Joe", "Moffett", "Skyjack", "JLG", "EP Equipment", "Lifter",
];

export default function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {row.map((b, i) => (
          <b key={i}>{b}</b>
        ))}
      </div>
    </div>
  );
}
