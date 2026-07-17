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

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Geocodifica una dirección completa (calle, número, CP) a un solo punto — para cotizador de flete. */
export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  if (!query || query.trim().length < 3) return null;
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${BIAS.lat}&lon=${BIAS.lng}&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    const f: PhotonFeature | undefined = data?.features?.[0];
    if (!f) return null;
    const [lng, lat] = f.geometry.coordinates;
    return { lat, lng };
  } catch {
    return null;
  }
}

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export interface RoadDistance {
  km: number;
  /** "osrm" = ruta real por carretera. "straight-line" = respaldo si OSRM no responde a tiempo. */
  source: "osrm" | "straight-line";
}

/**
 * Distancia por carretera entre 2 puntos vía OSRM (servidor demo público, gratis, sin API key).
 * Timeout corto (5s) para que el cotizador nunca se sienta lento — si OSRM no responde a
 * tiempo o falla, cae a línea recta (siempre disponible, instantáneo).
 */
export async function getRoadDistanceKm(a: GeoPoint, b: GeoPoint): Promise<RoadDistance> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      const meters = data?.routes?.[0]?.distance;
      if (typeof meters === "number") return { km: meters / 1000, source: "osrm" };
    }
  } catch {
    /* OSRM lento/caído: seguimos con línea recta abajo */
  }
  return { km: haversineKm(a, b), source: "straight-line" };
}
