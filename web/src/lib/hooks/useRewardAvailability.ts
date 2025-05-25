import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";

export const useRewardAvailability = () => {
  const { data: stamps } = useCollectedStamps();

  const stampCount = stamps?.length ?? 0;
  const isStandardRewardObtainable =
    stampCount >= standardRewardMinStampsRequirement;
  const isPremiumRewardObtainable =
    stampCount >= premiumRewardMinStampsRequirement;

  return {
    stampCount,
    isStandardRewardObtainable,
    isPremiumRewardObtainable,
  } as const;
};
