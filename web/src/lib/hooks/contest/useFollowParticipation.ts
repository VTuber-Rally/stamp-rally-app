import { useConvexAuth, useQuery } from "convex/react";

import { convexPublicApi } from "@/lib/convex";

export const useFollowParticipation = () => {
  const { isAuthenticated } = useConvexAuth();
  const currentParticipation = useQuery(
    convexPublicApi.contest.getMyParticipation,
    isAuthenticated ? {} : "skip",
  );

  const isPending = currentParticipation === undefined;

  return {
    currentParticipation: currentParticipation ?? null,
    isPending,
  };
};
