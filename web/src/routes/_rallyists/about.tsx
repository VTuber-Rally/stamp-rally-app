import { createFileRoute, Link } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";
import { Header } from "@/components/Header.tsx";
import Intro from "@/components/Intro.tsx";

export const Route = createFileRoute("/_rallyists/about")({
  component: About,
});

function About() {
  const { t } = useTranslation();

  return (
    <div className="p-2 pb-4">
      <Header>{t("rules")}</Header>

      <Intro />

      <Header>{t("rules")}</Header>

      <ol className={"list-decimal px-4 space-y-2"}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
          <li key={i}>{t(`rules.${i}`)}</li>
        ))}
      </ol>

      <hr className={"my-4"} />

      <Trans
        t={t}
        i18nKey="aboutText"
        components={{
          1: <a target={"_blank"} href="https://twitter.com/leonekmi" />,
          2: <a target={"_blank"} href={"https://twitter.com/luclu7_"} />,
        }}
      />

      <div>
        Commit {import.meta.env.VITE_COMMIT_REF} – build{" "}
        {import.meta.env.VITE_BUILD_ID} – {BUILD_TIMESTAMP}
      </div>

      <hr className={"my-4"} />

      <div className={"flex w-full justify-center"}>
        <Link to={"/standists"}>Standists</Link>
        <span className={"mx-2"}>|</span>
        <Link to={"/staff"}>Staff</Link>
      </div>
    </div>
  );
}
