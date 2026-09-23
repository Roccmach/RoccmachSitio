"use client";

import { useState } from "react";
import ForkliftIcon from "@/components/site/ForkliftIcon";

/**
 * Galería del equipo: foto grande + miniaturas debajo, patrón de ecommerce.
 *
 * Si el producto no tiene fotos adicionales (el caso de casi todo el catálogo
 * hoy), NO se pinta la fila de miniaturas y la página se ve exactamente igual
 * que antes de existir este componente.
 */
export default function ProductGallery({
  main,
  gallery,
  alt,
  badge,
}: {
  main?: string;
  gallery?: string[];
  alt: string;
  badge: React.ReactNode;
}) {
  // La principal siempre va primero; las adicionales después, sin huecos.
  const fotos = [main, ...(gallery ?? [])].filter((u): u is string => !!u);
  const [activa, setActiva] = useState(0);

  const actual = fotos[activa];

  return (
    <div className="pd-gallery">
      <div className="pd-media">
        {badge}
        {actual ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={actual} src={actual} alt={alt} style={{ width: "82%", objectFit: "contain" }} />
        ) : (
          <ForkliftIcon />
        )}
      </div>

      {fotos.length > 1 && (
        <div className="pd-thumbs" role="group" aria-label="Fotos del equipo">
          {fotos.map((url, i) => (
            <button
              key={url}
              type="button"
              className={`pd-thumb${i === activa ? " on" : ""}`}
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
              aria-pressed={i === activa}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
