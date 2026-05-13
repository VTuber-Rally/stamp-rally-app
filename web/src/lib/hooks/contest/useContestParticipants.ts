import { useQuery } from "convex/react";

import { convexPublicApi } from "@/lib/convex";

export function useContestParticipants() {
  const data = useQuery(convexPublicApi.contest.getParticipants);
  return {
    data,
    isLoading: data === undefined,
  };
}
