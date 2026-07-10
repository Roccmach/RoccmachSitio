"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { openQuote } from "./quote-events";

const LINKS = [
  {
    href: "/",
    label: "Inicio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
    ),
  },
  {
    href: "/nosotros",
    label: "Nosotros",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></svg>
    ),
  },
  {
    href: "/catalogo",
    label: "Catálogo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
    ),
  },
  {
    href: "/contacto",
    label: "Contacto",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.6 8.6 0 0 1-4-1L3 20l1.3-3.9A8.38 8.38 0 0 1 4 12.5 8.38 8.38 0 0 1 12.5 4 8.38 8.38 0 0 1 21 12.4z" /></svg>
    ),
  },
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
          <nav className="mm-list">
            {LINKS.map((l, i) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="mm-ic">{l.icon}</span>
                {l.label}
                <svg className="mm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 6l6 6-6 6" /></svg>
              </Link>
            ))}
          </nav>
          <button className="btn btn-green" style={{ marginTop: 8 }} onClick={() => { setOpen(false); openQuote(); }}>
            Comprar maquinaria
          </button>
        </div>
      )}

      <style>{`
        .mobile-menu{position:fixed;inset:0;z-index:70;background:rgba(11,11,12,.97);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 20px}
        .mobile-menu .x{position:absolute;top:calc(env(safe-area-inset-top,0px) + 24px);right:24px;width:46px;height:46px;border-radius:12px;border:1px solid var(--line);background:none;color:#fff;font-size:1.4rem;cursor:pointer;transition:.25s}
        .mobile-menu .x:hover{background:var(--red);border-color:var(--red)}
        .mm-list{display:flex;flex-direction:column;gap:10px;width:100%;max-width:420px;margin:0 auto 22px}
        .mm-list a{
          display:flex;align-items:center;gap:14px;padding:15px 16px;border-radius:14px;
          border:1px solid var(--line);background:rgba(255,255,255,.03);color:#fff;
          font-family:var(--display);font-weight:800;text-transform:uppercase;font-size:1.1rem;letter-spacing:.02em;
          opacity:0;animation:mm-in .45s var(--ease) forwards;transition:border-color .25s,background .25s;
        }
        @keyframes mm-in{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none}}
        .mm-list a:hover,.mm-list a:active{border-color:rgba(228,21,31,.5);background:rgba(228,21,31,.1)}
        .mm-ic{width:40px;height:40px;border-radius:10px;background:rgba(228,21,31,.16);color:var(--red);display:grid;place-items:center;flex:none}
        .mm-ic svg{width:19px;height:19px}
        .mm-arrow{width:16px;height:16px;margin-left:auto;color:var(--steel);flex:none;transition:.25s var(--ease)}
        .mm-list a:hover .mm-arrow,.mm-list a:active .mm-arrow{color:var(--red);transform:translateX(3px)}
        .mobile-menu .btn{width:100%;max-width:420px;justify-content:center}
      `}</style>
    </>
  );
}
