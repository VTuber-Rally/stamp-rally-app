import { createFileRoute } from "@tanstack/react-router";
import i18n from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import enFlag from "@/assets/languages/en.svg";
import frFlag from "@/assets/languages/fr.svg";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { Checkbox } from "@/components/Checkbox.tsx";
import { Header } from "@/components/Header.tsx";
import { CreateAccountForm } from "@/components/createAccountForm.tsx";
import { getPrefs, setPref } from "@/lib/appwrite.ts";
import { useLogout } from "@/lib/hooks/useLogout.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

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

  const { consent } = Route.useLoaderData();

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
    <div className={"flex grow flex-col items-center"}>
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
          <hr className={"my-2 w-full"} />

          <p>{t("alreadyHaveAccount")}</p>
          <ButtonLink size={"small"} href="/login">
            {t("loginThere")}
          </ButtonLink>
        </>
      )}
      <hr className={"my-2 w-full"} />

      <div className={"flex flex-col items-center"}>
        <h1 className={"text-2xl"}>{t("language.title")}</h1>
        <h1 className={"text-xl"}>{t("language.description")}</h1>
        <div className={"flex flex-row gap-2 pt-2"}>
          <button onClick={() => changeLanguage("en")}>
            <img
              src={enFlag}
              alt={"english flag"}
              className={"h-10 w-16 rounded-sm"}
            />
          </button>
          <button onClick={() => changeLanguage("fr")}>
            <img
              src={frFlag}
              alt={"french flag"}
              className={"h-10 w-16 rounded-sm"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
