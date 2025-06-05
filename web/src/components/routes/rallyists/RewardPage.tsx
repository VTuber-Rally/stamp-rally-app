import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/Header";
import { ContestBlock } from "@/components/reward/ContestBlock.tsx";
import { RallyBlock } from "@/components/reward/RallyBlock.tsx";

/**
 * Displays the reward page with a header, rally and contest sections, and a disclaimer.
 *
 * Renders translated content for the page title and disclaimer.
 */
export function RewardPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header>{t("reward.pageTitle")}</Header>

      <div className="flex flex-col gap-2">
        <RallyBlock />
        <ContestBlock />
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {t("reward.disclaimer")}
      </div>
    </>
  );
}
