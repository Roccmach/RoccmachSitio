import { NextResponse } from "next/server";

interface CpResult {
  city: string;
  state: string;
  label: string;
}

interface PhotonProps {
  city?: string;
  state?: string;
  postcode?: string;
  countrycode?: string;
}

interface PhotonFeature {
  properties: PhotonProps;
}

/**
 * Ciudad(es) sugeridas para un código postal mexicano — vía Photon (mismo geocoder
 * gratuito/sin key que ya usa el resto del sitio para direcciones y autocompletado
 * de ciudad). No hay una base de datos de CPs en el proyecto; Photon ya trae el
 * postcode indexado para la mayoría de las zonas urbanas de México.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ cp: string }> }) {
  const { cp } = await params;

  if (!/^\d{5}$/.test(cp)) {
    return NextResponse.json({ ok: true, results: [] });
  }

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(`${cp}, México`)}&limit=8`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return NextResponse.json({ ok: true, results: [] });

    const data = await res.json();
    const features: PhotonFeature[] = data?.features ?? [];
    const seen = new Set<string>();
    const results: CpResult[] = [];

    for (const f of features) {
      const p = f.properties;
      if (p.countrycode !== "MX") continue;
      const city = p.city || (p.state === "Ciudad de México" ? "Ciudad de México" : null);
      if (!city) continue;
      const state = p.state || "";
      const key = `${city}|${state}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ city, state, label: state && state !== city ? `${city}, ${state}` : city });
      if (results.length >= 4) break;
    }

    return NextResponse.json({ ok: true, results });
  } catch {
    return NextResponse.json({ ok: true, results: [] });
  }
}
