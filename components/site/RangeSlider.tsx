"use client";

/**
 * Slider de rango de doble manija con histograma de fondo (tipo Trivago),
 * hecho con 2 <input type="range"> superpuestos (transparentes, solo el thumb
 * es clickeable) en vez de arrastre manual con pointer events — da teclado,
 * touch y accesibilidad gratis sin reinventar esa lógica.
 */
export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  histogram,
  accent,
  format,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  histogram?: number[];
  accent: string;
  format?: (n: number) => string;
}) {
  const [lo, hi] = value;
  const span = max - min || 1;
  const pctLo = ((lo - min) / span) * 100;
  const pctHi = ((hi - min) / span) * 100;
  const peak = histogram && histogram.length ? Math.max(...histogram, 1) : 1;
  const fmt = format || ((n: number) => n.toLocaleString("es-MX"));

  return (
    <div className="rs" style={{ "--rs-accent": accent } as React.CSSProperties}>
      {histogram && (
        <div className="rs-hist" aria-hidden="true">
          {histogram.map((c, i) => {
            const bucketPct = (i / histogram.length) * 100;
            const inRange = bucketPct >= pctLo - 100 / histogram.length && bucketPct <= pctHi;
            return <span key={i} className={inRange ? "on" : ""} style={{ height: `${(c / peak) * 100}%` }} />;
          })}
        </div>
      )}
      <div className="rs-track">
        <div className="rs-fill" style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }} />
      </div>
      <input
        type="range"
        aria-label="Mínimo"
        min={min}
        max={max}
        value={lo}
        onChange={(e) => onChange([Math.min(+e.target.value, hi), hi])}
      />
      <input
        type="range"
        aria-label="Máximo"
        min={min}
        max={max}
        value={hi}
        onChange={(e) => onChange([lo, Math.max(+e.target.value, lo)])}
      />
      <div className="rs-labels">
        <span>{fmt(lo)}</span>
        <span>{fmt(hi)}</span>
      </div>
    </div>
  );
}
