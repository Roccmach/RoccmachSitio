import QuoteTrigger from "./QuoteTrigger";

export default function MagicBanner() {
  return (
    <section className="block magic" id="comprar">
      <div className="blade" data-parallax="0.08" />
      <div className="magic-orb" data-parallax="0.12" aria-hidden="true" />
      <div className="magic-fleet" data-parallax="0.06" aria-hidden="true">
        <img src="/magic-fleet.png" alt="" />
      </div>
      <div className="wrap">
        <div className="eyebrow reveal" style={{ textAlign: "center" }}>Compra asistida</div>
        <h2 className="display reveal">Compra tu maquinaria<br />en <em>minutos.</em></h2>
        <p className="reveal">
          Sin llamadas eternas ni papeleo interminable. Completa tu pedido y nuestro equipo
          coordina pago y entrega directo contigo.
        </p>
        <QuoteTrigger className="btn btn-green reveal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 18, height: 18 }}>
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          Iniciar mi compra
        </QuoteTrigger>
        <div className="magic-steps reveal">
          <div className="mstep"><b>1</b><span>Elige tu equipo</span></div>
          <div className="mstep"><b>2</b><span>Comparte tus datos</span></div>
          <div className="mstep"><b>3</b><span>Coordinamos tu entrega</span></div>
        </div>
      </div>
    </section>
  );
}
