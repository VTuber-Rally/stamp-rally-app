import { useContext } from "react";

import { InventoryDrawerContext } from "@/contexts/InventoryDrawerContext";

export const useInventoryDrawerContext = () => {
  const ctx = useContext(InventoryDrawerContext);
  if (!ctx) {
    throw new Error(
      "useInventoryDrawerContext must be used within an InventoryDrawerContextProvider",
    );
  }
  return ctx;
};
