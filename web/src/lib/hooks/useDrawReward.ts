import { useQuery } from "convex/react";
import { useMemo } from "react";

import { convexPublicApi } from "@/lib/convex.ts";
import { RewardDrawType } from "@/lib/rewards.ts";

export const useDrawReward = () => {
  const prizes = useQuery(convexPublicApi.prizes.getPrizes);

  const isLoading = prizes === undefined;

  const standardPrizes = useMemo(
    () => prizes?.filter((prize) => prize.draw == "standard") ?? [],
    [prizes],
  );
  const standardPrizesProbabilitySum = useMemo(
    () => standardPrizes.reduce((acc, prize) => acc + prize.probability, 0),
    [standardPrizes],
  );

  const premiumPrizes = useMemo(
    () => prizes?.filter((prize) => prize.draw == "premium") ?? [],
    [prizes],
  );
  const premiumPrizesProbabilitySum = useMemo(
    () => premiumPrizes.reduce((acc, prize) => acc + prize.probability, 0),
    [premiumPrizes],
  );

  const drawReward = (type: RewardDrawType) => {
    const probabilitySum =
      type === "standard"
        ? standardPrizesProbabilitySum
        : premiumPrizesProbabilitySum;
    const prizesArray = type === "standard" ? standardPrizes : premiumPrizes;

    const randomNumber = Math.random() * probabilitySum;

    let accumulator = 0;
    let i = -1;
    while (accumulator < randomNumber) {
      i++;
      const prize = prizesArray[i];
      if (!prize) {
        throw new Error("Random number is out of range, huh?");
      }
      accumulator += prize.probability;
    }
    return prizesArray[i];
  };

  return { isLoading, drawReward };
};
