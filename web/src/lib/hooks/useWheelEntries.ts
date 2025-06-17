import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { useDatabase } from "@/lib/hooks/useDatabase.ts";
import { RewardDrawType } from "@/lib/rewards.ts";

export const useWheelEntries = (type: RewardDrawType = "standard") => {
  const { getWheelEntries } = useDatabase();

  return useQuery({
    queryKey: [QUERY_KEYS.WHEEL_ENTRIES],
    queryFn: () => getWheelEntries(type),
  });
};
