"use client";

import { openQuote, type QuoteProduct } from "./quote-events";

export default function QuoteTrigger({
  className,
  children,
  category,
  product,
}: {
  className?: string;
  children: React.ReactNode;
  category?: string;
  product?: QuoteProduct;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openQuote(product ? { product } : category ? { category } : undefined)}
    >
      {children}
    </button>
  );
}
