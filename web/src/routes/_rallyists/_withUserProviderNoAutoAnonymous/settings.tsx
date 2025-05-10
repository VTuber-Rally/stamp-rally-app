import { zodResolver } from "@hookform/resolvers/zod";
import { captureException } from "@sentry/react";
import { createFileRoute } from "@tanstack/react-router";
import i18n from "i18next";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import enFlag from "@/assets/languages/en.svg";
import frFlag from "@/assets/languages/fr.svg";
import Loader from "@/components/Loader";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { CreateAccountForm } from "@/components/forms/CreateAccountForm.tsx";
import { Checkbox } from "@/components/inputs/Checkbox.tsx";
import InputField from "@/components/inputs/InputField";
import { Header } from "@/components/layout/Header.tsx";
import { AnalyticsOptOut } from "@/components/routes/AnalyticsOptOut.tsx";
import { getPrefs, setPref } from "@/lib/appwrite.ts";
import { APPWRITE_PREFERENCES_KEYS } from "@/lib/appwritePreferencesKeys.ts";
import { useLogout } from "@/lib/hooks/useLogout.ts";
import { useUpdateUsername } from "@/lib/hooks/useUpdateUsername";
import { useUser } from "@/lib/hooks/useUser.ts";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";
import {
  disablePushNotifications,
  enablePushNotifications,
} from "@/lib/pushNotifications.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/settings",
)({
  component: SettingsPage,
  loader: async () => {
    let emailConsent: boolean;
    let pushNotificationsConsent: boolean;
    try {
      const prefs = await getPrefs();
      emailConsent = prefs[APPWRITE_PREFERENCES_KEYS.EMAIL_CONSENT] === true;
      pushNotificationsConsent =
        window.localStorage.getItem(
          LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
        ) === "true";
    } catch {
      emailConsent = false;
      pushNotificationsConsent = false;
    }
    return {
      emailConsent,
      pushNotificationsConsent,
    };
  },
});

