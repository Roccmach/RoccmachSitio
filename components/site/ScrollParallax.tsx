"use client";

import { useEffect } from "react";

/**
 * Mueve cualquier elemento con [data-parallax="factor"] según qué tan lejos
 * está su centro del centro del viewport — el offset queda siempre acotado
 * por el alto de pantalla (no por scrollY absoluto), así que funciona igual
 * de bien cerca del top que hasta abajo de la página sin desbocarse.
 *
 * getBoundingClientRect() ya incluye el transform aplicado en el frame
 * anterior, así que hay que restar el offset previo antes de recalcular —
 * si no, cada frame parte de una posición ya desplazada y el offset se
 * retroalimenta (los elementos "se disparan" en vez de asentarse).
 */
export default function ScrollParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) => ({
      el,
      factor: parseFloat(el.dataset.parallax || "0"),
      py: 0,
    }));
    if (!targets.length) return;

    let ticking = false;
    const update = () => {
      const vhCenter = window.innerHeight / 2;
      for (const t of targets) {
        const rect = t.el.getBoundingClientRect();
        const naturalCenter = rect.top - t.py + rect.height / 2;
        const delta = (vhCenter - naturalCenter) * t.factor;
        t.py = delta;
        t.el.style.setProperty("--py", `${delta.toFixed(1)}px`);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
