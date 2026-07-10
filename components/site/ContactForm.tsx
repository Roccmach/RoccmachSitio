"use client";

import { useState } from "react";
import { BRAND, waLink } from "@/lib/config";

const CATS = ["Montacargas", "Grúa", "Patín", "Plataforma", "Refacciones", "Servicio"];

export default function ContactForm() {
  const [f, setF] = useState({ nombre: "", empresa: "", tel: "", interes: CATS[0], msg: "" });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `Hola ${BRAND.name} 👋%0A%0A` +
      `👤 ${f.nombre}%0A` +
      `🏢 ${f.empresa || "—"}%0A` +
      `📱 ${f.tel}%0A` +
      `🔧 Interés: ${f.interes}%0A` +
      `📝 ${f.msg || "—"}`;
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <form className="form-card reveal" onSubmit={onSubmit}>
      <div className="fld">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="name" autoComplete="name" required value={f.nombre} onChange={set("nombre")} placeholder="Tu nombre" />
      </div>
      <div className="fld">
        <label htmlFor="empresa">Empresa</label>
        <input id="empresa" name="organization" autoComplete="organization" value={f.empresa} onChange={set("empresa")} placeholder="Nombre de tu empresa" />
      </div>
      <div className="fld">
        <label htmlFor="tel">WhatsApp / Teléfono</label>
        <input id="tel" name="tel" autoComplete="tel" required type="tel" value={f.tel} onChange={set("tel")} placeholder="33 0000 0000" />
      </div>
      <div className="fld">
        <label htmlFor="interes">¿Qué necesitas?</label>
        <select id="interes" value={f.interes} onChange={set("interes")}>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="fld">
        <label htmlFor="msg">Mensaje</label>
        <textarea id="msg" value={f.msg} onChange={set("msg")} placeholder="Cuéntanos qué buscas..." />
      </div>
      <button type="submit" className="btn btn-red" style={{ width: "100%", justifyContent: "center" }}>
        <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2" /></svg>
        Enviar por WhatsApp
      </button>
    </form>
  );
}
