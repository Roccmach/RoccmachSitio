"use client";

import { useEffect, useState, useCallback } from "react";
import { FREIGHT_QUOTE_EVENT } from "./freight-events";

const TOTAL_STEPS = 5;

const empty = {
  origenCalle: "", origenNumero: "", origenCp: "",
  destinoCalle: "", destinoNumero: "", destinoCp: "",
  tipoCarga: "", empaque: "" as "" | "Pieza" | "Caja", pesoNeto: "", pesoBruto: "",
  horarioCarga: "", horarioDescarga: "",
  name: "", company: "", phone: "", email: "",
};
type FormData = typeof empty;

interface QuoteResult {
  folio: string;
  token: string;
  distanceKm: number;
  distanceSource: "osrm" | "straight-line";
  total: number;
}

export default function FreightQuoteModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ ...empty });
  const [status, setStatus] = useState<"idle" | "loading" | "result" | "error">("idle");
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setData({ ...empty });
      setStep(1);
      setStatus("idle");
      setResult(null);
      setOpen(true);
      document.body.style.overflow = "hidden";
    };
    window.addEventListener(FREIGHT_QUOTE_EVENT, onOpen);
    return () => window.removeEventListener(FREIGHT_QUOTE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const set = (k: keyof FormData, v: string) => setData((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/flete/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: { calle: data.origenCalle, numero: data.origenNumero, cp: data.origenCp },
          destino: { calle: data.destinoCalle, numero: data.destinoNumero, cp: data.destinoCp },
          tipoCarga: data.tipoCarga,
          empaque: data.empaque,
          pesoNeto: data.pesoNeto ? Number(data.pesoNeto) : undefined,
          pesoBruto: data.pesoBruto ? Number(data.pesoBruto) : undefined,
          horarioCarga: data.horarioCarga,
          horarioDescarga: data.horarioDescarga,
          name: data.name, company: data.company, phone: data.phone, email: data.email,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error || "No pudimos calcular tu cotización. Intenta de nuevo.");
        setStatus("error");
        return;
      }
      setResult(json);
      setStatus("result");
    } catch {
      setErrorMsg("No pudimos calcular tu cotización. Revisa tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  };

  const next = () => (step < TOTAL_STEPS ? setStep(step + 1) : submit());
  const back = () => step > 1 && setStep(step - 1);

  const canAdvance =
    (step === 1 && !!data.origenCalle && !!data.origenNumero && !!data.origenCp) ||
    (step === 2 && !!data.destinoCalle && !!data.destinoNumero && !!data.destinoCp) ||
    (step === 3 && !!data.tipoCarga && !!data.empaque) ||
    (step === 4 && !!data.horarioCarga && !!data.horarioDescarga) ||
    (step === 5 && !!data.name && !!data.phone && !!data.email);

  if (!open) return null;

  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-label="Cotización de flete">
      <div className="modal-bg" onClick={close} />
      <div className="modal-card">
        <button className="x" onClick={close} aria-label="Cerrar">✕</button>

        {status === "result" && result ? (
          <div className="step on">
            <h3 className="display">¡Listo, {data.name.split(" ")[0]}!</h3>
            <p className="lead">Tu folio de cotización es <b>{result.folio}</b>. Nuestro equipo te contactará para confirmar los detalles.</p>
            <div className="summary">
              <div><span>Distancia calculada</span><b>{result.distanceKm} km</b></div>
              <div><span>Total estimado</span><b>${result.total.toLocaleString("es-MX")} MXN</b></div>
            </div>
            <div className="modal-nav">
              <a className="btn btn-green" href={`/api/flete/${result.token}/pdf`} target="_blank" rel="noopener">
                Descargar recibo PDF
              </a>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="step on">
            <h3 className="display">No pudimos calcular tu ruta</h3>
            <p className="lead">{errorMsg}</p>
            <div className="modal-nav">
              <button className="btn btn-ghost" onClick={() => setStatus("idle")}>← Revisar direcciones</button>
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
                <h3 className="display">Dirección de origen</h3>
                <p className="lead">¿Dónde recogemos la carga?</p>
                <div className="field"><label htmlFor="fq-o-calle">Calle</label><input id="fq-o-calle" value={data.origenCalle} onChange={(e) => set("origenCalle", e.target.value)} placeholder="Av. Industrias 123" /></div>
                <div className="field"><label htmlFor="fq-o-numero">Número</label><input id="fq-o-numero" value={data.origenNumero} onChange={(e) => set("origenNumero", e.target.value)} placeholder="123" /></div>
                <div className="field"><label htmlFor="fq-o-cp">Código Postal</label><input id="fq-o-cp" value={data.origenCp} onChange={(e) => set("origenCp", e.target.value)} placeholder="44100" inputMode="numeric" /></div>
              </div>
            )}

            {step === 2 && (
              <div className="step on">
                <h3 className="display">Dirección de destino</h3>
                <p className="lead">¿A dónde entregamos la carga?</p>
                <div className="field"><label htmlFor="fq-d-calle">Calle</label><input id="fq-d-calle" value={data.destinoCalle} onChange={(e) => set("destinoCalle", e.target.value)} placeholder="Calle Reforma 456" /></div>
                <div className="field"><label htmlFor="fq-d-numero">Número</label><input id="fq-d-numero" value={data.destinoNumero} onChange={(e) => set("destinoNumero", e.target.value)} placeholder="456" /></div>
                <div className="field"><label htmlFor="fq-d-cp">Código Postal</label><input id="fq-d-cp" value={data.destinoCp} onChange={(e) => set("destinoCp", e.target.value)} placeholder="06000" inputMode="numeric" /></div>
              </div>
            )}

            {step === 3 && (
              <div className="step on">
                <h3 className="display">Detalle de la carga</h3>
                <p className="lead">Cuéntanos qué vamos a transportar.</p>
                <div className="field"><label htmlFor="fq-tipo">Tipo de carga</label><input id="fq-tipo" value={data.tipoCarga} onChange={(e) => set("tipoCarga", e.target.value)} placeholder="Maquinaria, refacciones, etc." /></div>
                <div className="opt-grid" role="radiogroup" aria-label="Pieza o caja">
                  {(["Pieza", "Caja"] as const).map((v) => (
                    <button key={v} type="button" role="radio" aria-checked={data.empaque === v} className={`opt${data.empaque === v ? " sel" : ""}`} onClick={() => set("empaque", v)}>
                      <b>{v}</b>
                    </button>
                  ))}
                </div>
                <div className="field"><label htmlFor="fq-neto">Peso neto (kg)</label><input id="fq-neto" type="number" value={data.pesoNeto} onChange={(e) => set("pesoNeto", e.target.value)} placeholder="500" /></div>
                <div className="field"><label htmlFor="fq-bruto">Peso bruto (kg)</label><input id="fq-bruto" type="number" value={data.pesoBruto} onChange={(e) => set("pesoBruto", e.target.value)} placeholder="550" /></div>
              </div>
            )}

            {step === 4 && (
              <div className="step on">
                <h3 className="display">Horarios</h3>
                <p className="lead">¿Cuándo se carga y descarga?</p>
                <div className="field"><label htmlFor="fq-carga">Horario de carga</label><input id="fq-carga" value={data.horarioCarga} onChange={(e) => set("horarioCarga", e.target.value)} placeholder="Ej: 8:00 - 10:00 AM" /></div>
                <div className="field"><label htmlFor="fq-descarga">Horario de descarga</label><input id="fq-descarga" value={data.horarioDescarga} onChange={(e) => set("horarioDescarga", e.target.value)} placeholder="Ej: 2:00 - 4:00 PM" /></div>
              </div>
            )}

            {step === 5 && (
              <div className="step on">
                <h3 className="display">Tus datos</h3>
                <p className="lead">Para armar tu cotización y enviarte el recibo.</p>
                <div className="field"><label htmlFor="fq-name">Nombre</label><input id="fq-name" name="name" autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Tu nombre" /></div>
                <div className="field"><label htmlFor="fq-company">Empresa</label><input id="fq-company" name="organization" autoComplete="organization" value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Nombre de tu empresa" /></div>
                <div className="field"><label htmlFor="fq-phone">Teléfono</label><input id="fq-phone" name="tel" autoComplete="tel" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="33 0000 0000" /></div>
                <div className="field"><label htmlFor="fq-email">Correo</label><input id="fq-email" name="email" autoComplete="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@empresa.com" /></div>
              </div>
            )}

            <div className="modal-nav">
              {step > 1 && <button className="btn btn-ghost" onClick={back}>← Atrás</button>}
              <button className="btn btn-green" onClick={next} disabled={!canAdvance || status === "loading"}>
                {status === "loading" ? "Calculando ruta…" : step === TOTAL_STEPS ? "Calcular cotización" : "Continuar →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
