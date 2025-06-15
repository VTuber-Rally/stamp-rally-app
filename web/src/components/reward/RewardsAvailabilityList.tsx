import { Sparkles, Vote } from "lucide-react";
import { FC, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";

import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { useRewardAvailability } from "@/lib/hooks/useRewardAvailability.ts";
import {
  orangeTriangleEmphasis,
  pinkSquareEmphasis,
} from "@/lib/transComponentSets.tsx";

export const RewardsAvailabilityList: FC = () => {
  const { t } = useTranslation();

  const { isStandardRewardObtainable, isPremiumRewardObtainable } =
    useRewardAvailability();

  const standardRewards = [
    <li key="standard-reward">
      <Vote className="inline-block" />{" "}
      {t("currentRallyBlock.oneOrMoreClassicCards")}
    </li>,
  ] as const;

  const premiumRewards = [
    <li key="premium-reward-more-cards">
      <Vote className="inline-block" />{" "}
      {t("currentRallyBlock.evenMoreClassicCards")}
    </li>,
    <li key="premium-reward-holographic">
      <Sparkles className="inline-block" />{" "}
      {t("currentRallyBlock.holographicCard")}
    </li>,
  ] as const;

  const obtainableRewards: ReactElement[] = [];
  if (isStandardRewardObtainable) obtainableRewards.push(...standardRewards);
  if (isPremiumRewardObtainable) obtainableRewards.push(...premiumRewards);

  return (
    <>
      {!!obtainableRewards.length && (
        <>
          <p>
            {t("currentRallyBlock.availableRewardPresentation", {
              count: obtainableRewards.length,
            })}
          </p>
          <ul className="mb-2 ml-4 list-disc">{obtainableRewards}</ul>
        </>
      )}

      {!isStandardRewardObtainable && (
        <>
          <p>
            <Trans
              t={t}
              i18nKey={"currentRallyBlock.standardCardRewardPresentation"}
              components={orangeTriangleEmphasis}
              values={{ stamps: standardRewardMinStampsRequirement }}
            />
          </p>
          <ul className="mb-2 ml-4 list-disc">{standardRewards}</ul>
        </>
      )}

      {!isPremiumRewardObtainable && (
        <p>
          <Trans
            t={t}
            i18nKey={"currentRallyBlock.premiumCardRewardPresentation"}
            components={pinkSquareEmphasis}
            values={{ stamps: premiumRewardMinStampsRequirement }}
          />
          <ul className="mb-2 ml-4 list-disc">{premiumRewards}</ul>
        </p>
      )}

      <p>{t("currentRallyBlock.minorHallInfo")}</p>
    </>
  );
};
