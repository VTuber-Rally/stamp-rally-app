import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { InventoryDrawer } from "@/components/inventory/InventoryDrawer.tsx";
import { InventoryPage } from "@/components/routes/staff/inventory/InventoryPage.tsx";
import { InventoryDrawerContextProvider } from "@/contexts/InventoryDrawerContextProvider.tsx";

// normalement ça devrait être 3 max mais bon, sait-on jamais pas de max
const inventorySearchSchema = z.object({
  maxClassicCards: z.coerce.number().default(3).catch(3),
  maxHoloCards: z.coerce.number().default(3).catch(3),
});

export const Route = createFileRoute("/staff/inventory")({
  validateSearch: zodValidator(inventorySearchSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const { maxClassicCards, maxHoloCards } = Route.useSearch();

  return (
    <InventoryDrawerContextProvider>
      <InventoryPage
        maxClassicCards={maxClassicCards}
        maxHoloCards={maxHoloCards}
      />
      <InventoryDrawer />
    </InventoryDrawerContextProvider>
  );
}
