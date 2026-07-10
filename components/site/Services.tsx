const SERVICES = [
  {
    n: "01",
    key: "venta",
    title: "Venta",
    accent: "#E4151F",
    desc: "Montacargas nuevos y seminuevos certificados de las mejores marcas, listos para trabajar desde el día uno.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M6 21 L24 9 L42 21" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 21 V39 H38 V21" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <g className="ship-box">
          <rect x="18.5" y="27" width="11" height="10" rx="1.5" fill="currentColor" />
          <path d="M18.5 31 H29.5" stroke="#210709" strokeWidth={1.6} />
          <path d="M24 27 V37" stroke="#210709" strokeWidth={1.6} />
        </g>
      </svg>
    ),
  },
  {
    n: "02",
    key: "renta",
    title: "Renta",
    accent: "#F2A93B",
    desc: "Equipo por día, semana o proyecto. Flexibilidad total sin inmovilizar tu capital ni preocuparte por mantenimiento.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <circle className="renta-ring" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} strokeDasharray="5 7" opacity={0.45} />
        <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth={2.6} />
        <line x1="24" y1="24" x2="31" y2="24" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" opacity={0.55} />
        <line className="clock-hand" x1="24" y1="24" x2="24" y2="13" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" />
        <circle cx="24" cy="24" r="2.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: "03",
    key: "refa",
    title: "Refacciones",
    accent: "#3B82C4",
    desc: "Inventario de partes originales y compatibles para que un paro nunca te cueste un día de producción.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <g className="gear-a">
          <circle cx="18" cy="20" r="8" stroke="currentColor" strokeWidth={5} strokeDasharray="2.6 3.4" />
          <circle cx="18" cy="20" r="3" fill="currentColor" />
        </g>
        <g className="gear-b">
          <circle cx="31" cy="30" r="6" stroke="currentColor" strokeWidth={4} strokeDasharray="2.2 3" opacity={0.9} />
          <circle cx="31" cy="30" r="2.2" fill="currentColor" />
        </g>
      </svg>
    ),
  },
  {
    n: "04",
    key: "serv",
    title: "Servicio",
    accent: "#7C6CF2",
    desc: "Mantenimiento preventivo y correctivo con técnicos certificados. Te visitamos donde estés, cuando lo necesites.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <circle className="serv-pulse" cx="24" cy="23" r="18" stroke="currentColor" strokeWidth={2} />
        <path d="M24 7 l13 4.5 v9 c0 8.5 -5.5 13.5 -13 16 c-7.5 -2.5 -13 -7.5 -13 -16 v-9 z" stroke="currentColor" strokeWidth={2.6} strokeLinejoin="round" />
        <path className="serv-check" d="M18 23 l4 4 l8 -9" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section className="block services" id="nosotros">
      <div className="svc-orb-clip" aria-hidden="true">
        <div className="svc-orb" data-parallax="0.12" />
      </div>
      <div className="wrap svc-layout">
        <div className="sec-head svc-intro reveal">
          <div className="eyebrow">Qué hacemos</div>
          <h2 className="display">Tu socio de<br />maquinaria pesada.</h2>
          <p>En ROCCMACH no solo vendemos equipo: somos el respaldo que mantiene tu almacén, obra o planta operando sin parar. Cuatro formas de trabajar contigo.</p>
        </div>
        <div className="svc-stack">
          {SERVICES.map((s, i) => (
            <div
              className="svc reveal"
              key={s.n}
              style={{ transitionDelay: `${i * 0.08}s`, "--svc-accent": s.accent } as React.CSSProperties}
            >
              <div className={`ic ic-${s.key}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
