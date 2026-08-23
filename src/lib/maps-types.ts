export type TravelMode = "WALK" | "DRIVE" | "BICYCLE" | "TRANSIT";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlaceSuggestion {
  placeId: string;
  primary: string;
  secondary: string;
}

export interface ResolvedPlace extends LatLng {
  name: string;
  address: string;
  placeId?: string;
}

export interface SafePlace extends LatLng {
  placeId: string;
  name: string;
  address: string;
  category: "hospital" | "police" | "pharmacy" | "transit" | "open_public";
  openNow: boolean | null;
  distanceMeters: number;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  maneuver: string | null;
}

export interface RouteOption {
  id: string;
  distanceMeters: number;
  durationSeconds: number;
  polyline: string;
  steps: RouteStep[];
  summary: string;
}

export interface WeatherInfo {
  description: string;
  temperatureC: number | null;
  precipitationProbability: number | null;
  isAdverse: boolean;
}

export interface TransitInfo {
  available: boolean;
  durationSeconds?: number;
  distanceMeters?: number;
  lines?: string[];
}
