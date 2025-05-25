import { Gift } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { RallyProgressBar } from "@/components/reward/RallyProgressBar.tsx";
import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts";
import {
  orangeTriangleEmphasis,
  pinkSquareEmphasis,
} from "@/lib/transComponentSets.tsx";

export const RallyBlock = () => {
  const { t } = useTranslation();

  return (
    <ShadowBox>
      <div className="mb-4 flex items-center">
        <Gift className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">{t("reward.rally.title")}</h2>
      </div>
      <p className="mb-4 text-gray-700">
        {t("reward.rally.description", {
          minimumStampsCount: standardRewardMinStampsRequirement,
        })}
      </p>

      <RallyProgressBar />

      <p className="text-gray-700">
        <Trans
          t={t}
          i18nKey="reward.rally.standardCardReward"
          components={orangeTriangleEmphasis}
          values={{
            stampsCount: standardRewardMinStampsRequirement,
          }}
        />
        <br />
        <Trans
          t={t}
          i18nKey="reward.rally.premiumCardReward"
          components={pinkSquareEmphasis}
          values={{
            stampsCount: premiumRewardMinStampsRequirement,
          }}
        />
      </p>

      <div className="flex flex-col items-center justify-center gap-2">
        <ButtonLink
          type="link"
          href="/reward/submit"
          size="medium"
          bg="success-orange"
        >
          {t("requestYourReward")}
        </ButtonLink>
      </div>
    </ShadowBox>
  );
};
