import { useQuery } from "convex/react";

import { ConvexId, convexPublicApi } from "@/lib/convex.ts";

export const useBoothWithPrivateKey = (boothId?: ConvexId<"booths">) =>
  useQuery(
    convexPublicApi.booths.getBoothWithPrivateKey,
    boothId ? { boothId } : "skip",
  );
