import type { Map as MapLibre } from "maplibre-gl";
import { FC, ReactNode, useMemo } from "react";

import { MapContext } from "@/contexts/MapContext";

interface MapContextProviderProps {
  mapInstance: MapLibre | null;
  children?: ReactNode;
}

export const MapContextProvider: FC<MapContextProviderProps> = ({
  mapInstance,
  children,
}) => {
  const contextValue = useMemo(() => ({ mapInstance }), [mapInstance]);

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};
