import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header.tsx";
import { useTranslation } from "react-i18next";
import { useUser } from "@/lib/hooks/useUser.ts";
import { CreateAccountForm } from "@/components/createAccountForm.tsx";
import i18n from "i18next";

import frFlag from "@/assets/languages/fr.svg";
import enFlag from "@/assets/languages/en.svg";

export const Route = createFileRoute("/_rallyists/_withUserProvider/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useUser();
  const { t } = useTranslation();

  const hasUserAlreadyRegistered = user?.name || user?.email;

  return (
    <div className={"flex flex-col flex-grow items-center"}>
      <Header>{t("settings.title")}</Header>
      {hasUserAlreadyRegistered ? (
        <h3>
          {user?.name && t("hi_username", { name: user.name })}{" "}
          {user.email && `(${user?.email})`}
        </h3>
      ) : (
        <>
          <CreateAccountForm />
        </>
      )}
      <hr className={"w-full my-2"} />

      <div className={"flex flex-col items-center"}>
        <h1 className={"text-2xl"}>{t("language.title")}</h1>
        <h1 className={"text-xl"}>{t("language.description")}</h1>
        <div className={"pt-2 flex flex-row gap-2"}>
          <button onClick={() => i18n.changeLanguage("en")}>
            <img src={enFlag} alt={"en"} className={"w-16 h-10 rounded"} />
          </button>
          <button onClick={() => i18n.changeLanguage("fr")}>
            <img src={frFlag} alt={"fr"} className={"w-16 h-10 rounded"} />
          </button>
        </div>
      </div>
    </div>
  );
}
