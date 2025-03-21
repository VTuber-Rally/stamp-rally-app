import { useConfetti } from "@stevent-team/react-party";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Gift } from "lucide-react";
import { LegacyRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useContestWinner } from "@/lib/hooks/useContest";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest/success",
)({
  component: SuccessPage,
});

function SuccessPage() {
  const { t } = useTranslation();
  const { isWinner, isLoading } = useContestWinner();
  const [confettiLaunched, setConfettiLaunched] = useState(false);

  const { createConfetti, canvasProps } = useConfetti({
    count: 700,
    duration: 3000,
  });

  // Lancer des confettis si l'utilisateur est un gagnant
  useEffect(() => {
    if (isWinner && !confettiLaunched) {
      setConfettiLaunched(true);
      createConfetti();
    }
  }, [isWinner, confettiLaunched, createConfetti]);

  return (
    <div className="container mx-auto p-4">
      <canvas
        ref={canvasProps.ref as LegacyRef<HTMLCanvasElement> | null}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />

      <div className="mb-6 flex items-center justify-center rounded-lg bg-green-50 p-4 text-green-600">
        <Check className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">{t("contest.success.title")}</h1>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-md">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="ml-2">{t("contest.success.checking")}</p>
          </div>
        ) : isWinner ? (
          <div className="flex flex-col items-center py-6">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-green-600">
              {t("contest.success.winner.title")}
            </h2>
            <p className="mb-6 text-center text-gray-700">
              {t("contest.success.winner.description")}
            </p>
            <div className="rounded-lg bg-green-50 p-4 text-center text-green-700">
              <p>Bravo !</p>
              <p className="mt-2 text-sm">
                {t("contest.success.winner.instructions")}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-700">
              {t("contest.success.registered")}
            </p>
            <p className="mb-6 text-gray-700">
              {t("contest.success.notWinner.description")}
            </p>
            <div className="rounded-lg bg-blue-50 p-4 text-blue-700">
              <h3 className="mb-2 font-medium">
                {t("contest.success.notWinner.nextSteps")}
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t("contest.success.notWinner.step1")}</li>
                <li>{t("contest.success.notWinner.step2")}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/reward"
            className="block w-full rounded-md bg-gray-200 py-3 text-center font-medium text-gray-800 transition-colors hover:bg-gray-300"
          >
            {t("contest.success.backToRewards")}
          </Link>
        </div>
      </div>
    </div>
  );
}
