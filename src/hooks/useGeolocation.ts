import { useCallback, useEffect, useRef, useState } from "react";
import type { LatLng } from "@/lib/maps-types";

export type GeoStatus = "idle" | "prompting" | "watching" | "denied" | "unavailable" | "timeout";

export interface GeoState {
  position: (LatLng & { accuracy: number; heading: number | null; timestamp: number }) | null;
  status: GeoStatus;
  error: string | null;
}

const MESSAGES: Record<number, { status: GeoStatus; message: string }> = {
  1: { status: "denied", message: "Location permission denied. You can still search a start point manually." },
  2: { status: "unavailable", message: "GPS is unavailable right now. Move to an open area and try again." },
  3: { status: "timeout", message: "Getting your location took too long. Try again." },
};

/** Real browser geolocation — never simulated. */
export function useGeolocation(autoStart = false) {
  const [state, setState] = useState<GeoState>({ position: null, status: "idle", error: null });
  const watchId = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchId.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) {
      setState({ position: null, status: "unavailable", error: "This device doesn't support location." });
      return;
    }
    setState((s) => ({ ...s, status: s.position ? s.status : "prompting", error: null }));
    stop();
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            heading: pos.coords.heading,
            timestamp: pos.timestamp,
          },
          status: "watching",
          error: null,
        });
      },
      (err) => {
        const mapped = MESSAGES[err.code] ?? {
          status: "unavailable" as GeoStatus,
          message: "We couldn't get your location.",
        };
        setState((s) => ({ position: s.position, status: mapped.status, error: mapped.message }));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 },
    );
  }, [stop]);

  useEffect(() => {
    if (autoStart) start();
    return stop;
  }, [autoStart, start, stop]);

  return { ...state, start, stop };
}
