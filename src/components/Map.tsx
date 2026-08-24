import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { LatLng } from "@/lib/maps-types";
import type { MapMarker, MapPath } from "./MapView";

const MapView = lazy(() => import("./MapView"));

interface Props {
  center?: LatLng | null;
  markers?: MapMarker[];
  paths?: MapPath[];
  className?: string;
  fitKey?: string;
  onMapClick?: (p: LatLng) => void;
}

function Fallback({ className }: { className?: string }) {
  return (
    <div className={`${className ?? "h-full w-full"} animate-pulse bg-muted`} aria-hidden="true" />
  );
}

/** SSR-safe wrapper: Leaflet only ever loads in the browser. */
export function Map(props: Props) {
  return (
    <ClientOnly fallback={<Fallback className={props.className} />}>
      <Suspense fallback={<Fallback className={props.className} />}>
        <MapView {...props} />
      </Suspense>
    </ClientOnly>
  );
}

export type { MapMarker, MapPath };
