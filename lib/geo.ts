// Autocompletado de ciudad/estado vía Photon (geocoder gratuito de OpenStreetMap, sin API key).
// Mismo enfoque usado en faind (lib/geo.ts), aquí extendido para también devolver "estado"
// (Photon lo trae en su respuesta pero faind lo descartaba).

// Guadalajara: sede de ROCCMACH, sesga el ranking hacia pedidos cercanos sin filtrar el resto de México.
const BIAS = { lat: 20.6767, lng: -103.3475 };

export interface PlaceResult {
  label: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

interface PhotonProps {
  name?: string;
  city?: string;
  state?: string;
  district?: string;
  country?: string;
  countrycode?: string;
}

interface PhotonFeature {
  properties: PhotonProps;
  geometry: { coordinates: [number, number] };
}

function toPlace(f: PhotonFeature): PlaceResult | null {
  const p = f.properties;
  const city = p.city || p.district || p.name;
  if (!city) return null;
  const parts = [city, p.state].filter(Boolean);
  return {
    label: parts.join(", "),
    city,
    state: p.state || "",
    lng: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  };
}

/** Busca ciudades/lugares en México a partir de texto libre. */
export async function searchPlaces(q: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  if (!q || q.trim().length < 2) return [];
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${BIAS.lat}&lon=${BIAS.lng}&limit=8`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const data = await res.json();
  const features: PhotonFeature[] = data?.features ?? [];
  const seen = new Set<string>();
  const results: PlaceResult[] = [];
  for (const f of features) {
    if (f.properties.countrycode !== "MX") continue;
    const place = toPlace(f);
    if (!place) continue;
    const key = `${place.city}|${place.state}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(place);
  }
  return results.slice(0, 6);
}
