import { ContestParticipant } from "@vtuber-stamp-rally/shared-lib/models/ContestParticipant.ts";
import clsx from "clsx";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader";
import { ButtonLink } from "@/components/controls/ButtonLink";
import { useFollowParticipation } from "@/lib/hooks/contest/useFollowParticipation";
import { useIsEligibleForContest } from "@/lib/hooks/contest/useIsEligibleForContest";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions";

export const ContestBlock = () => {
  const { t } = useTranslation();
  const { data: submissions, isPending: areSubmissionsPending } =
    useRallySubmissions();
  const { eligibilityData, isPending: isEligibilityPending } =
    useIsEligibleForContest();
  const { currentParticipation, isCurrentParticipationPending } =
    useFollowParticipation();

  const isEligibleForContest = eligibilityData?.eligible ?? false;

  const isContestBlockLoading =
    isCurrentParticipationPending ||
    areSubmissionsPending ||
    isEligibilityPending;

  const getParticipationStatus = (participation: ContestParticipant) => {
    if (participation.drawnDate) {
      return participation.isWinner
        ? t("contest.status.win")
        : t("contest.status.lost");
    }
    return t("contest.status.waiting");
  };

  const getContestRequirementTranslationKey = (
    numberOfSubmissions: number,
    isEligible: boolean,
  ) => {
    if (numberOfSubmissions === 0) {
      return "reward.contest.requirements.noRally";
    }

    if (isEligible) {
      return "reward.contest.requirements.OK";
    }

    return "reward.contest.requirements.oneMore";
  };

  const ContestButton = () => {
    const isWaitingForDraw = Boolean(
      currentParticipation && !currentParticipation.drawnDate,
    );
    const isDisabled = !isEligibleForContest || isWaitingForDraw;
    const buttonSize = isWaitingForDraw ? "small" : "medium";

    return (
      <ButtonLink
        type="link"
        href="/reward/contest"
        size={buttonSize}
        disabled={isDisabled}
      >
        {t("reward.contest.button")}
      </ButtonLink>
    );
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <Award className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">{t("reward.contest.title")}</h2>
      </div>
      <p className="mb-4 text-gray-700">{t("reward.contest.description")}</p>

      {currentParticipation && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            {t("contest.status.registeredThe", {
              date: new Date(
                currentParticipation.registeredAt,
              ).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
            })}
            <br />
            {getParticipationStatus(currentParticipation)}
          </p>

          {!currentParticipation.drawnDate && (
            <ButtonLink
              type="link"
              href="/reward/contest/success"
              size="medium"
            >
              {t("contest.status.followParticipation")}
            </ButtonLink>
          )}
        </div>
      )}

      {isContestBlockLoading && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader />
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      )}

      {submissions && eligibilityData !== undefined && (
        <>
          <div
            className={clsx(
              "mb-4 rounded-lg p-3 shadow-md",
              isEligibleForContest ? "bg-green-200/30" : "bg-red-200/15",
            )}
          >
            <p
              className={clsx(
                "text-sm text-gray-600",
                !isEligibleForContest && "font-bold text-primary",
              )}
            >
              {t(
                getContestRequirementTranslationKey(
                  submissions.length,
                  isEligibleForContest,
                ),
              )}
            </p>
          </div>

          <ContestButton />
        </>
      )}
    </div>
  );
};
