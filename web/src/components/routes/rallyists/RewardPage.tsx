import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/Header";
import { ContestBlock } from "@/components/reward/ContestBlock.tsx";
import { RallyBlock } from "@/components/reward/RallyBlock.tsx";

export function RewardPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header>{t("reward.title")}</Header>

      <RallyBlock />

      <ContestBlock />

      <div className="mt-4 text-center text-sm text-gray-500">
        {t("reward.disclaimer")}
      </div>
    </>
  );
}
