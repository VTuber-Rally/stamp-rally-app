import { useQuery } from "convex/react";

import { convexPublicApi } from "@/lib/convex";

export function useContestWinners() {
  const data = useQuery(convexPublicApi.contest.getLastWinners);
  return {
    data,
    isLoading: data === undefined,
  };
}
