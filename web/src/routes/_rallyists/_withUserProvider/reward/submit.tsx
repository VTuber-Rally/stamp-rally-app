import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TicketX, TriangleAlert, Vote } from "lucide-react";
import { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { CreateAccountForm } from "@/components/forms/CreateAccountForm.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { EnableNotificationNudge } from "@/components/reward/EnableNotificationNudge.tsx";
import { RallyProgressBar } from "@/components/reward/RallyProgressBar.tsx";
import { SubmissionsList } from "@/components/reward/SubmissionsList.tsx";
import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useRallySubmit } from "@/lib/hooks/useRallySubmit.ts";
import { useUser } from "@/lib/hooks/useUser.ts";
import {
  orangeTriangleEmphasis,
  pinkSquareEmphasis,
} from "@/lib/transComponentSets.tsx";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/submit",
)({
  component: Submit,
});

function Submit() {
  const { user } = useUser();
  const { isPending, isSuccess, isError, error, mutate } = useRallySubmit();
  const { data: stamps } = useCollectedStamps();
  const { data: submissions } = useRallySubmissions();
  const { t } = useTranslation();

  const stampCount = stamps?.length ?? 0;
  const isStandardRewardObtainable =
    stampCount >= standardRewardMinStampsRequirement;
  const isPremiumRewardObtainable =
    stampCount >= premiumRewardMinStampsRequirement;

  const canSubmit =
    isStandardRewardObtainable && !isPending && !isSuccess && !isError;

  const handleSubmit = () => {
    mutate();
  };

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
    <div className={"flex grow flex-col items-center"}>
      <Header>{t("submit")}</Header>

      <div className="flex flex-col gap-3">
        {(stampCount > 0 || !submissions?.length) && (
          <ShadowBox>
            <h2 className="mb-4 text-xl font-semibold">
              {t("currentRallyBlock.title")}
            </h2>

            <RallyProgressBar />

            {!!obtainableRewards.length && (
              <p className="mb-2">
                {t("currentRallyBlock.availableRewardPresentation", {
                  count: obtainableRewards.length,
                })}
                <ul className="ml-4 list-disc">{obtainableRewards}</ul>
              </p>
            )}

            {!isStandardRewardObtainable && (
              <p className="mb-2">
                <Trans
                  t={t}
                  i18nKey={"currentRallyBlock.standardCardRewardPresentation"}
                  components={orangeTriangleEmphasis}
                  values={{ stamps: standardRewardMinStampsRequirement }}
                />
                <ul className="ml-4 list-disc">{standardRewards}</ul>
              </p>
            )}

            {!isPremiumRewardObtainable && (
              <p className="mb-2">
                <Trans
                  t={t}
                  i18nKey={"currentRallyBlock.premiumCardRewardPresentation"}
                  components={pinkSquareEmphasis}
                  values={{ stamps: premiumRewardMinStampsRequirement }}
                />
                <ul className="ml-4 list-disc">{premiumRewards}</ul>
              </p>
            )}

            {!isPremiumRewardObtainable && (
              <p className="text-sm text-gray-700">
                <TriangleAlert className="inline-block" />{" "}
                {t("currentRallyBlock.resetDisclaimer")}
              </p>
            )}

            <div className={"flex flex-col justify-center gap-4 pt-2"}>
              {isPending && <p>{t("submitting")}</p>}
              {isError && error && <p>{error.message}</p>}
              {canSubmit && (
                <ButtonLink type="button" onClick={handleSubmit} size="medium">
                  {t("currentRallyBlock.submitAction")}
                </ButtonLink>
              )}
              {!isStandardRewardObtainable && (
                <p>
                  <TicketX className="inline-block" />{" "}
                  {t("submitNotAllowed", {
                    stamps: standardRewardMinStampsRequirement,
                  })}
                </p>
              )}
            </div>
          </ShadowBox>
        )}

        {!!submissions?.length && <EnableNotificationNudge />}
        <SubmissionsList />
        {!user?.email && (
          <ShadowBox>
            <CreateAccountForm />
          </ShadowBox>
        )}
      </div>
    </div>
  );
}
