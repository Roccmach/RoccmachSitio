"use client";

import { openFreightQuote } from "./freight-events";

export default function FreightQuoteTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => openFreightQuote()}>
      {children}
    </button>
  );
}
