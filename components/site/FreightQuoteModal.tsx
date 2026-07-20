"use client";

import { useEffect, useState, useCallback } from "react";
import { FREIGHT_QUOTE_EVENT } from "./freight-events";
import CpCityField from "./CpCityField";
import { BOX_TYPES, BOX_TYPE_ICONS } from "./box-types";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

const TOTAL_STEPS = 4;

const empty = {
  origenCiudad: "", origenCp: "",
  destinoCiudad: "", destinoCp: "",
  tipoCaja: "" as "" | (typeof BOX_TYPES)[number],
  tipoCarga: "", empaque: "" as "" | "Pieza" | "Caja", pesoNeto: "", pesoBruto: "",
  fechaCarga: "", horaCarga: "", fechaDescarga: "", horaDescarga: "",
  name: "", company: "", phone: "", email: "",
};
type FormData = typeof empty;

const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatFechaHora(fecha: string, hora: string) {
  if (!fecha || !hora) return "";
  const [y, m, d] = fecha.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const [hh, mm] = hora.split(":").map(Number);
  let h12 = hh % 12;
  if (h12 === 0) h12 = 12;
  const ampm = hh >= 12 ? "PM" : "AM";
  return `${DIAS_CORTOS[date.getDay()]} ${d} ${MESES_CORTOS[m - 1]}, ${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

export default function FreightQuoteModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ ...empty });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
          origen: { ciudad: data.origenCiudad, cp: data.origenCp },
          destino: { ciudad: data.destinoCiudad, cp: data.destinoCp },
          tipoCaja: data.tipoCaja,
          tipoCarga: data.tipoCarga,
          empaque: data.empaque,
          pesoNeto: data.pesoNeto ? Number(data.pesoNeto) : undefined,
          pesoBruto: data.pesoBruto ? Number(data.pesoBruto) : undefined,
          horarioCarga: formatFechaHora(data.fechaCarga, data.horaCarga),
          horarioDescarga: formatFechaHora(data.fechaDescarga, data.horaDescarga),
          name: data.name, company: data.company, phone: data.phone, email: data.email,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error || "No pudimos calcular tu cotización. Intenta de nuevo.");
        setStatus("error");
        return;
      }
      window.location.href = `/transporte-de-carga/seguimiento/${json.token}?welcome=1`;
    } catch {
      setErrorMsg("No pudimos calcular tu cotización. Revisa tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  };

  const next = () => (step < TOTAL_STEPS ? setStep(step + 1) : submit());
  const back = () => step > 1 && setStep(step - 1);

  const canAdvance =
    (step === 1 && !!data.origenCiudad && !!data.origenCp && !!data.destinoCiudad && !!data.destinoCp) ||
    (step === 2 && !!data.tipoCaja && !!data.tipoCarga && !!data.empaque) ||
    (step === 3 && !!data.fechaCarga && !!data.horaCarga && !!data.fechaDescarga && !!data.horaDescarga) ||
    (step === 4 && !!data.name && !!data.phone && !!data.email);

  if (!open) return null;

  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-label="Cotización de transporte">
      <div className="modal-bg" onClick={close} />
      <div className="modal-card">
        <button className="x" onClick={close} aria-label="Cerrar">✕</button>

        {status === "error" ? (
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
                <h3 className="display">Origen y destino</h3>
                <p className="lead">Danos el código postal — te sugerimos la ciudad. Cotización aproximada.</p>
                <p className="lead" style={{ marginTop: 18, marginBottom: 8, fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--red)" }}>Origen</p>
                <CpCityField
                  cpId="fq-o-cp" cityId="fq-o-ciudad"
                  cp={data.origenCp} ciudad={data.origenCiudad}
                  onCpChange={(v) => set("origenCp", v)} onCiudadChange={(v) => set("origenCiudad", v)}
                />
                <p className="lead" style={{ marginTop: 18, marginBottom: 8, fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--red)" }}>Destino</p>
                <CpCityField
                  cpId="fq-d-cp" cityId="fq-d-ciudad"
                  cp={data.destinoCp} ciudad={data.destinoCiudad}
                  onCpChange={(v) => set("destinoCp", v)} onCiudadChange={(v) => set("destinoCiudad", v)}
                />
              </div>
            )}

            {step === 2 && (
              <div className="step on">
                <h3 className="display">Detalle de la carga</h3>
                <p className="lead">Cuéntanos qué vamos a transportar.</p>
                <div className="opt-grid opt-grid-3" role="radiogroup" aria-label="Tipo de caja">
                  {BOX_TYPES.map((v) => (
                    <button key={v} type="button" role="radio" aria-checked={data.tipoCaja === v} className={`opt${data.tipoCaja === v ? " sel" : ""}`} onClick={() => set("tipoCaja", v)}>
                      {BOX_TYPE_ICONS[v]}
                      <b>{v}</b>
                    </button>
                  ))}
                </div>
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

            {step === 3 && (
              <div className="step on">
                <h3 className="display">Horarios</h3>
                <p className="lead">¿Cuándo se carga y descarga?</p>
                <p className="lead" style={{ marginTop: 18, marginBottom: 8, fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--red)" }}>Carga</p>
                <div className="field-row">
                  <div className="field"><label htmlFor="fq-fecha-carga">Fecha</label><DatePicker id="fq-fecha-carga" value={data.fechaCarga} onChange={(v) => set("fechaCarga", v)} /></div>
                  <div className="field"><label htmlFor="fq-hora-carga">Hora</label><TimePicker id="fq-hora-carga" value={data.horaCarga} onChange={(v) => set("horaCarga", v)} /></div>
                </div>
                <p className="lead" style={{ marginTop: 18, marginBottom: 8, fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--red)" }}>Descarga</p>
                <div className="field-row">
                  <div className="field"><label htmlFor="fq-fecha-descarga">Fecha</label><DatePicker id="fq-fecha-descarga" value={data.fechaDescarga} onChange={(v) => set("fechaDescarga", v)} /></div>
                  <div className="field"><label htmlFor="fq-hora-descarga">Hora</label><TimePicker id="fq-hora-descarga" value={data.horaDescarga} onChange={(v) => set("horaDescarga", v)} /></div>
                </div>
              </div>
            )}

            {step === 4 && (
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
