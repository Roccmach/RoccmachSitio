import Link from "next/link";
import QuoteTrigger from "./QuoteTrigger";
import HeroCarousel from "./HeroCarousel";
import { getHeroSlides } from "@/lib/hero";

export default async function Hero() {
  const slides = await getHeroSlides();
  if (slides.length > 0) return <HeroCarousel slides={slides} />;

  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <div className="blade" data-parallax="0.10" />
        <div className="grid-lines" data-parallax="0.04" />
        <div className="hero-orb" data-parallax="0.14" aria-hidden="true" />
      </div>

      <div className="hero-rig" aria-hidden="true">
        <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#2A2A2E" strokeWidth={2}>
            <rect x="2" y="36" width="14" height="150" fill="#1A1A1D" />
            <rect x="20" y="36" width="10" height="150" fill="#161618" />
            <rect x="2" y="150" width="120" height="14" fill="#161618" />
          </g>
          <path d="M40 60 h120 a18 18 0 0 1 18 18 v60 h-30 l-12 26 H70 a30 30 0 0 1-30-30 Z" fill="#E4151F" />
          <path d="M150 60 h12 a40 40 0 0 1 40 40 v40 h-52 Z" fill="#C20F18" />
          <rect x="120" y="20" width="74" height="50" rx="4" fill="#1A1A1D" />
          <rect x="120" y="20" width="6" height="120" fill="#2A2A2E" /><rect x="188" y="20" width="6" height="120" fill="#2A2A2E" />
          <circle cx="86" cy="176" r="30" fill="#0B0B0C" stroke="#2A2A2E" strokeWidth={4} /><circle cx="86" cy="176" r="11" fill="#3A3A40" />
          <circle cx="170" cy="176" r="30" fill="#0B0B0C" stroke="#2A2A2E" strokeWidth={4} /><circle cx="170" cy="176" r="11" fill="#3A3A40" />
          <rect x="6" y="40" width="6" height="100" fill="#FFD200" />
        </svg>
      </div>

      <div className="hero-inner wrap">
        <div className="eyebrow" style={{ opacity: 0, animation: "fade .8s .35s var(--ease) forwards" }}>
          Maquinaria industrial · Guadalajara, México
        </div>
        <h1 className="display">
          <span className="line"><span>Fuerza que</span></span>
          <span className="line"><span><em>mueve</em> tu</span></span>
          <span className="line"><span>operación.</span></span>
        </h1>
        <p className="hero-sub">
          Venta, renta, refacciones y servicio de montacargas, grúas, patines y plataformas. Marcas líderes, respaldo real y entrega en todo el país.
        </p>
        <div className="hero-cta">
          <Link href="/catalogo" className="btn btn-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Ver catálogo
          </Link>
          <QuoteTrigger className="btn btn-green">Comprar maquinaria</QuoteTrigger>
        </div>
        <div className="hero-meta">
          <div className="m"><b>+15<i>años</i></b><span>de experiencia</span></div>
          <div className="m"><b>500<i>+</i></b><span>equipos entregados</span></div>
          <div className="m"><b>15<i>+</i></b><span>marcas líderes</span></div>
          <div className="m"><b>24/7</b><span>servicio y refacciones</span></div>
        </div>
      </div>

      <div className="scroll-hint"><div className="mouse" />Scroll</div>
    </section>
  );
}
