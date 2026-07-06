import { useMemo } from "react";
import { useDebugValue } from "react";

import {
  isMinorHallRequired,
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { ConvexId } from "@/lib/convex.ts";
import { useBooths } from "@/lib/hooks/useBooths.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";

export const useRewardAvailability = () => {
  const stamps = useCollectedStamps();
  const { data: booths } = useBooths();

  const minorHallBoothsIds = useMemo<Set<ConvexId<"booths">>>(() => {
    if (!booths) return new Set();
    const minorHallBooths = booths.filter((booth) => {
      return booth.hall === "5A";
    });
    return new Set(minorHallBooths.map((booth) => booth._id));
  }, [booths]);

  const stampCount = stamps?.length ?? 0;
  const isAnyStampFromMinorHall =
    !isMinorHallRequired ||
    (stamps?.some((stamp) => minorHallBoothsIds.has(stamp.boothId)) ?? false);
  const isStandardRewardObtainable =
    (!isMinorHallRequired || isAnyStampFromMinorHall) &&
    stampCount >= standardRewardMinStampsRequirement;
  const isPremiumRewardObtainable =
    (!isMinorHallRequired || isAnyStampFromMinorHall) &&
    stampCount >= premiumRewardMinStampsRequirement;

  useDebugValue({
    stampCount,
    isAnyStampFromMinorHall,
    isStandardRewardObtainable,
    isPremiumRewardObtainable,
  });

  return {
    stampCount,
    isAnyStampFromMinorHall,
    isStandardRewardObtainable,
    isPremiumRewardObtainable,
  } as const;
};
