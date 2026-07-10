"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { openQuote } from "./quote-events";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" aria-label="ROCCMACH inicio">
            <Logo />
          </Link>
          <nav className="menu">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-cta">
            <button className="burger" onClick={() => setOpen(true)} aria-label="Abrir menú">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-menu open" role="dialog" aria-modal="true">
          <button className="x" onClick={() => setOpen(false)} aria-label="Cerrar menú">✕</button>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button className="btn btn-green" style={{ marginTop: 20 }} onClick={() => { setOpen(false); openQuote(); }}>
            Comprar maquinaria
          </button>
        </div>
      )}

      <style>{`
        .mobile-menu{position:fixed;inset:0;z-index:70;background:rgba(11,11,12,.97);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
        .mobile-menu a{font-family:var(--display);font-weight:800;text-transform:uppercase;font-size:2.2rem;color:#fff;padding:12px}
        .mobile-menu a:hover{color:var(--red)}
        .mobile-menu .x{position:absolute;top:24px;right:24px;width:46px;height:46px;border-radius:12px;border:1px solid var(--line);background:none;color:#fff;font-size:1.4rem;cursor:pointer}
      `}</style>
    </>
  );
}
