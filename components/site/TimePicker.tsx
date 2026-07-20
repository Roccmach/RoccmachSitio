"use client";

import { useEffect, useRef, useState } from "react";

function genSlots() {
  const slots: string[] = [];
  for (let h = 6; h <= 20; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}
const SLOTS = genSlots();

function fmt12(v: string) {
  if (!v) return "";
  const [hStr, m] = v.split(":");
  let h = Number(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

/** Selector de hora propio — popover con horarios comunes cada 30 min (6:00 AM–8:30 PM),
 * consistente con que esta cotización ya es aproximada (solo CP, sin dirección exacta). */
export default function TimePicker({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="dt-field" ref={boxRef}>
      <button type="button" id={id} className="dt-input" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={value ? "" : "ph"}>{value ? fmt12(value) : "Selecciona una hora"}</span>
      </button>
      {open && (
        <div className="dt-pop dt-pop-time">
          <div className="tp-grid">
            {SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                className={`tp-slot${value === s ? " sel" : ""}`}
                onClick={() => { onChange(s); setOpen(false); }}
              >
                {fmt12(s)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
