import { captureException } from "@sentry/react";
import { useSearch } from "@tanstack/react-router";
import {
  GeoJSONSource,
  GeolocateControl,
  MapGeoJSONFeature,
  Map as MapLibre,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

import { MapContextProvider } from "@/contexts/MapContextProvider";
import { mapCenter } from "@/lib/consts.ts";
import {
  generateStyleSpec,
  getStandistsFeatureCollection,
} from "@/lib/mapStyleSpec.ts";

export const MapLibreMap: FC<{
  onStandClick: (standId: string) => void;
  children?: ReactNode;
}> = ({ onStandClick, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const searchParams = useSearch({ strict: false }) as {
    center?: [number, number];
  };

  const container = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<MapLibre | null>(null);

  useEffect(() => {
    if (container.current) {
      const map = new MapLibre({
        container: container.current,
        canvasContextAttributes: {
          antialias: true,
        },
        maxBounds: [
          [2.5, 48.95],
          [2.54, 48.98],
        ],
        style: generateStyleSpec(),
        bearing: 69,
        center: searchParams?.center ? searchParams.center : mapCenter,
        maxPitch: 0,
        minZoom: 15.5,
        zoom: searchParams?.center ? 19 : 16,
        maxZoom: 21,
      });

      map.addControl(
        new GeolocateControl({
          trackUserLocation: true,
          positionOptions: { enableHighAccuracy: true, timeout: 6000 },
        }),
      );

      map.addControl(new NavigationControl());

      getStandistsFeatureCollection().then(
        (featureCollection) => {
          const writeStandists = () =>
            (map.getSource("standists") as GeoJSONSource).setData(
              featureCollection,
            );
          if (!map.isStyleLoaded()) {
            void map.once("styledata", writeStandists);
            void map.once("load", writeStandists);
          } else writeStandists();
        },
        (error) => {
          captureException(error);
        },
      );
      const handleFeatureClick = ({
        features,
      }: {
        features?: MapGeoJSONFeature[];
      }) => {
        if (!features || !features[0]) return;
        const feature = features[0];
        onStandClick(feature.id as string);
      };

      map.on("click", "line", handleFeatureClick);
      map.on("click", "fill", handleFeatureClick);
      map.on("click", "symbol", handleFeatureClick);

      // I hate it but MapLibre does need to have the DOM element so we cannot use more "react-ey" techniques
      // I find it worse to create the div outside of React
      setMapInstance(map);

      return () => map.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStandClick]);

  return (
    <MapContextProvider mapInstance={mapInstance}>
      <div
        className="-m-4 h-[calc(100dvh-4rem-env(safe-area-inset-bottom,20px))]"
        ref={container}
      ></div>
      {children}
    </MapContextProvider>
  );
};
