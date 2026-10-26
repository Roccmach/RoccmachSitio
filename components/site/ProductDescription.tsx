import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Product } from "@/lib/catalog";

// Solo lo que permite el mini editor del panel (sanity/schemaTypes/product.ts):
// párrafo, subtítulo, viñetas, negrita y cursiva.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3>{children}</h3>,
  },
  list: { bullet: ({ children }) => <ul>{children}</ul> },
  listItem: { bullet: ({ children }) => <li>{children}</li> },
};

/** Descripción de la ficha: la del mini editor si tiene algo; si no, el texto simple de antes
 * (respetando sus renglones con white-space: pre-line). */
export default function ProductDescription({ p }: { p: Product }) {
  if (p.descripcion?.length) {
    return (
      <div className="pd-desc-full">
        <PortableText value={p.descripcion} components={components} />
      </div>
    );
  }
  if (p.description) return <p className="pd-desc-full">{p.description}</p>;
  return null;
}
