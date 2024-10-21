import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./MapComponent.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFoYWRtZWhtb29kOTUiLCJhIjoiY20yZW1xeHQ1MHY3eDJpczdrcmUyZjM1ZyJ9.dXVn9ytaVUyK2M7H8uhRIw";

const MapComponent = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-74.5, 40],
      zoom: 9,
      minZoom: 3, // Restrict zoom out beyond the pixel size limit
      maxZoom: 9, // Allow zooming in to a certain level
    });

    map.on("load", () => {
      map.addSource("sentinel-hub-source", {
        type: "raster",
        tiles: [
          `https://services.sentinel-hub.com/ogc/wms/1f6e33c9-c293-4d25-abb0-64ffea85bb41?SERVICE=WMS&REQUEST=GetMap&LAYERS=NDVI_TEST&FORMAT=image/png&TRANSPARENT=true&VERSION=1.3.0&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256`,
        ],
        tileSize: 256,
      });

      map.addLayer({
        id: "ndvi-layer",
        type: "raster",
        source: "sentinel-hub-source",
        paint: {
          "raster-opacity": 0.85,
        },
      });

      // Listen for zoom changes and enforce the maximum zoom-out level
      map.on("zoom", () => {
        const zoom = map.getZoom();
        const metersPerPixel = 40075016.686 / Math.pow(2, zoom + 8);

        console.log("zoom level:", metersPerPixel);

        // Sentinel Hub limit for resolution is 1500 meters per pixel
        if (metersPerPixel > 1500) {
          map.setZoom(map.getZoom() + 0.1); // Force map to stay within limit
        }
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="map-container" ref={mapContainerRef}></div>
    </div>
  );
};

export default MapComponent;
