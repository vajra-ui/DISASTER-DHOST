import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/maps-types";

export interface MapPath {
  id: string;
  points: LatLng[];
  tone: "primary" | "muted" | "alert";
  active?: boolean;
}

export interface MapMarker extends LatLng {
  id: string;
  label: string;
  kind: "user" | "origin" | "destination" | "place" | "report";
}

interface Props {
  center?: LatLng | null;
  markers?: MapMarker[];
  paths?: MapPath[];
  className?: string;
  fitKey?: string;
  onMapClick?: (p: LatLng) => void;
}

const COLORS: Record<MapPath["tone"], string> = {
  primary: "#0e8f8f",
  muted: "#9aa8ad",
  alert: "#d94a3d",
};

const PIN: Record<MapMarker["kind"], string> = {
  user: "#0e8f8f",
  origin: "#3b8f5a",
  destination: "#d97036",
  place: "#2f7fbf",
  report: "#d94a3d",
};

function icon(kind: MapMarker["kind"]) {
  const color = PIN[kind];
  const size = kind === "user" ? 16 : 22;
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Real OpenStreetMap tiles — no simulated map imagery. */
export default function MapView({
  center,
  markers = [],
  paths = [],
  className,
  fitKey,
  onMapClick,
}: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const clickRef = useRef(onMapClick);
  clickRef.current = onMapClick;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, attributionControl: true }).setView(
      [center?.lat ?? 20.5937, center?.lng ?? 78.9629],
      center ? 15 : 4,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(m);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    m.on("click", (e: L.LeafletMouseEvent) => clickRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng }));
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();

    const bounds: L.LatLngExpression[] = [];
    paths.forEach((p) => {
      if (p.points.length < 2) return;
      const latlngs = p.points.map((pt) => [pt.lat, pt.lng] as [number, number]);
      L.polyline(latlngs, {
        color: COLORS[p.tone],
        weight: p.active ? 6 : 4,
        opacity: p.active ? 0.95 : 0.5,
      }).addTo(g);
      if (p.active !== false) latlngs.forEach((c) => bounds.push(c));
    });
    markers.forEach((mk) => {
      L.marker([mk.lat, mk.lng], { icon: icon(mk.kind), title: mk.label })
        .bindPopup(mk.label)
        .addTo(g);
      bounds.push([mk.lat, mk.lng]);
    });

    if (bounds.length > 1) {
      m.fitBounds(L.latLngBounds(bounds), { padding: [48, 48], maxZoom: 17 });
    } else if (center) {
      m.setView([center.lat, center.lng], Math.max(m.getZoom(), 15));
    } else if (bounds.length === 1) {
      m.setView(bounds[0] as [number, number], 15);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, JSON.stringify(paths.map((p) => p.id + p.active)), JSON.stringify(markers), center?.lat, center?.lng]);

  return <div ref={el} className={className ?? "h-full w-full"} />;
}
