import { useTranslation } from "react-i18next";

import type { StampWithId } from "@vtube-stamp-rally/shared-lib/models/Stamp.ts";
import type { SubmissionWithId } from "@vtube-stamp-rally/shared-lib/models/Submission.ts";

import Logo from "@/assets/logo.png";
import Intro from "@/components/Intro.tsx";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import QRCodeLink from "@/components/controls/QRCodeLink.tsx";

type RallyistsHomepageProps = {
  stamps?: StampWithId[];
  submissions?: SubmissionWithId[];
};

const RallyistsHomepage = ({
  stamps = [],
  submissions = [],
}: RallyistsHomepageProps) => {
  const { t } = useTranslation();

  const showIntro =
    stamps.length === 0 && (!submissions || submissions.length === 0);

  return (
    <div className={"flex flex-col items-center"}>
      <img src={Logo} alt="logo" className={"w-80"} />

      {showIntro && <Intro />}

      <ButtonLink href="/artists">{t("artistList")}</ButtonLink>
      <ButtonLink href="/reward">{t("reward.pageTitle")}</ButtonLink>
      <ButtonLink href="/map">{t("map")}</ButtonLink>
      <ButtonLink href="/rules" size="medium">
        {t("rules")}
      </ButtonLink>
      <ButtonLink href="/settings" size="medium">
        {t("settings.title")}
      </ButtonLink>
      <QRCodeLink size="medium" />
    </div>
  );
};

export default RallyistsHomepage;
