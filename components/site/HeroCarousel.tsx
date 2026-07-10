"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeroSlideData } from "@/lib/hero";

const ROTATE_MS = 6500;

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

  const slide = slides[index];

  return (
    <section
      className="hero hero-photo"
      id="top"
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
        <div className="eyebrow">Maquinaria industrial · Guadalajara, México</div>
        {slide.title && <h1 className="display hero-photo-title">{slide.title}</h1>}
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
