import { createFileRoute } from "@tanstack/react-router";
import Logo from "@/assets/logo.png";
import QRCodeLink from "@/components/QRCodeLink.tsx";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { useTranslation } from "react-i18next";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { STAMPS_TO_COLLECT } from "@/assets/stampRequirements.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import Intro from "@/components/Intro.tsx";

export const Route = createFileRoute("/_rallyists/")({
  component: () => Home(),
});

const Home = () => {
  const { t } = useTranslation();
  const { data = [] } = useCollectedStamps();
  const { data: submissions } = useRallySubmissions();

  const showSubmitButton =
    data.length >= STAMPS_TO_COLLECT ||
    (submissions && submissions.length >= 1);

  const showIntro =
    data.length === 0 && (!submissions || submissions.length === 0);

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
      <ButtonLink href="/about">{t("rules")}</ButtonLink>
      <ButtonLink href="/map">{t("map")}</ButtonLink>
      <QRCodeLink />
    </div>
  );
};
