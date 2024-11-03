import { useTranslation } from "react-i18next";
import { stampsToCollect } from "@/lib/consts.ts";
import Logo from "@/assets/logo.png";
import Intro from "@/components/Intro.tsx";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import QRCodeLink from "@/components/QRCodeLink.tsx";
import { StampWithId } from "@/lib/models/Stamp.ts";
import { SubmissionWithId } from "@/lib/models/Submission.ts";

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
        <ButtonLink bg={"successOrange"} href="/submit">
          {t("requestYourReward")}
        </ButtonLink>
      )}
      <ButtonLink href="/artists">{t("artistList")}</ButtonLink>
      <ButtonLink href="/rules">{t("rules")}</ButtonLink>
      <ButtonLink href="/map">{t("map")}</ButtonLink>
      <QRCodeLink />
    </div>
  );
};

export default RallyistsHomepage;
