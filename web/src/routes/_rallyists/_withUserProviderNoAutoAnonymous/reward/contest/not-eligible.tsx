import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest/not-eligible",
)({
  component: NotEligiblePage,
});

function NotEligiblePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-center rounded-lg bg-red-50 p-4 text-red-600">
        <AlertTriangle className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">{t("contest.notEligible.title")}</h1>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-md">
        <p className="mb-4 text-gray-700">
          {t("contest.notEligible.description")}
        </p>

        <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-yellow-700">
          <h2 className="mb-2 text-lg font-medium">
            {t("contest.notEligible.requirements.title")}
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>{t("contest.notEligible.requirements.submissions")}</li>
            <li>{t("contest.notEligible.requirements.profile")}</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-lg font-medium">
            {t("contest.notEligible.whatToDo.title")}
          </h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>{t("contest.notEligible.whatToDo.step1")}</li>
            <li>{t("contest.notEligible.whatToDo.step2")}</li>
            <li>{t("contest.notEligible.whatToDo.step3")}</li>
          </ol>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            to="/map"
            className="hover:bg-primary-dark w-full rounded-md bg-primary py-3 text-center font-medium text-white transition-colors"
          >
            {t("contest.notEligible.viewMap")}
          </Link>
          <Link
            to="/reward/contest"
            className="w-full rounded-md bg-gray-200 py-3 text-center font-medium text-gray-800 transition-colors hover:bg-gray-300"
          >
            {t("contest.notEligible.backToContest")}
          </Link>
        </div>
      </div>
    </div>
  );
}
