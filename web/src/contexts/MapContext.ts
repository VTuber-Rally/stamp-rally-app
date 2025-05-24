import type { Map as MapLibre } from "maplibre-gl";
import { createContext } from "react";

interface IMapContext {
  mapInstance: MapLibre | null;
}

export const MapContext = createContext<IMapContext>({ mapInstance: null });
