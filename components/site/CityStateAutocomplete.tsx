"use client";

import { useEffect, useRef, useState } from "react";
import { searchPlaces, type PlaceResult } from "@/lib/geo";

export default function CityStateAutocomplete({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const justSelectedRef = useRef(false);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    // Evita re-buscar justo después de elegir una sugerencia (no compara contra `value`:
    // el padre se actualiza en cada tecleo, así que esa comparación siempre sería igual).
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    abortRef.current?.abort();
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const t = setTimeout(async () => {
      try {
        const places = await searchPlaces(query, controller.signal);
        setResults(places);
        setOpen(true);
        setActive(-1);
      } catch {
        /* búsqueda cancelada o falló: sin problema, el usuario puede seguir escribiendo */
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (p: PlaceResult) => {
    const label = p.state ? `${p.city}, ${p.state}` : p.city;
    justSelectedRef.current = true;
    setQuery(label);
    onChange(label);
    setOpen(false);
    setResults([]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="geo-field" ref={boxRef}>
      <input
        id={id}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Escribe tu ciudad…"
        autoComplete="off"
        aria-label="Ciudad de entrega"
        aria-expanded={open}
        role="combobox"
      />
      {open && results.length > 0 && (
        <ul className="geo-suggestions" role="listbox">
          {results.map((p, i) => (
            <li
              key={`${p.city}-${p.state}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "on" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                select(p);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {p.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
