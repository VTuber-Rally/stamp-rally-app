import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { useDatabase } from "@/lib/hooks/useDatabase.ts";
import { RewardDrawType } from "@/lib/rewards.ts";

export const useDrawReward = () => {
  const { getPrizes } = useDatabase();

  const { data: prizes = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRIZES],
    queryFn: () => getPrizes(),
  });

  const standardPrizes = useMemo(
    () => prizes.filter((prize) => prize.draw == "standard"),
    [prizes],
  );
  const standardPrizesProbabilitySum = useMemo(
    () => standardPrizes.reduce((acc, prize) => acc + prize.probability, 0),
    [standardPrizes],
  );

  const premiumPrizes = useMemo(
    () => prizes.filter((prize) => prize.draw == "premium"),
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
