import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { InventoryDrawer } from "@/components/inventory/InventoryDrawer.tsx";
import { InventoryPage } from "@/components/routes/staff/inventory/InventoryPage.tsx";
import { InventoryDrawerContextProvider } from "@/contexts/InventoryDrawerContextProvider.tsx";
import { ConvexId } from "@/lib/convex.ts";

// normalement ça devrait être 3 max mais bon, sait-on jamais pas de max
const inventorySearchSchema = z.object({
  maxClassicCards: z.coerce.number().default(3).catch(3),
  maxHoloCards: z.coerce.number().default(3).catch(3),
  maxRandomClassicCards: z.coerce.number().default(0).catch(0),
  submissionId: z.string().optional(),
});

export const Route = createFileRoute("/staff/inventory")({
  validateSearch: zodValidator(inventorySearchSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const { maxClassicCards, maxHoloCards, maxRandomClassicCards, submissionId } =
    Route.useSearch();

  return (
    <InventoryDrawerContextProvider>
      <InventoryPage
        maxClassicCards={maxClassicCards}
        maxHoloCards={maxHoloCards}
        maxRandomClassicCards={maxRandomClassicCards}
      />
      <InventoryDrawer submissionId={submissionId as ConvexId<"submissions">} />
    </InventoryDrawerContextProvider>
  );
}
