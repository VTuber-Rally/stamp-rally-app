import { useMemo } from "react";

import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useStandists } from "@/lib/hooks/useStandists.ts";

export const useRewardAvailability = () => {
  const { data: stamps } = useCollectedStamps();
  const { data: standists } = useStandists();

  const minorHallStandistsIds = useMemo(() => {
    const minorHallStandists = standists.filter((standist) => {
      return standist.hall === "5A";
    });
    return new Set(minorHallStandists.map((standist) => standist.userId));
  }, [standists]);

  const stampCount = stamps?.length ?? 0;
  const isAnyStampFromMinorHall =
    stamps?.some((stamp) => minorHallStandistsIds.has(stamp.standistId)) ??
    false;
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
