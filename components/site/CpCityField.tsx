"use client";

import { useEffect, useRef, useState } from "react";

interface CpResult {
  city: string;
  state: string;
  label: string;
}

/**
 * CP primero → sugiere la(s) ciudad(es) dentro de ese código postal (vía
 * /api/cp/[cp]). Si solo hay una coincidencia se autocompleta sola; si hay
 * varias, se muestran como chips para elegir. La ciudad sigue siendo un campo
 * de texto libre por si el CP no resuelve nada o el usuario quiere corregirla.
 */
export default function CpCityField({
  cpId,
  cityId,
  cp,
  ciudad,
  onCpChange,
  onCiudadChange,
}: {
  cpId: string;
  cityId: string;
  cp: string;
  ciudad: string;
  onCpChange: (v: string) => void;
  onCiudadChange: (v: string) => void;
}) {
  const [results, setResults] = useState<CpResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    if (!/^\d{5}$/.test(cp)) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cp/${cp}`, { signal: controller.signal });
        const data = await res.json();
        const list: CpResult[] = data?.results ?? [];
        setResults(list);
        if (list.length === 1) onCiudadChange(list[0].label);
      } catch {
        /* CP inválido, sin internet, etc — se queda como texto libre */
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cp]);

  return (
    <>
      <div className="field">
        <label htmlFor={cpId}>Código Postal</label>
        <input
          id={cpId}
          value={cp}
          onChange={(e) => onCpChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
          placeholder="44100"
          inputMode="numeric"
          autoComplete="postal-code"
        />
      </div>
      <div className="field">
        <label htmlFor={cityId}>Ciudad</label>
        <input
          id={cityId}
          value={ciudad}
          onChange={(e) => onCiudadChange(e.target.value)}
          placeholder={loading ? "Buscando tu ciudad…" : "Se sugiere con el CP"}
        />
        {results.length > 1 && (
          <div className="cp-suggestions">
            {results.map((r) => (
              <button
                key={r.label}
                type="button"
                className={`cp-chip${ciudad === r.label ? " sel" : ""}`}
                onClick={() => onCiudadChange(r.label)}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
