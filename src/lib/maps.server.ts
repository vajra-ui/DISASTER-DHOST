import { mapsFetch, MapsUnavailableError } from "./google-maps.server";
import { haversineMeters } from "./geo";
import type {
  LatLng,
  PlaceSuggestion,
  ResolvedPlace,
  RouteOption,
  RouteStep,
  SafePlace,
  TransitInfo,
  TravelMode,
  WeatherInfo,
} from "./maps-types";

const PLACE_FIELDS = "id,displayName,formattedAddress,location";

export async function autocompletePlaces(
  input: string,
  bias?: LatLng | null,
): Promise<PlaceSuggestion[]> {
  const body: Record<string, unknown> = { input };
  if (bias) {
    body["locationBias"] = {
      circle: { center: { latitude: bias.lat, longitude: bias.lng }, radius: 30000 },
    };
  }
  const data = await mapsFetch<{
    suggestions?: Array<{
      placePrediction?: {
        placeId: string;
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
        text?: { text?: string };
      };
    }>;
  }>("/places/v1/places:autocomplete", { method: "POST", body });

  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => ({
      placeId: p.placeId,
      primary: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
      secondary: p.structuredFormat?.secondaryText?.text ?? "",
    }))
    .filter((p) => p.primary.length > 0);
}

export async function placeDetails(placeId: string): Promise<ResolvedPlace> {
  const data = await mapsFetch<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude: number; longitude: number };
  }>(`/places/v1/places/${encodeURIComponent(placeId)}`, {
    headers: { "X-Goog-FieldMask": PLACE_FIELDS },
  });
  if (!data.location) throw new MapsUnavailableError("We couldn't locate that place.");
  return {
    placeId: data.id ?? placeId,
    name: data.displayName?.text ?? data.formattedAddress ?? "Selected place",
    address: data.formattedAddress ?? "",
    lat: data.location.latitude,
    lng: data.location.longitude,
  };
}

export async function geocodeAddress(address: string): Promise<ResolvedPlace> {
  const data = await mapsFetch<{
    status: string;
    results: Array<{
      formatted_address: string;
      place_id: string;
      geometry: { location: { lat: number; lng: number } };
    }>;
  }>(`/maps/api/geocode/json?address=${encodeURIComponent(address)}`);
  const first = data.results?.[0];
  if (!first) throw new MapsUnavailableError("We couldn't find that address. Try being more specific.");
  return {
    placeId: first.place_id,
    name: first.formatted_address,
    address: first.formatted_address,
    lat: first.geometry.location.lat,
    lng: first.geometry.location.lng,
  };
}

export async function reverseGeocode(point: LatLng): Promise<string> {
  const data = await mapsFetch<{
    results: Array<{ formatted_address: string }>;
  }>(`/maps/api/geocode/json?latlng=${point.lat},${point.lng}`);
  return data.results?.[0]?.formatted_address ?? "Data unavailable";
}

interface RoutesApiResponse {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
    description?: string;
    polyline?: { encodedPolyline?: string };
    legs?: Array<{
      steps?: Array<{
        distanceMeters?: number;
        navigationInstruction?: { instructions?: string; maneuver?: string };
        transitDetails?: { transitLine?: { nameShort?: string; name?: string } };
      }>;
    }>;
  }>;
}

function parseSeconds(duration?: string): number {
  if (!duration) return Number.NaN;
  return Number.parseFloat(duration.replace("s", ""));
}

