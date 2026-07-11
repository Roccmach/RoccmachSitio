import { getTestimonials, type TestimonialData } from "@/lib/testimonials";

const COLUMNS = 3;

/** Extrae el ancho/alto reales del nombre de archivo que Sanity le pone al asset
 * (ej. "...-800x1300.jpg"), para estimar la altura de cada tarjeta sin esperar
 * a que la imagen cargue en el navegador. */
function aspectRatio(url: string): number {
  const m = url.match(/-(\d+)x(\d+)\.\w+/);
  if (!m) return 1.4;
  return Number(m[1]) / Number(m[2]);
}

/** Reparte las tarjetas en N columnas asignando cada una a la columna más corta
 * hasta el momento (bin-packing por altura estimada) — a diferencia de
 * CSS column-count, esto no deja huecos porque nosotros controlamos
 * exactamente qué tarjeta cae en qué columna. */
function packColumns(items: TestimonialData[], columns: number) {
  const heights = new Array(columns).fill(0);
  const cols: { t: TestimonialData; i: number }[][] = Array.from({ length: columns }, () => []);
  const withHeight = items.map((t, i) => ({ t, i, h: 1 / aspectRatio(t.imageUrl) }));
  // Se acomodan primero las tarjetas más altas (algoritmo LPT): reparte mucho
  // mejor entre columnas que ir en el orden original — con pocos elementos
  // (8 entre 3 columnas) el orden de llegada importa mucho para el balance.
  withHeight.sort((a, b) => b.h - a.h);
  for (const { t, i, h } of withHeight) {
    let shortest = 0;
    for (let c = 1; c < columns; c++) if (heights[c] < heights[shortest]) shortest = c;
    cols[shortest].push({ t, i });
    heights[shortest] += h;
  }
  // El empaque decide EN QUÉ columna cae cada tarjeta (por altura); el orden
  // visual dentro de cada columna sigue el orden natural de los testimonios.
  cols.forEach((col) => col.sort((a, b) => a.i - b.i));
  return cols;
}

function Card({ t, i }: { t: TestimonialData; i: number }) {
  return (
    <figure className="tm-card reveal" style={{ "--tm-delay": `${i * 0.08}s` } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={t.imageUrl} alt={t.name} loading="lazy" />
      <div className="tm-scrim-top" />
      <div className="tm-top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tm-avatar" src={t.imageUrl} alt="" aria-hidden="true" />
        <div className="tm-who">
          <b>{t.name}</b>
          {t.company && <span>{t.company}</span>}
        </div>
      </div>
      <p className="tm-cap">{t.feedback}</p>
    </figure>
  );
}

export default async function TestimonialsGrid() {
  const testimonials = await getTestimonials();
  if (!testimonials.length) return null;

  const columns = packColumns(testimonials, COLUMNS);

  return (
    <section className="block testimonials" id="testimonios">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="eyebrow">Clientes reales</div>
          <h2 className="display">Lo que dicen<br />de nosotros.</h2>
        </div>

        <div className="tm-grid">
          <div className="tm-col tm-col-mobile">
            {testimonials.map((t, i) => (
              <Card key={i} t={t} i={i} />
            ))}
          </div>
          {columns.map((col, ci) => (
            <div className="tm-col tm-col-desktop" key={ci}>
              {col.map(({ t, i }) => (
                <Card key={i} t={t} i={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
