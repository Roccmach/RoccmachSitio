const CELL_COUNT = 260;

/** Retícula de ingeniería interactiva: cada celda se ilumina en rojo al pasar el cursor.
 * Puro CSS (:hover), sin JS ni dependencias nuevas — mismo lenguaje visual que la
 * retícula/rayas de señalética ya usadas en hero/cards, pero interactiva. */
export default function HoverGrid({ className }: { className?: string }) {
  return (
    <div className={`hover-grid${className ? ` ${className}` : ""}`} aria-hidden="true">
      {Array.from({ length: CELL_COUNT }).map((_, i) => (
        <div key={i} className="hg-cell" />
      ))}
    </div>
  );
}
