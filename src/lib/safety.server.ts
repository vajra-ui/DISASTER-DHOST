import { decodePolyline, distanceToPath, haversineMeters } from "./geo";
import { currentWeather, nearbySafePlaces } from "./maps.server";
import type { LatLng, RouteOption, SafePlace } from "./maps-types";
import type { RouteSafety, SafetyAnalysis, SafetyFactor } from "./safety-types";

export interface CommunityReportPoint {
  lat: number;
  lng: number;
  status: string;
  created_at: string;
  category: string;
}

const NEAR_ROUTE_METERS = 200;

function pathOf(route: RouteOption): LatLng[] {
  return route.polyline ? decodePolyline(route.polyline) : [];
}

function midpoint(path: LatLng[]): LatLng | null {
  if (path.length === 0) return null;
  return path[Math.floor(path.length / 2)]!;
}

function reportWeight(report: CommunityReportPoint): number {
  const ageDays = (Date.now() - new Date(report.created_at).getTime()) / 86_400_000;
  const recency = ageDays <= 7 ? 1 : ageDays <= 30 ? 0.6 : ageDays <= 90 ? 0.3 : 0.1;
  const trust = report.status === "verified" ? 1.6 : report.status === "multiple" ? 1.2 : 1;
  return recency * trust;
}

