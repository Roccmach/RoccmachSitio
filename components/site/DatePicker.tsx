"use client";

import { useEffect, useRef, useState } from "react";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Calendario propio (sin librerías) para elegir fecha — popover con navegación de mes,
 * fechas pasadas deshabilitadas por default. El valor se maneja como string "YYYY-MM-DD". */
export default function DatePicker({
  id,
  value,
  onChange,
  minToday = true,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  minToday?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? fromISO(value) : new Date()));
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = value ? fromISO(value) : null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // lunes primero
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const label = selected ? `${selected.getDate()} de ${MESES[selected.getMonth()].toLowerCase()}, ${selected.getFullYear()}` : "";

  return (
    <div className="dt-field" ref={boxRef}>
      <button type="button" id={id} className="dt-input" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        <span className={label ? "" : "ph"}>{label || "Selecciona una fecha"}</span>
      </button>
      {open && (
        <div className="dt-pop">
          <div className="dt-head">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="Mes anterior">‹</button>
            <b>{MESES[month]} {year}</b>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="Mes siguiente">›</button>
          </div>
          <div className="dt-dow">
            {DIAS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="dt-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={i} />;
              const disabled = minToday && d < today;
              const isSel = !!selected && sameDay(d, selected);
              const isToday = sameDay(d, today);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  className={`dt-day${isSel ? " sel" : ""}${isToday ? " today" : ""}`}
                  onClick={() => { onChange(toISO(d)); setOpen(false); }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
