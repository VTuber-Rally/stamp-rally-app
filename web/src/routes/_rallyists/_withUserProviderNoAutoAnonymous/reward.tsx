import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Award, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward",
)({
  component: RewardPage,
});

function RewardPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">{t("reward.title")}</h1>

      {/* Bloc Récompenses */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center">
          <Gift className="mr-2 text-xl text-primary" />
          <h2 className="text-xl font-semibold">{t("reward.rewards")}</h2>
        </div>
        <p className="mb-4 text-gray-700">{t("reward.rewardsDescription")}</p>

        {/* À remplacer par la liste des soumissions */}
        <div className="text-sm text-gray-500">
          {t("reward.noSubmissionsYet")}
        </div>
      </div>

      {/* Bloc Concours */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center">
          <Award className="mr-2 text-xl text-primary" />
          <h2 className="text-xl font-semibold">{t("reward.contest")}</h2>
        </div>
        <p className="mb-4 text-gray-700">{t("reward.contestDescription")}</p>
        <Link
          to="/reward/contest"
          className="hover:bg-primary-dark inline-block rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors"
        >
          {t("reward.seeMore")}
        </Link>
      </div>
    </div>
  );
}