export async function analyseRoutes(
  routes: RouteOption[],
  origin: LatLng,
  reports: CommunityReportPoint[],
): Promise<SafetyAnalysis> {
  const paths = routes.map(pathOf);
  const hasGeometry = paths.some((p) => p.length > 1);

  // One places lookup shared by every route option keeps API usage bounded.
  let places: SafePlace[] = [];
  let placesAvailable = false;
  if (hasGeometry) {
    const center = midpoint(paths.find((p) => p.length > 1) ?? []) ?? origin;
    const longest = Math.max(
      ...routes.map((r) => (Number.isFinite(r.distanceMeters) ? r.distanceMeters : 0)),
      1000,
    );
    const radius = Math.min(5000, Math.max(1200, longest / 2 + 400));
    try {
      places = await nearbySafePlaces(center, ["hospital", "police", "pharmacy", "open_public"], radius);
      placesAvailable = true;
    } catch {
      placesAvailable = false;
    }
  }

  let weatherNote: string | null = null;
  let weatherAvailable = false;
  let weatherAdverse = false;
  try {
    const weather = await currentWeather(origin);
    if (weather.description !== "Data unavailable") {
      weatherAvailable = true;
      weatherAdverse = weather.isAdverse;
      const temp = weather.temperatureC !== null ? ` · ${Math.round(weather.temperatureC)}°C` : "";
      weatherNote = `${weather.description}${temp}`;
    }
  } catch {
    weatherAvailable = false;
  }

  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 6;

  const comparable = placesAvailable && hasGeometry;

  const analysed: RouteSafety[] = routes.map((route, index) => {
    const path = paths[index] ?? [];
    const factors: SafetyFactor[] = [];
    const unavailable: string[] = [];

    let placesNear = 0;
    let openNear = 0;
    if (placesAvailable && path.length > 1) {
      const near = places.filter((p) => distanceToPath(p, path) <= NEAR_ROUTE_METERS);
      placesNear = near.length;
      openNear = near.filter((p) => p.openNow === true).length;
      factors.push({
        label:
          placesNear > 0
            ? `${placesNear} verified public place${placesNear === 1 ? "" : "s"} along this route`
            : "No verified public places found along this route",
        detail: near
          .slice(0, 3)
          .map((p) => p.name)
          .join(" · ") || "Google Places found nothing within 200 m of the route.",
        source: "verified",
        tone: placesNear >= 3 ? "positive" : placesNear > 0 ? "caution" : "alert",
      });
      if (openNear > 0) {
        factors.push({
          label: `${openNear} of them are open right now`,
          detail: "Open businesses usually mean more people around.",
          source: "verified",
          tone: "positive",
        });
      }
    } else {
      unavailable.push("Nearby place data");
    }

    const nearReports = path.length > 1
      ? reports.filter((r) => distanceToPath({ lat: r.lat, lng: r.lng }, path) <= NEAR_ROUTE_METERS)
      : [];
    const reportLoad = nearReports.reduce((sum, r) => sum + reportWeight(r), 0);
    if (path.length > 1) {
      factors.push({
        label:
          nearReports.length === 0
            ? "No community warnings reported along this route"
            : `${nearReports.length} community report${nearReports.length === 1 ? "" : "s"} near this route`,
        detail:
          nearReports.length === 0
            ? "Nobody in the community has flagged this stretch."
            : Array.from(new Set(nearReports.map((r) => r.category))).join(" · "),
        source: "community",
        tone: nearReports.length === 0 ? "positive" : reportLoad >= 2 ? "alert" : "caution",
      });
    } else {
      unavailable.push("Route geometry");
    }

    if (weatherAvailable) {
      factors.push({
        label: weatherAdverse ? "Conditions may affect your journey" : "Current conditions look suitable",
        detail: weatherNote ?? "",
        source: "verified",
        tone: weatherAdverse ? "caution" : "positive",
      });
    } else {
      unavailable.push("Weather information");
    }

    factors.push({
      label: isNight ? "You're travelling at night" : "You're travelling in daylight hours",
      detail: `Local time ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`,
      source: "verified",
      tone: isNight ? "caution" : "positive",
    });

    unavailable.push("Street lighting and CCTV data");

    let score: number | null = null;
    if (comparable && path.length > 1) {
      const placeScore = Math.min(1, placesNear / 6);
      const reportPenalty = Math.min(1, reportLoad / 4);
      const openBonus = Math.min(1, openNear / 4);
      const nightPenalty = isNight ? 0.15 : 0;
      const weatherPenalty = weatherAdverse ? 0.08 : 0;
      const raw =
        0.45 * placeScore + 0.2 * openBonus + 0.35 * (1 - reportPenalty) - nightPenalty - weatherPenalty;
      score = Math.round(Math.max(0, Math.min(1, raw)) * 100);
    }

    return { routeId: route.id, score, classification: null, factors, unavailable };
  });

  if (comparable && analysed.length > 1) {
    const fastestIdx = routes.reduce(
      (best, r, i) => (r.durationSeconds < routes[best]!.durationSeconds ? i : best),
      0,
    );
    const saferIdx = analysed.reduce(
      (best, r, i) => ((r.score ?? -1) > (analysed[best]!.score ?? -1) ? i : best),
      0,
    );
    analysed.forEach((r, i) => {
      if (i === saferIdx && saferIdx !== fastestIdx) r.classification = "safer";
      else if (i === fastestIdx) r.classification = "fastest";
      else r.classification = "balanced";
    });
  } else if (analysed.length > 0) {
    const fastestIdx = routes.reduce(
      (best, r, i) => (r.durationSeconds < routes[best]!.durationSeconds ? i : best),
      0,
    );
    analysed.forEach((r, i) => {
      r.classification = i === fastestIdx ? "fastest" : null;
    });
  }

  return {
    routes: analysed,
    comparable,
    weatherAvailable,
    weatherNote,
    analysedAt: new Date().toISOString(),
  };
}

export function boundingBox(points: LatLng[], padMeters = 500) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const padLat = padMeters / 111_320;
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const padLng = padMeters / (111_320 * Math.max(0.2, Math.cos((midLat * Math.PI) / 180)));
  return {
    minLat: Math.min(...lats) - padLat,
    maxLat: Math.max(...lats) + padLat,
    minLng: Math.min(...lngs) - padLng,
    maxLng: Math.max(...lngs) + padLng,
  };
}

export { haversineMeters };
