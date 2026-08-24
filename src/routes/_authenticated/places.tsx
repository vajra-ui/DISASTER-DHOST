import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Navigation } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Map } from "@/components/Map";
import { useGeolocation } from "@/hooks/useGeolocation";
import { nearbyPlacesFn } from "@/lib/maps.functions";
import { formatDistance } from "@/lib/geo";
import type { SafePlace } from "@/lib/maps-types";

export const Route = createFileRoute("/_authenticated/places")({
  head: () => ({
    meta: [
      { title: "Safe places nearby — Safety Dosth" },
      {
        name: "description",
        content: "Find verified hospitals, police stations, pharmacies and transit points close to you right now.",
      },
      { property: "og:title", content: "Safe places nearby — Safety Dosth" },
      { property: "og:description", content: "Verified hospitals, police and open public places around you." },
    ],
  }),
  component: PlacesPage,
});

const CATEGORIES = [
  { value: "hospital", label: "Hospitals" },
  { value: "police", label: "Police" },
  { value: "pharmacy", label: "Pharmacies" },
  { value: "transit", label: "Transit" },
  { value: "open_public", label: "Open now" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

function PlacesPage() {
  const geo = useGeolocation(true);
  const nearby = useServerFn(nearbyPlacesFn);
  const [active, setActive] = useState<Category[]>(["hospital", "police"]);
  const [places, setPlaces] = useState<SafePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lat = geo.position?.lat;
  const lng = geo.position?.lng;

  const load = useCallback(async () => {
    if (lat === undefined || lng === undefined || active.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await nearby({
        data: { center: { lat, lng }, categories: active, radius: 3000 },
      });
      setPlaces(res);
    } catch (err) {
      setPlaces([]);
      setError(err instanceof Error ? err.message : "Place data unavailable right now.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, active.join(",")]);

  useEffect(() => {
    void load();
  }, [load]);

  function toggle(c: Category) {
    setActive((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  return (
    <AppShell title="Safe places" subtitle="Verified locations from Google Places, live open status">
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => toggle(c.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
              active.includes(c.value)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="surface-card mb-4 h-56 overflow-hidden">
        <Map
          center={lat !== undefined && lng !== undefined ? { lat, lng } : null}
          markers={[
            ...(lat !== undefined && lng !== undefined
              ? [{ id: "me", lat, lng, label: "You", kind: "user" as const }]
              : []),
            ...places.map((p) => ({
              id: p.placeId,
              lat: p.lat,
              lng: p.lng,
              label: p.name,
              kind: "place" as const,
            })),
          ]}
        />
      </div>

      {geo.error ? <p className="mb-3 text-sm text-alert">{geo.error}</p> : null}
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Finding places near you…
        </p>
      ) : null}
      {error ? <p className="text-sm text-alert">{error}</p> : null}
      {!loading && !error && places.length === 0 ? (
        <p className="text-sm text-muted-foreground">Data unavailable for the selected categories.</p>
      ) : null}

      <ul className="space-y-2">
        {places.map((p) => (
          <li key={p.placeId} className="surface-card flex items-start justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.address || "Address unavailable"}</p>
              <p className="mt-1 text-xs">
                <span className="text-muted-foreground">{formatDistance(p.distanceMeters)}</span>
                {" · "}
                <span
                  className={
                    p.openNow === true ? "text-safe" : p.openNow === false ? "text-alert" : "text-unknown-foreground"
                  }
                >
                  {p.openNow === true ? "Open now" : p.openNow === false ? "Closed" : "Hours unavailable"}
                </span>
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              aria-label={`Directions to ${p.name}`}
            >
              <Navigation className="size-4" />
            </a>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
