import { useMemo } from "react";

import {
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
    const minorHallBooths = booths.filter((standist) => {
      return standist.hall === "5A";
    });
    return new Set(minorHallBooths.map((booth) => booth._id));
  }, [booths]);

  const stampCount = stamps?.length ?? 0;
  const isAnyStampFromMinorHall =
    stamps?.some((stamp) => minorHallBoothsIds.has(stamp.boothId)) ?? false;
  const isStandardRewardObtainable =
    isAnyStampFromMinorHall && stampCount >= standardRewardMinStampsRequirement;
  const isPremiumRewardObtainable =
    isAnyStampFromMinorHall && stampCount >= premiumRewardMinStampsRequirement;

  return {
    stampCount,
    isAnyStampFromMinorHall,
    isStandardRewardObtainable,
    isPremiumRewardObtainable,
  } as const;
};