export async function computeRoutes(
  origin: LatLng,
  destination: LatLng,
  travelMode: TravelMode,
): Promise<RouteOption[]> {
  const body: Record<string, unknown> = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
    travelMode,
    computeAlternativeRoutes: true,
    polylineQuality: "HIGH_QUALITY",
  };
  if (travelMode === "DRIVE") body["routingPreference"] = "TRAFFIC_AWARE";

  const data = await mapsFetch<RoutesApiResponse>("/routes/directions/v2:computeRoutes", {
    method: "POST",
    body,
    headers: {
      "X-Goog-FieldMask":
        "routes.distanceMeters,routes.duration,routes.description,routes.polyline.encodedPolyline,routes.legs.steps.distanceMeters,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails.transitLine",
    },
  });

  const routes = data.routes ?? [];
  if (routes.length === 0) {
    throw new MapsUnavailableError("No route available between those points.");
  }

  return routes.map((r, i) => {
    const steps: RouteStep[] = (r.legs ?? []).flatMap((leg) =>
      (leg.steps ?? [])
        .filter((s) => s.navigationInstruction?.instructions)
        .map((s) => ({
          instruction: s.navigationInstruction!.instructions!,
          distanceMeters: s.distanceMeters ?? 0,
          maneuver: s.navigationInstruction?.maneuver ?? null,
        })),
    );
    return {
      id: `route-${i}`,
      distanceMeters: r.distanceMeters ?? Number.NaN,
      durationSeconds: parseSeconds(r.duration),
      polyline: r.polyline?.encodedPolyline ?? "",
      steps,
      summary: r.description ?? "",
    };
  });
}

const PLACE_TYPE_MAP: Record<SafePlace["category"], string[]> = {
  hospital: ["hospital"],
  police: ["police"],
  pharmacy: ["pharmacy"],
  transit: ["transit_station", "bus_station", "train_station", "subway_station"],
  open_public: ["convenience_store", "gas_station", "cafe", "supermarket"],
};

export async function nearbySafePlaces(
  center: LatLng,
  categories: SafePlace["category"][],
  radius = 2000,
): Promise<SafePlace[]> {
  const results: SafePlace[] = [];
  for (const category of categories) {
    const data = await mapsFetch<{
      places?: Array<{
        id: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude: number; longitude: number };
        currentOpeningHours?: { openNow?: boolean };
      }>;
    }>("/places/v1/places:searchNearby", {
      method: "POST",
      body: {
        includedTypes: PLACE_TYPE_MAP[category],
        maxResultCount: 10,
        locationRestriction: {
          circle: { center: { latitude: center.lat, longitude: center.lng }, radius },
        },
      },
      headers: {
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.currentOpeningHours.openNow",
      },
    });
    for (const p of data.places ?? []) {
      if (!p.location) continue;
      const point = { lat: p.location.latitude, lng: p.location.longitude };
      results.push({
        placeId: p.id,
        name: p.displayName?.text ?? "Unnamed place",
        address: p.formattedAddress ?? "Data unavailable",
        category,
        openNow: p.currentOpeningHours?.openNow ?? null,
        distanceMeters: Math.round(haversineMeters(center, point)),
        ...point,
      });
    }
  }
  return results.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export async function currentWeather(point: LatLng): Promise<WeatherInfo> {
  const data = await mapsFetch<{
    weatherCondition?: { description?: { text?: string }; type?: string };
    temperature?: { degrees?: number };
    precipitation?: { probability?: { percent?: number } };
  }>(`/weather/v1/currentConditions:lookup?location.latitude=${point.lat}&location.longitude=${point.lng}`);

  const type = data.weatherCondition?.type ?? "";
  const adverseTypes = ["RAIN", "SNOW", "THUNDERSTORM", "HAIL", "FOG", "WIND", "SLEET"];
  return {
    description: data.weatherCondition?.description?.text ?? "Data unavailable",
    temperatureC: data.temperature?.degrees ?? null,
    precipitationProbability: data.precipitation?.probability?.percent ?? null,
    isAdverse: adverseTypes.some((t) => type.includes(t)),
  };
}

export async function transitAvailability(
  origin: LatLng,
  destination: LatLng,
): Promise<TransitInfo> {
  try {
    const routes = await computeRoutes(origin, destination, "TRANSIT");
    const first = routes[0];
    if (!first) return { available: false };
    return {
      available: true,
      durationSeconds: first.durationSeconds,
      distanceMeters: first.distanceMeters,
      lines: first.steps
        .map((s) => s.instruction)
        .filter((s) => /bus|metro|train|tram|subway/i.test(s))
        .slice(0, 4),
    };
  } catch {
    return { available: false };
  }
}
