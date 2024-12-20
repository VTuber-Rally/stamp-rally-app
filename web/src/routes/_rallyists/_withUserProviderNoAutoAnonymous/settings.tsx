import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Header } from "@/components/Header.tsx";
import { useTranslation } from "react-i18next";
import { useUser } from "@/lib/hooks/useUser.ts";
import { CreateAccountForm } from "@/components/createAccountForm.tsx";
import i18n from "i18next";

import frFlag from "@/assets/languages/fr.svg";
import enFlag from "@/assets/languages/en.svg";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { useLogout } from "@/lib/hooks/useLogout.ts";
import { getPrefs, setPref } from "@/lib/appwrite.ts";
import { Checkbox } from "@/components/Checkbox.tsx";
import { useState } from "react";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/settings",
)({
  component: SettingsPage,
  loader: async () => {
    try {
      const prefs = await getPrefs();
      return { consent: prefs["consent"] === true };
    } catch {
      return { consent: false };
    }
  },
});

function SettingsPage() {
  const { user } = useUser();
  const { mutate } = useLogout();
  const { t } = useTranslation();

  const { consent } = useLoaderData({
    from: "/_rallyists/_withUserProviderNoAutoAnonymous/settings",
  });

  const [consentChecked, setConsentChecked] = useState(consent);

  const isUserLoggedIn =
    user !== null && user?.email !== undefined && user?.email !== "";

  function changeLanguage(language: string) {
    if (language === i18n.language) return;
    if (user) setPref("language", language); // purely analytical
    i18n.changeLanguage(language);
  }

  const i18nKeyButton = isUserLoggedIn
    ? "loggedLogoutButton"
    : "anonymousLogoutButton";
  const isStaff = user?.labels.includes("staff");
  const isStandist = user?.labels.includes("standist");

  return (
    <div className={"flex flex-col flex-grow items-center"}>
      <Header>{t("settings.title")}</Header>
      {isUserLoggedIn ? (
        <div>
          <p className={"text-lg"}>
            {user?.name && t("hi_username", { name: user.name })}{" "}
            {user?.email && `(${user?.email})`}
          </p>
          <div className={"flex items-center"}>
            <Checkbox
              id={"consent"}
              checked={consentChecked}
              onCheckedChange={() => {
                setPref("consent", !consentChecked);
                setConsentChecked(!consentChecked);
              }}
            />
            <label className={"ml-2"} htmlFor={"consent"}>
              {t("consentToSaveEmail")}
            </label>
          </div>

          {isStaff && (
            <ButtonLink size={"small"} href="/staff">
              {t("staffSpace")}
            </ButtonLink>
          )}

          {isStandist && (
            <ButtonLink size={"small"} href="/standists">
              {t("standistSpace")}
            </ButtonLink>
          )}

          <ButtonLink
            type={"button"}
            size={"medium"}
            bg={"dangerous"}
            onClick={() => mutate()}
            className={"text-lg"}
          >
            {t(i18nKeyButton)}
          </ButtonLink>
        </div>
      ) : (
        <>
          <CreateAccountForm />
          <hr className={"w-full my-2"} />

          <p>{t("alreadyHaveAccount")}</p>
          <ButtonLink size={"small"} href="/login">
            {t("loginThere")}
          </ButtonLink>
        </>
      )}
      <hr className={"w-full my-2"} />

      <div className={"flex flex-col items-center"}>
        <h1 className={"text-2xl"}>{t("language.title")}</h1>
        <h1 className={"text-xl"}>{t("language.description")}</h1>
        <div className={"pt-2 flex flex-row gap-2"}>
          <button onClick={() => changeLanguage("en")}>
            <img
              src={enFlag}
              alt={"english flag"}
              className={"w-16 h-10 rounded"}
            />
          </button>
          <button onClick={() => changeLanguage("fr")}>
            <img
              src={frFlag}
              alt={"french flag"}
              className={"w-16 h-10 rounded"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
