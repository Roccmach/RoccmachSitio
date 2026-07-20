"use client";

import { useEffect, useState, useCallback } from "react";
import { FREIGHT_ROUTE_EVENT, type FreightRoutePrefill } from "./freight-route-events";
import { BOX_TYPES, BOX_TYPE_ICONS } from "./box-types";

const TOTAL_STEPS = 2;

const emptyContact = { name: "", company: "", phone: "", email: "" };
type ContactData = typeof emptyContact;

export default function FreightRouteModal() {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState<FreightRoutePrefill | null>(null);
  const [step, setStep] = useState(1);
  const [boxType, setBoxType] = useState<(typeof BOX_TYPES)[number] | "">("");
  const [contact, setContact] = useState<ContactData>({ ...emptyContact });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<FreightRoutePrefill>).detail;
      setRoute(detail);
      setStep(1);
      setBoxType("");
      setContact({ ...emptyContact });
      setStatus("idle");
      setOpen(true);
      document.body.style.overflow = "hidden";
    };
    window.addEventListener(FREIGHT_ROUTE_EVENT, onOpen);
    return () => window.removeEventListener(FREIGHT_ROUTE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const set = (k: keyof ContactData, v: string) => setContact((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (!route || !boxType) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/flete/ruta/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeSlug: route.slug,
          boxType,
          name: contact.name, company: contact.company, phone: contact.phone, email: contact.email,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error || "No pudimos generar tu cotización. Intenta de nuevo.");
        setStatus("error");
        return;
      }
      window.location.href = `/transporte-de-carga/seguimiento/${json.token}?welcome=1`;
    } catch {
      setErrorMsg("No pudimos generar tu cotización. Revisa tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  };

  const next = () => (step < TOTAL_STEPS ? setStep(step + 1) : submit());
  const back = () => step > 1 && setStep(step - 1);

  const canAdvance =
    (step === 1 && !!boxType) ||
    (step === 2 && !!contact.name && !!contact.phone && !!contact.email);

  if (!open || !route) return null;

  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-label={`Cotizar transporte a ${route.destino}`}>
      <div className="modal-bg" onClick={close} />
      <div className="modal-card">
        <button className="x" onClick={close} aria-label="Cerrar">✕</button>

        {status === "error" ? (
          <div className="step on">
            <h3 className="display">Algo no salió bien</h3>
            <p className="lead">{errorMsg}</p>
            <div className="modal-nav">
              <button className="btn btn-ghost" onClick={() => setStatus("idle")}>← Reintentar</button>
            </div>
          </div>
        ) : (
          <>
            <div className="steps-dots">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <i key={i} className={i + 1 <= step ? "on" : ""} />
              ))}
            </div>

            {step === 1 && (
              <div className="step on">
                <h3 className="display">Guadalajara → {route.destino}</h3>
                <p className="lead">¿Qué tipo de caja necesitas?</p>
                <div className="opt-grid opt-grid-3" role="radiogroup" aria-label="Tipo de caja">
                  {BOX_TYPES.map((v) => (
                    <button key={v} type="button" role="radio" aria-checked={boxType === v} className={`opt${boxType === v ? " sel" : ""}`} onClick={() => setBoxType(v)}>
                      {BOX_TYPE_ICONS[v]}
                      <b>{v}</b>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step on">
                <h3 className="display">Tus datos</h3>
                <p className="lead">Para armar tu cotización con el precio pactado.</p>
                <div className="field"><label htmlFor="fr-name">Nombre</label><input id="fr-name" name="name" autoComplete="name" value={contact.name} onChange={(e) => set("name", e.target.value)} placeholder="Tu nombre" /></div>
                <div className="field"><label htmlFor="fr-company">Empresa</label><input id="fr-company" name="organization" autoComplete="organization" value={contact.company} onChange={(e) => set("company", e.target.value)} placeholder="Nombre de tu empresa" /></div>
                <div className="field"><label htmlFor="fr-phone">Teléfono</label><input id="fr-phone" name="tel" autoComplete="tel" type="tel" value={contact.phone} onChange={(e) => set("phone", e.target.value)} placeholder="33 0000 0000" /></div>
                <div className="field"><label htmlFor="fr-email">Correo</label><input id="fr-email" name="email" autoComplete="email" type="email" value={contact.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@empresa.com" /></div>
              </div>
            )}

            <div className="modal-nav">
              {step > 1 && <button className="btn btn-ghost" onClick={back}>← Atrás</button>}
              <button className="btn btn-green" onClick={next} disabled={!canAdvance || status === "loading"}>
                {status === "loading" ? "Generando…" : step === TOTAL_STEPS ? "Ver mi cotización" : "Continuar →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
