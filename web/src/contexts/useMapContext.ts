import { useContext } from "react";

import { MapContext } from "@/contexts/MapContext";

export const useMapContext = () => {
  const context = useContext(MapContext);

  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }

  return context.mapInstance;
};