function SettingsPage() {
  const { user } = useUser();
  const { mutate } = useLogout();
  const { t } = useTranslation();
  const { updateUsername, isPending } = useUpdateUsername();

  const { emailConsent, pushNotificationsConsent } = Route.useLoaderData();

  const [emailConsentChecked, setEmailConsentChecked] = useState(emailConsent);

  const toggleEmailConsent = useCallback(() => {
    setEmailConsentChecked(!emailConsentChecked);
    setPref(
      APPWRITE_PREFERENCES_KEYS.EMAIL_CONSENT,
      !emailConsentChecked,
    ).catch((error) => {
      captureException(error);
      setEmailConsentChecked(emailConsentChecked);
    });
  }, [emailConsentChecked]);

  // This setting is per-device
  const [pushNotificationsConsentChecked, setPushNotificationsConsentChecked] =
    useState(pushNotificationsConsent);
  const [isPushNotificationsLoading, setIsPushNotificationsLoading] =
    useState(false);

  const togglePushNotificationsConsent = useCallback(async () => {
    setIsPushNotificationsLoading(true);
    setPushNotificationsConsentChecked(!pushNotificationsConsentChecked);
    try {
      if (pushNotificationsConsentChecked) {
        const pushNotificationsDisabled = await disablePushNotifications();
        setPushNotificationsConsentChecked(!pushNotificationsDisabled);
      } else {
        const pushNotificationsEnabled = await enablePushNotifications();
        setPushNotificationsConsentChecked(pushNotificationsEnabled);
      }
    } catch (error) {
      captureException(error);
      setPushNotificationsConsentChecked(pushNotificationsConsentChecked);
    } finally {
      setIsPushNotificationsLoading(false);
    }
  }, [pushNotificationsConsentChecked]);

  const isUserLoggedIn =
    user !== null && user?.email !== undefined && user?.email !== "";

  function changeLanguage(language: string) {
    if (language === i18n.language) return;
    if (user) void setPref("language", language); // purely analytical
    void i18n.changeLanguage(language);
  }

  const i18nKeyButton = isUserLoggedIn
    ? "loggedLogoutButton"
    : "anonymousLogoutButton";
  const isStaff = user?.labels.includes("staff");
  const isStandist = user?.labels.includes("standist");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.name ?? "",
    },
    resolver: zodResolver(
      z.object({
        username: z
          .string()
          .trim()
          .min(1, t("settings.usernameEmpty"))
          .max(50, t("settings.usernameTooLong")),
      }),
    ),
  });

  function onSubmit({ username }: { username: string }) {
    if (!user) {
      throw new Error("Error is not logged in");
    }

    updateUsername(username);
  }

  return (
    <div className={"flex grow flex-col items-center gap-2"}>
      <Header>{t("settings.title")}</Header>
      {isUserLoggedIn ? (
        <>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
            <h1 className="mb-4 text-2xl">{t("account")}</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-2"
            >
              <div className="flex flex-col">
                <label htmlFor="username" className="text-lg">
                  {t("name")}
                </label>
                <InputField
                  name="username"
                  placeholder={t("name")}
                  errors={errors["username"]}
                  register={register}
                  required={true}
                  type="text"
                />
              </div>

              <div className="flex flex-col">
                <p className={"text-lg"}>Email:</p>
                <pre>{user?.email}</pre>
              </div>

              <div className={"flex items-center"}>
                <Checkbox
                  id={"email-consent"}
                  checked={emailConsentChecked}
                  onCheckedChange={toggleEmailConsent}
                />
                <label className={"ml-2"} htmlFor={"email-consent"}>
                  {t("consent.email")}
                </label>
              </div>

              <div className={"flex items-center"}>
                <Checkbox
                  id={"push-notifications-consent"}
                  checked={pushNotificationsConsentChecked}
                  disabled={isPushNotificationsLoading}
                  onCheckedChange={togglePushNotificationsConsent}
                />
                <label
                  className={"ml-2"}
                  htmlFor={"push-notifications-consent"}
                >
                  {t("consent.pushNotifications")}
                </label>
              </div>

              <ButtonLink
                type="submit"
                size={"medium"}
                bg={"secondary"}
                disabled={isPending}
              >
                {isPending ? <Loader /> : t("save")}
              </ButtonLink>
            </form>

            {isStaff && (
              <ButtonLink size={"small"} href="/staff" className="mt-4">
                {t("staffSpace")}
              </ButtonLink>
            )}

            {isStandist && (
              <ButtonLink size={"small"} href="/standists" className="mt-4">
                {t("standistSpace")}
              </ButtonLink>
            )}

            <ButtonLink
              type={"button"}
              size={"small"}
              bg={"dangerous"}
              onClick={() => mutate()}
              className={"mt-4 text-lg"}
            >
              {t(i18nKeyButton)}
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
            <CreateAccountForm />
            <p className="mt-4">{t("alreadyHaveAccount")}</p>
            <ButtonLink size={"small"} href="/login" className="mt-2">
              {t("loginThere")}
            </ButtonLink>
          </div>
        </>
      )}

      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className={"flex flex-col items-center"}>
          <h1 className={"text-2xl"}>{t("language.title")}</h1>
          <h1 className={"text-xl"}>{t("language.description")}</h1>
          <div className={"flex flex-row gap-2 pt-2"}>
            <button onClick={() => changeLanguage("en")}>
              <img
                src={enFlag}
                alt={"english flag"}
                className={`h-10 w-16 rounded-sm ${
                  i18n.language === "en" ? "border-2 border-blue-500" : ""
                }`}
              />
            </button>
            <button onClick={() => changeLanguage("fr")}>
              <img
                src={frFlag}
                alt={"french flag"}
                className={`h-10 w-16 rounded-sm ${
                  i18n.language === "fr" ? "border-2 border-blue-500" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className={"text-center text-2xl"}>{t("analyticsOptOut.title")}</h1>
        <p className={"py-2 text-sm text-gray-700"}>
          {t("analyticsOptOut.description")}
        </p>
        <AnalyticsOptOut />
      </div>
    </div>
  );
}
