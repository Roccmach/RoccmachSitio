"use client";

import { useEffect, useRef } from "react";

/**
 * Hero de /flete: una tarjeta de video redondeada que se expande a pantalla
 * completa según el scroll, mientras el título se parte en dos mitades que
 * se separan — mismo mecanismo que ScrollParallax.tsx (scroll + rAF + CSS
 * custom properties, sin librerías nuevas).
 */
export default function FreightHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.style.height = "100svh";
      return;
    }

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1;
      sticky.style.setProperty("--fh-w", `${62 + 38 * p}vw`);
      sticky.style.setProperty("--fh-h", `${86 + 14 * p}%`);
      sticky.style.setProperty("--fh-r", `${18 * (1 - p)}px`);
      sticky.style.setProperty("--fh-tx", `${60 * p}vw`);
      sticky.style.setProperty("--fh-op", `${Math.max(0, 1 - p * 3)}`);
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

  return (
    <>
      <section className="fh-hero" ref={sectionRef}>
        <div className="fh-sticky" ref={stickyRef}>
          <p className="fh-eyebrow">Flete</p>
          <div className="fh-wrap">
            <video
              className="fh-video"
              src="/flete-hero.mp4"
              poster="/flete-banner.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="fh-veil" />
          </div>
          <h1 className="fh-text">
            <span className="fh-t1">Movemos tu carga</span>
            <span className="fh-t2">con <em>precisión.</em></span>
          </h1>
          <span className="fh-hint">↓ Scroll para expandir</span>
        </div>
      </section>
      <div className="fh-sub">
        <p>
          Rutas fijas desde Guadalajara con precio pactado, o cotiza por distancia real a cualquier destino.
        </p>
      </div>
    </>
  );
}
