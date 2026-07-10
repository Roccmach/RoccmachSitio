"use client";

import { useEffect } from "react";

/** Activa las animaciones .reveal cuando entran al viewport. Renderiza nada. */
export default function ScrollReveals() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => io.observe(el));
    };
    observeAll(document);

    // Elementos .reveal agregados DESPUÉS del mount (ej. tarjetas que reaparecen
    // al limpiar un filtro) nunca pasan por el escaneo inicial de arriba — sin
    // esto se quedan en opacity:0 para siempre, ocupando su celda del grid pero
    // invisibles (se ve como un hueco en blanco). El MutationObserver los detecta
    // y los pone en observación en cuanto entran al DOM.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(".reveal:not(.in)")) io.observe(node);
          observeAll(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
