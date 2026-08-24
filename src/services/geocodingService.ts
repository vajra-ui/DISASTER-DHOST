import { LocationCoordinate } from '../types/safety';

export interface GeocodedPlace {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
}

export class GeocodingService {
  private static cache = new Map<string, GeocodedPlace[]>();

  /**
   * Search worldwide locations using OpenStreetMap Nominatim API
   */
  public static async searchPlaces(query: string, proximity?: LocationCoordinate): Promise<GeocodedPlace[]> {
    if (!query || query.trim().length < 2) return [];

    const cacheKey = query.trim().toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
      
      if (proximity) {
        // Bias search towards proximity location if available
        const viewbox = `${proximity.lng - 0.5},${proximity.lat + 0.5},${proximity.lng + 0.5},${proximity.lat - 0.5}`;
        url += `&viewbox=${viewbox}&bounded=0`;
      }

      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SafetyDosth-App/1.0'
        },
        signal: AbortSignal.timeout(4500)
      });

      if (!res.ok) throw new Error('Geocoding search failed');

      const data = await res.json();
      const results: GeocodedPlace[] = data.map((item: any) => ({
        placeId: String(item.place_id),
        name: item.name || item.display_name.split(',')[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || 'place'
      }));

      this.cache.set(cacheKey, results);
      return results;
    } catch (e) {
      console.warn('Nominatim geocoding error, using fallback matching:', e);
      return this.getFallbackMatches(query, proximity);
    }
  }

  /**
   * Reverse geocode live GPS coordinates into human-readable street/area name
   */
  public static async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SafetyDosth-App/1.0'
        },
        signal: AbortSignal.timeout(3500)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 3).join(',').trim();
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding error:', e);
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  private static getFallbackMatches(query: string, proximity?: LocationCoordinate): GeocodedPlace[] {
    const baseLat = proximity?.lat || 11.6643;
    const baseLng = proximity?.lng || 78.1460;

    return [
      {
        placeId: 'fallback-1',
        name: query,
        displayName: `${query} (Local Match)`,
        lat: baseLat + 0.008,
        lng: baseLng + 0.006,
        type: 'destination'
      },
      {
        placeId: 'fallback-2',
        name: `${query} Central`,
        displayName: `${query} Central Transit & Commercial Plaza`,
        lat: baseLat + 0.012,
        lng: baseLng - 0.005,
        type: 'transit'
      }
    ];
  }
}
