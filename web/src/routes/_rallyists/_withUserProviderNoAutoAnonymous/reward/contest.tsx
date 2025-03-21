import { createFileRoute } from "@tanstack/react-router";
import { Award, Camera } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { QRDrawerContext } from "@/contexts/QRDrawerContext";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest",
)({
  component: ContestPage,
});

function ContestPage() {
  const { t } = useTranslation();
  const [_, setIsOpen] = useContext(QRDrawerContext);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 flex items-center text-2xl font-bold">
        <Award className="mr-2" />
        {t("contest.title")}
      </h1>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          {t("contest.description")}
        </h2>
        <p className="mb-4 text-gray-700">{t("contest.longDescription")}</p>

        <div className="mb-4">
          <h3 className="mb-2 font-medium">{t("contest.rules")}</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>{t("contest.rule1")}</li>
            <li>{t("contest.rule2")}</li>
            <li>{t("contest.rule3")}</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 font-medium">{t("contest.prizes")}</h3>
          <p className="text-gray-700">{t("contest.prizesDescription")}</p>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-primary-dark flex w-full items-center justify-center rounded-md bg-primary py-4 font-medium text-white transition-colors"
      >
        <Camera className="mr-2" />
        {t("contest.scanQRCode")}
      </button>
    </div>
  );
}
