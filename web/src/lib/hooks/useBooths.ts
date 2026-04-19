import { useQuery } from "convex/react";

import { convexPublicApi } from "@/lib/convex.ts";
import { convex } from "@/lib/convexClient.ts";

/**
 * Get the list of booths. This should not be used in React components.
 *
 * @deprecated Prefer passing booth list from calling component
 * @return The list of booths
 */
export const getBooths = () => {
  return convex.query(convexPublicApi.booths.listBooths);
};

export const useBooths = () => {
  const booths = useQuery(convexPublicApi.booths.listBooths);

  return { isLoading: typeof booths === "undefined", data: booths };
};
