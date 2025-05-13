import { useConfetti } from "@stevent-team/react-party";
import { Check, Gift } from "lucide-react";
import { LegacyRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ContestParticipant } from "@vtube-stamp-rally/shared-lib/models/ContestParticipant.ts";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Header } from "@/components/layout/Header";
import { useFollowParticipation } from "@/lib/hooks/contest/useFollowParticipation";

export function SuccessPage() {
  const { t } = useTranslation();
  const [confettiLaunched, setConfettiLaunched] = useState(false);

  const {
    currentParticipation,
    isCurrentParticipationPending,
    participationError,
  } = useFollowParticipation();

  const { createConfetti, canvasProps } = useConfetti({
    count: 700,
    duration: 3000,
  });

  useEffect(() => {
    if (currentParticipation?.drawnDate && currentParticipation.isWinner) {
      if (!confettiLaunched) {
        setConfettiLaunched(true);
        void createConfetti();
      }
    }
  }, [confettiLaunched, createConfetti, currentParticipation]);

  return (
    <>
      <canvas
        ref={canvasProps.ref as LegacyRef<HTMLCanvasElement> | null}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />

      <Header className="rounded-xl bg-green-100 text-green-800">
        <Check className="mr-2 h-6 w-6" />
        {t("contest.success.title")}
      </Header>

      {isCurrentParticipationPending && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-2">{t("contest.success.checking")}</p>
        </div>
      )}

      {participationError && (
        <div className="flex flex-col items-center justify-center py-8">
          <h1 className="text-2xl font-bold text-red-500">{t("error")}</h1>
          <p className="text-red-500">{participationError.message}</p>
        </div>
      )}

      {currentParticipation && (
        <StatusBlock participation={currentParticipation} />
      )}
    </>
  );
}

const StatusBlock = ({
  participation,
}: {
  participation: ContestParticipant;
}) => {
  const { t } = useTranslation();

  const WonBlock = (
    <div className="flex flex-col items-center py-6">
      <div className="mb-4 rounded-full bg-green-100 p-4 shadow-md">
        <Gift className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-green-600">
        {t("contest.success.winner.title")}
      </h2>
      <p className="mb-6 text-center text-gray-700">
        {t("contest.success.winner.description")}
      </p>
      <p className="mt-2 text-sm">{t("contest.success.winner.instructions")}</p>

      <details className="mt-4">
        <summary className="text-sm text-gray-500">
          {t("contest.success.winner.technicalInstructions")}
        </summary>
        <p>
          {t("contest.success.winner.additionalInformation", {
            registeredAt: new Date(
              participation.registeredAt,
            ).toLocaleDateString(),
            drawnAt: participation.drawnDate
              ? new Date(participation.drawnDate).toLocaleDateString()
              : "euh..",
            isWinner: participation.isWinner ? t("yes") : t("no"),
            name: participation.name,
          })}
        </p>
      </details>
    </div>
  );

  const LostBlock = (
    <div>
      <p className="my-12 text-center text-xl text-gray-700">
        {t("contest.success.notWinner.description")}
      </p>
      <p>
        <ButtonLink href={"/artists"}>{t("artistList")}</ButtonLink>
      </p>
    </div>
  );

  // if drawnDate is defined, it means the draw has happened
  if (participation.drawnDate) {
    return participation.isWinner ? WonBlock : LostBlock;
  }

  return (
    <div className="py-6">
      <p className="mb-4 text-lg font-medium text-gray-700">
        {t("contest.success.registered")}
      </p>
      <div className="rounded-lg bg-blue-50 p-4 text-blue-700 shadow-md">
        <h3 className="mb-2 font-medium">
          {t("contest.success.pending.title")}
        </h3>
        <p className="text-sm">{t("contest.success.pending.description")}</p>
      </div>
    </div>
  );
};
