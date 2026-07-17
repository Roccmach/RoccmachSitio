// Los 3 tipos de caja/remolque que se cotizan en flete — compartido entre el modal de
// direcciones (FreightQuoteModal) y el de rutas fijas (FreightRouteModal) para no duplicar
// la lista ni los íconos.

export const BOX_TYPES = ["Caja Seca", "Plana", "Low Boy"] as const;
export type BoxType = (typeof BOX_TYPES)[number];

export const BOX_TYPE_ICONS: Record<BoxType, React.ReactNode> = {
  "Caja Seca": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 8 12 3l9 5-9 5-9-5z" strokeLinejoin="round" />
      <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
      <path d="M12 13v8" />
    </svg>
  ),
  Plana: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="10" width="20" height="4" rx="1" strokeLinejoin="round" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </svg>
  ),
  "Low Boy": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M2 15h4l2-4h8l2 4h4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18.5" r="2" />
      <circle cx="17" cy="18.5" r="2" />
    </svg>
  ),
};
