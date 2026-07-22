import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker PNGs don't resolve correctly through Vite's
// bundler, so use inline SVG pins instead - also lets the colors match the
// app's palette (blue pickup, green drop) rather than Leaflet's stock blue.
const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<svg width="30" height="40" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });

const pickupIcon = pinIcon("#2563EB");
const dropIcon = pinIcon("#059669");

export default function TripMap({
  pickup,
  drop,
  routePath,
  height = 260,
}: {
  pickup?: [number, number] | null;
  drop?: [number, number] | null;
  routePath?: [number, number][] | null;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const bounds: L.LatLngExpression[] = [];

    if (pickup) {
      L.marker(pickup, { icon: pickupIcon }).addTo(layerGroup);
      bounds.push(pickup);
    }
    if (drop) {
      L.marker(drop, { icon: dropIcon }).addTo(layerGroup);
      bounds.push(drop);
    }
    if (routePath && routePath.length > 1) {
      L.polyline(routePath, { color: "#2563EB", weight: 4, opacity: 0.8 }).addTo(layerGroup);
      bounds.push(...routePath);
    }

    if (bounds.length > 0) {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30], maxZoom: 15 });
    }
  }, [pickup, drop, routePath]);

  return (
    <div
      ref={containerRef}
      style={{ height, borderRadius: 16, overflow: "hidden", background: "#e2e8f0" }}
    />
  );
}
