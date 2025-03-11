import { useTranslation } from "react-i18next";

import QRCodeLink from "@/components/controls/QRCodeLink";
import { Header } from "@/components/layout/Header";

export function ContestPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header>{t("contest.title")}</Header>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          {t("contest.description")}
        </h2>
        <p className="mb-4 text-gray-700">{t("contest.howToRegister")}</p>
      </div>
      <QRCodeLink />
    </>
  );
}
