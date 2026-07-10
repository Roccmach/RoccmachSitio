/** Agrupa valores numéricos en N cubetas para dibujar un histograma (tipo Trivago)
 *  detrás de un slider de rango. Valores <= domainMin (ej. precio 0 = "a consultar")
 *  se excluyen — no representan un punto real en la distribución. */
export function buildHistogram(values: number[], domainMin: number, domainMax: number, buckets = 20): number[] {
  const counts = new Array(buckets).fill(0);
  const span = domainMax - domainMin || 1;
  for (const v of values) {
    if (v <= domainMin) continue;
    const idx = Math.min(buckets - 1, Math.floor(((v - domainMin) / span) * buckets));
    counts[idx]++;
  }
  return counts;
}
