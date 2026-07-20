"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeroSlideData } from "@/lib/hero";

const ROTATE_MS = 6500;

/** Parte el título en palabras para que se "armen" una por una al entrar
 * (en vez de aparecer de golpe) — cada palabra queda enmascarada en su
 * propio span (overflow hidden) y sube con un pequeño retraso escalonado. */
function buildWords(title: string) {
  const words = title.split(" ");
  return words.flatMap((word, i) => {
    const nodes: React.ReactNode[] = [
      <span className="word" key={`w${i}`}>
        <span style={{ animationDelay: `${(0.08 + i * 0.05).toFixed(3)}s` }}>{word}</span>
      </span>,
    ];
    if (i < words.length - 1) nodes.push(" ");
    return nodes;
  });
}

function CtaLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const total = slides.length;

  useEffect(() => {
    if (total <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % total);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [total]);

  // Al hacer scroll, el contenido del hero se desliza hacia arriba y se
  // desvanece un poco más lento que el scroll — sensación de profundidad al
  // "salir" de la escena, en vez de que la sección se corte de golpe.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / window.innerHeight));
      section.style.setProperty("--hero-exit", p.toFixed(3));
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

  const slide = slides[index];

  return (
    <section
      className="hero hero-photo"
      id="top"
      ref={sectionRef}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="hero-bg">
        <div className="blade" data-parallax="0.10" />
        <div className="grid-lines" data-parallax="0.04" />
        <div className="hero-orb" data-parallax="0.14" aria-hidden="true" />
      </div>

      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero-photo-bg${i === index ? " on" : ""}`}
          style={{ backgroundImage: `url(${s.imageUrl})` }}
          data-parallax="0.05"
          aria-hidden={i !== index}
        />
      ))}
      <div className="hero-photo-scrim" />

      <div className="hero-inner wrap">
        <div className="eyebrow" style={{ opacity: 0, animation: "fade .8s .35s var(--ease) forwards" }}>
          Maquinaria industrial · Guadalajara, México
        </div>
        {slide.title && (
          <h1 className="display hero-photo-title" key={`title-${index}`}>
            {buildWords(slide.title)}
          </h1>
        )}
        {slide.subtitle && <p className="hero-sub">{slide.subtitle}</p>}
        {slide.ctaHref && (
          <div className="hero-cta">
            <CtaLink href={slide.ctaHref} className="btn btn-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              {slide.ctaLabel || "Ver catálogo"}
            </CtaLink>
          </div>
        )}
        <div className="hero-meta">
          <div className="m"><b>+15<i>años</i></b><span>de experiencia</span></div>
          <div className="m"><b>500<i>+</i></b><span>equipos entregados</span></div>
          <div className="m"><b>15<i>+</i></b><span>marcas líderes</span></div>
          <div className="m"><b>24/7</b><span>servicio y refacciones</span></div>
        </div>
      </div>

      {total > 1 && (
        <div className="hero-dots" role="tablist" aria-label="Imágenes del hero">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Ver imagen ${i + 1}`}
              className={i === index ? "on" : ""}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}

      <div className="scroll-hint"><div className="mouse" />Scroll</div>
    </section>
  );
}
