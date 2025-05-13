import type { StampWithId } from "@vtuber-stamp-rally/shared-lib/models/Stamp.ts";
import type { SubmissionWithId } from "@vtuber-stamp-rally/shared-lib/models/Submission.ts";
import { useTranslation } from "react-i18next";

import Logo from "@/assets/logo.png";
import Intro from "@/components/Intro.tsx";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import QRCodeLink from "@/components/controls/QRCodeLink.tsx";
import { stampsToCollect } from "@/lib/consts.ts";

type RallyistsHomepageProps = {
  stamps?: StampWithId[];
  submissions?: SubmissionWithId[];
};

const RallyistsHomepage = ({
  stamps = [],
  submissions = [],
}: RallyistsHomepageProps) => {
  const { t } = useTranslation();

  const showSubmitButton =
    stamps.length >= stampsToCollect ||
    (submissions && submissions.length >= 1);

  const showIntro =
    stamps.length === 0 && (!submissions || submissions.length === 0);

  return (
    <div className={"flex flex-col items-center"}>
      <img src={Logo} alt="logo" className={"w-96"} />

      {showIntro && <Intro />}

      {showSubmitButton && (
        <ButtonLink bg={"success-orange"} href="/reward/submit">
          {t("requestYourReward")}
        </ButtonLink>
      )}
      <ButtonLink href="/artists">{t("artistList")}</ButtonLink>
      <ButtonLink href="/rules">{t("rules")}</ButtonLink>
      <ButtonLink href="/map">{t("map")}</ButtonLink>
      <ButtonLink href="/settings">{t("settings.title")}</ButtonLink>
      <QRCodeLink />
    </div>
  );
};

export default RallyistsHomepage;
