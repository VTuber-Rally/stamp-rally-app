import { Link } from "@tanstack/react-router";
import { ExternalLink, Gift } from "lucide-react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Accordion, AccordionItem } from "@/components/layout/Accordion.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { RallyProgressBar } from "@/components/reward/RallyProgressBar.tsx";
import { RewardsAvailabilityList } from "@/components/reward/RewardsAvailabilityList.tsx";
import { SubmitDrawer } from "@/components/reward/SubmitDrawer.tsx";

export const RallyBlock = () => {
  const { t } = useTranslation();

  const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState(false);
  const openSubmitDrawer = () => {
    setIsSubmitDrawerOpen(true);
  };

  return (
    <>
      <SubmitDrawer open={isSubmitDrawerOpen} setOpen={setIsSubmitDrawerOpen} />
      <ShadowBox>
        <div className="mb-4 flex items-center">
          <Gift className="mr-2 h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">{t("reward.rally.title")}</h2>
        </div>
        <p className="mb-4 text-gray-700">{t("reward.rally.description")}</p>

        <RallyProgressBar />

        <Accordion>
          <AccordionItem
            value="rewards"
            title={t("reward.rally.faq.rewards.title")}
          >
            <div className="px-1 py-2">
              <RewardsAvailabilityList />
            </div>
          </AccordionItem>
          <AccordionItem
            value="submissions"
            title={t("reward.rally.faq.submissions.title")}
          >
            <p className="px-1 py-2">
              {t("reward.rally.faq.submissions.description.1")}
              <br />
              {t("reward.rally.faq.submissions.description.2")}
            </p>
          </AccordionItem>
          <AccordionItem
            value="help"
            title={t("reward.rally.faq.stamps.title")}
          >
            <p className="px-1 py-2">
              <Trans
                t={t}
                i18nKey="reward.rally.faq.stamps.description"
                components={{
                  em: <em />,
                }}
              />
              <ButtonLink size="small" href="/artists">
                {t("artistList")}
              </ButtonLink>
            </p>
          </AccordionItem>
          <AccordionItem
            value="replay"
            title={t("reward.rally.faq.replay.title")}
          >
            <p className="px-1 py-2">
              {t("reward.rally.faq.replay.description")}
            </p>
          </AccordionItem>
        </Accordion>
        <ButtonLink type="button" onClick={openSubmitDrawer} size="medium">
          {t("currentRallyBlock.submitAction")}
        </ButtonLink>
        <div className="mt-2 text-center">
          <Link to={"/reward/submissions"}>
            {t("reward.rally.button")}{" "}
            <ExternalLink className="inline-block align-middle" />
          </Link>
        </div>
      </ShadowBox>
    </>
  );
};
