"use client";

import { useEffect, useState, useCallback } from "react";
import { formatMXN } from "@/lib/config";
import { QUOTE_EVENT, type QuotePrefill, type QuoteProduct } from "./quote-events";
import CityStateAutocomplete from "./CityStateAutocomplete";

const CATS = [
  { key: "Montacargas", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 17V7h7v10" /><path d="M10 9h4l3 4v4" /><circle cx="6" cy="19" r="2" /><circle cx="16" cy="19" r="2" /></svg> },
  { key: "Grúa", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 21V8l8-4 2 4" /><path d="M14 8h7l-3 5" /><circle cx="7" cy="19" r="2" /></svg> },
  { key: "Patín", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6v8h12" /><path d="M9 4h6v6H9z" /><circle cx="6" cy="20" r="1.6" /></svg> },
  { key: "Plataforma", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 20h10" /><path d="M5 20l3-12 4 2" /><circle cx="6" cy="20" r="1.6" /></svg> },
];
const MODOS = [
  { key: "Compra", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg> },
  { key: "Renta", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-9-9" /><path d="M12 7v5l3 2" /></svg> },
  { key: "Seminuevo", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 7L9 18l-5-5" /></svg> },
  { key: "Refacciones", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg> },
];

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

const empty = {
  product: undefined as QuoteProduct | undefined,
  cat: "", modo: "", name: "", company: "", phone: "", email: "", city: "",
};
type FormData = typeof empty;

export default function QuoteModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ ...empty });
  const [sending, setSending] = useState(false);

  const isProductFlow = !!data.product;
  const totalSteps = isProductFlow ? 2 : 4;
  const dataStepIndex = isProductFlow ? 1 : 3;
  const confirmStepIndex = totalSteps;

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<QuotePrefill>).detail || {};
      setData({ ...empty, cat: detail.category || "", product: detail.product });
      setStep(1);
      setOpen(true);
      document.body.style.overflow = "hidden";
    };
    window.addEventListener(QUOTE_EVENT, onOpen);
    return () => window.removeEventListener(QUOTE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const set = (k: keyof FormData, v: string) => setData((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setSending(true);
    const equipo = data.product ? `${data.product.brand} ${data.product.model}` : data.cat || "—";

    // 1) Crea el pedido (folio + link de seguimiento), igual que una compra pagada con MP.
    let orderNumber: string | undefined;
    let token: string | undefined;
    try {
      const res = await fetch("/api/orders/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name, company: data.company, phone: data.phone, email: data.email, city: data.city,
          productTitle: equipo, productPrice: data.product?.price,
        }),
      });
      const json = await res.json();
      orderNumber = json.orderNumber;
      token = json.token;
    } catch { /* si falla, seguimos a WhatsApp sin folio */ }

    setSending(false);
    close();

    // 2) El cliente aterriza directo en su propia página de seguimiento, con folio y estatus
    // real — ya NO se abre WhatsApp automáticamente (a Issac le distraía perder el foco de
    // pestaña hacia WhatsApp cuando lo que importa es que el cliente vea su pedido creado).
    if (token) window.location.href = `/seguimiento/${token}?welcome=1`;
  };

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else submit();
  };
  const back = () => step > 1 && setStep(step - 1);

  const canAdvance =
    (!isProductFlow && step === 1 && !!data.cat) ||
    (!isProductFlow && step === 2 && !!data.modo) ||
    (step === dataStepIndex && !!data.name && !!data.phone && !!data.email) ||
    step === confirmStepIndex;

  if (!open) return null;

  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-label="Solicitud de compra">
      <div className="modal-bg" onClick={close} />
      <div className="modal-card">
        <button className="x" onClick={close} aria-label="Cerrar">✕</button>
        <div className="steps-dots">
          {Array.from({ length: totalSteps }, (_, i) => (
            <i key={i} className={i + 1 <= step ? "on" : ""} />
          ))}
        </div>

        {!isProductFlow && step === 1 && (
          <div className="step on">
            <h3 className="display">¿Qué necesitas?</h3>
            <p className="lead">Elige el tipo de maquinaria que quieres comprar.</p>
            <div className="opt-grid">
              {CATS.map((c) => (
                <div key={c.key} className={`opt${data.cat === c.key ? " sel" : ""}`} onClick={() => set("cat", c.key)}>
                  {c.icon}<b>{c.key}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isProductFlow && step === 2 && (
          <div className="step on">
            <h3 className="display">Modalidad</h3>
            <p className="lead">¿Cómo prefieres adquirirla?</p>
            <div className="opt-grid">
              {MODOS.map((m) => (
                <div key={m.key} className={`opt${data.modo === m.key ? " sel" : ""}`} onClick={() => set("modo", m.key)}>
                  {m.icon}<b>{m.key}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === dataStepIndex && (
          <div className="step on">
            {data.product && (
              <div className="modal-product">
                <b>{data.product.brand} {data.product.model}</b>
                {data.product.price > 0 && <span>{formatMXN(data.product.price)} MXN + IVA</span>}
              </div>
            )}
            <h3 className="display">Completa tu compra</h3>
            <p className="lead">Déjanos tus datos y coordinamos pago y entrega directo contigo.</p>
            <div className="field"><label>Nombre</label><input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Tu nombre" /></div>
            <div className="field"><label>Empresa</label><input value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Nombre de tu empresa" /></div>
            <div className="field"><label>WhatsApp / Teléfono</label><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="33 0000 0000" /></div>
            <div className="field"><label>Correo</label><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@empresa.com" /></div>
            <div className="field">
              <label>Ciudad de entrega</label>
              <CityStateAutocomplete value={data.city} onChange={(v) => set("city", v)} />
            </div>
          </div>
        )}

        {step === confirmStepIndex && (
          <div className="step on">
            <h3 className="display">Confirma tu pedido</h3>
            <p className="lead">
              Revisa tus datos. Al confirmar, generamos tu número de pedido y te llevamos directo a tu
              página de seguimiento — nuestro equipo de ventas te contacta para coordinar todo.
            </p>
            <div className="summary">
              {data.product ? (
                <div><span>Equipo</span><b>{data.product.brand} {data.product.model}</b></div>
              ) : (
                <>
                  <div><span>Maquinaria</span><b>{data.cat || "—"}</b></div>
                  <div><span>Modalidad</span><b>{data.modo || "—"}</b></div>
                </>
              )}
              <div><span>Contacto</span><b>{data.name || "—"}</b></div>
              <div><span>Empresa</span><b>{data.company || "—"}</b></div>
              <div><span>Correo</span><b>{data.email || "—"}</b></div>
              <div><span>Ciudad</span><b>{data.city || "—"}</b></div>
            </div>
          </div>
        )}

        <div className="modal-nav">
          {step > 1 && <button className="btn btn-ghost" onClick={back}>← Atrás</button>}
          <button className="btn btn-green" onClick={next} disabled={!canAdvance || sending}>
            {sending ? "Enviando…" : step === totalSteps ? <><CartIcon /> Confirmar pedido</> : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );
}
