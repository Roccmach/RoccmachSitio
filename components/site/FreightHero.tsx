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

    const isMobile = () => window.innerWidth < 760;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.style.height = "100svh";
      if (isMobile()) {
        sticky.style.setProperty("--fh-w", "62vw");
        sticky.style.setProperty("--fh-h", "42vh");
      } else {
        sticky.style.setProperty("--fh-w", "min(440px, 28vw)");
        sticky.style.setProperty("--fh-h", "58vh");
      }
      return;
    }

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 760;
      // En mobile vw*0.28 da una tarjeta inicial angostísima (retrato extremo,
      // vh domina el alto): se ancla el ancho a una proporción de vh en vez de
      // vw para que la tarjeta chica se vea proporcionada, no un rectángulo.
      const startW = mobile ? vh * 0.3 : Math.min(440, vw * 0.28);
      const startH = mobile ? vh * 0.42 : vh * 0.58;
      const txMax = mobile ? 95 : 60;
      sticky.style.setProperty("--fh-w", `${startW + (vw - startW) * p}px`);
      sticky.style.setProperty("--fh-h", `${startH + (vh - startH) * p}px`);
      sticky.style.setProperty("--fh-r", `${18 * (1 - p)}px`);
      sticky.style.setProperty("--fh-tx", `${txMax * p}vw`);
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
    <section className="fh-hero" ref={sectionRef}>
      <div className="fh-sticky" ref={stickyRef}>
        <div className="fh-bg" aria-hidden="true" />
        <p className="fh-eyebrow">Flete</p>
        <div className="fh-wrap">
          <video
            className="fh-video"
            src="/flete-hero.mp4"
            poster="/flete-banner.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
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
  );
}
