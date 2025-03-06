import { useContext } from "react";

import { MapContext } from "@/contexts/MapContext.ts";

export const useMapContext = () => {
  const value = useContext(MapContext);
  return value.mapInstance;
};
