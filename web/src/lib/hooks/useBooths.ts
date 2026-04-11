import { useQuery } from "convex/react";

import { convexPublicApi } from "@/lib/convex.ts";

export const useBooths = () => {
  const booths = useQuery(convexPublicApi.booths.listBooths);

  return { isLoading: typeof booths === "undefined", data: booths };
};
