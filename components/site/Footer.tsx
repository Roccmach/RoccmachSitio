import Link from "next/link";
import Logo from "./Logo";
import { BRAND, waLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="site" id="contacto">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" aria-label="ROCCMACH inicio"><Logo /></Link>
            <p>Maquinaria industrial con respaldo real. Venta, renta, refacciones y servicio en todo México.</p>
            <div className="socials">
              <a href={waLink("Hola ROCCMACH, quiero información")} aria-label="WhatsApp" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2" /></svg>
              </a>
              <a href={BRAND.socials.instagram} aria-label="Instagram" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
              </a>
              <a href={BRAND.socials.facebook} aria-label="Facebook" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7c0-1 .3-1.5 1.5-1.5H17V2h-2.8C11.5 2 10 3.6 10 6.2V9H7.5v3.5H10V22h4v-9.5h2.7l.5-3.5z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h5>Catálogo</h5>
            <Link href="/catalogo?cat=montacargas">Montacargas</Link>
            <Link href="/catalogo?cat=gruas">Grúas</Link>
            <Link href="/catalogo?cat=patines">Patines</Link>
            <Link href="/catalogo?cat=plataformas">Plataformas</Link>
          </div>
          <div>
            <h5>Empresa</h5>
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/flete">Flete</Link>
            <Link href="/seguimiento">Seguir mi pedido</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
          <div>
            <h5>Contacto</h5>
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>{BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            <a href={waLink("Hola ROCCMACH")} target="_blank" rel="noopener">WhatsApp directo</a>
            <span style={{ display: "block", color: "var(--steel)", padding: "6px 0", fontSize: ".96rem" }}>{BRAND.city}</span>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} ROCCMACH Maquinaria Industrial. Todos los derechos reservados.</span>
          <div className="foot-legal">
            <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
            <Link href="/aviso-de-privacidad">Aviso de Privacidad</Link>
          </div>
          <span>Diseñado con potencia industrial.</span>
        </div>
      </div>
    </footer>
  );
}
