import React from "react";

/** Map embed: Google when VITE_APP_MAP_KEY is set, otherwise OpenStreetMap. */
export default function PropertyMap({
  lat,
  lng,
  height = 400,
  className = "",
}) {
  const safeLat = Number(lat);
  const safeLng = Number(lng);
  const hasCoords =
    Number.isFinite(safeLat) &&
    Number.isFinite(safeLng) &&
    !(safeLat === 0 && safeLng === 0);

  const mapLat = hasCoords ? safeLat : 38.7223;
  const mapLng = hasCoords ? safeLng : -9.1393;
  const googleKey = (import.meta.env.VITE_APP_MAP_KEY || "").trim();

  const src = googleKey
    ? `https://www.google.com/maps/embed/v1/place?q=${mapLat},${mapLng}&key=${googleKey}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${
        mapLng - 0.02
      }%2C${mapLat - 0.015}%2C${mapLng + 0.02}%2C${mapLat + 0.015}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <div className={className} style={{ width: "100%" }}>
      <iframe
        title="Property location"
        name="gMap"
        width="100%"
        height={height}
        style={{ marginTop: 20, border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      />
    </div>
  );
}
