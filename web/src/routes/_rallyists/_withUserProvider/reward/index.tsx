import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Award, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader";
import { ButtonLink } from "@/components/controls/ButtonLink";
import QRCodeLink from "@/components/controls/QRCodeLink";
import { Header } from "@/components/layout/Header";
import { QUERY_KEYS } from "@/lib/QueryKeys";
import { stampsToCollect } from "@/lib/consts";
import { db } from "@/lib/db";
import { useFollowParticipation } from "@/lib/hooks/contest/useFollowParticipation";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions";

export const Route = createFileRoute("/_rallyists/_withUserProvider/reward/")({
  component: RewardPage,
});

function RewardPage() {
  const { t } = useTranslation();
  const { data: stamps } = useCollectedStamps();
  const { data: submissions, isPending: areSubmissionsPending } =
    useRallySubmissions();
  const hasSubmitted = !!submissions && submissions.length > 0;

  const { currentParticipation, isCurrentParticipationPending } =
    useFollowParticipation();

  return (
    <div className="container mx-auto p-4">
      <Header>{t("reward.title")}</Header>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <Gift className="mr-2 h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">{t("reward.rally.title")}</h2>
        </div>
        <p className="mb-4 text-gray-700">
          {t("reward.rally.description", {
            minimumStampsCount: stampsToCollect,
          })}
        </p>

        {/* Statut actuel: à compléter avec les données réelles */}
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">
              {stamps
                ? t("reward.rally.inProgress", {
                    count: stamps.length,
                    total: stampsToCollect,
                  })
                : t("loading")}
            </span>
            <Link
              to="/artists"
              className="hover:text-primary-dark text-sm font-medium text-primary"
            >
              {t("reward.rally.button")}
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <QRCodeLink size="medium" />

          {(stamps && stamps.length >= stampsToCollect) || hasSubmitted ? (
            <ButtonLink
              type="link"
              href="/reward/submit"
              size="medium"
              bg="success-orange"
            >
              {t("requestYourReward")}
            </ButtonLink>
          ) : null}
        </div>
      </div>

      {/* Bloc Concours */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <Award className="mr-2 h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">{t("reward.contest.title")}</h2>
        </div>
        <p className="mb-4 text-gray-700">{t("reward.contest.description")}</p>

        {currentParticipation && (
          <div className="flex flex-col items-center justify-center gap-2">
            <p>
              Vous vous êtes inscrit le{" "}
              {new Date(currentParticipation.registeredAt).toLocaleDateString(
                "fr-FR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                },
              )}
            </p>
          </div>
        )}

        {areSubmissionsPending ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader />
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        ) : currentParticipation ? (
          <>
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                {t("reward.contest.success")}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p
                className={clsx(
                  "text-sm text-gray-600",
                  !hasSubmitted && "font-bold text-primary",
                )}
              >
                {t("reward.contest.requirements")}
              </p>
            </div>

            <ButtonLink
              type="link"
              href="/reward/contest"
              size="medium"
              disabled={!hasSubmitted}
            >
              {t("reward.contest.button")}
            </ButtonLink>
          </>
        )}
      </div>

      {/* (olivier) faure légal purposes (non en vrai sait-on jamais) */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {t("reward.disclaimer")}
      </div>
    </div>
  );
}
