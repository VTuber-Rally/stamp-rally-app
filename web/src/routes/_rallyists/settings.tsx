import { zodResolver } from "@hookform/resolvers/zod";
import { captureException } from "@sentry/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import enFlag from "@/assets/languages/en.svg";
import frFlag from "@/assets/languages/fr.svg";
import Loader from "@/components/Loader";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { CreateAccountForm } from "@/components/forms/CreateAccountForm.tsx";
import { Checkbox, RHFCheckbox } from "@/components/inputs/Checkbox.tsx";
import InputField from "@/components/inputs/InputField";
import { Header } from "@/components/layout/Header.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { AnalyticsOptOut } from "@/components/routes/AnalyticsOptOut.tsx";
import { getPrefs, setPref } from "@/lib/appwrite.ts";
import { APPWRITE_PREFERENCES_KEYS } from "@/lib/appwritePreferencesKeys.ts";
import { useCurrentUser } from "@/lib/auth.ts";
import {
  AuthUserLoading,
  AuthenticatedNonAnonymously,
  UnauthenticatedOrAnonymous,
} from "@/lib/authHelpers.tsx";
import { User, convexPublicApi, useDLEMutation } from "@/lib/convex.ts";
import { useLogout } from "@/lib/hooks/useLogout.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useUpdateUsername } from "@/lib/hooks/useUpdateUsername";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";
import {
  arePushNotificationsEnabled,
  disablePushNotifications,
  enablePushNotifications,
} from "@/lib/pushNotifications.ts";

export const Route = createFileRoute("/_rallyists/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useCurrentUser();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const { isLoading, mutate: updateMyProfile } = useDLEMutation(
    useMutation(convexPublicApi.users.updateMyProfile),
  );

  const isStaff = user?.role === "staff";
  const isStandist =
    (["staff", "standist"] as User["role"][]).includes(user?.role) &&
    user?.boothId;

  const [pushNotificationsConsentChecked, setPushNotificationsConsentChecked] =
    useState(arePushNotificationsEnabled());
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      name: user?.name ?? "",
      emailConsent: user?.emailConsent,
    },
    resolver: zodResolver(
      z.object({
        name: z.string().trim().max(50, t("settings.usernameTooLong")),
        emailConsent: z.boolean().optional(),
      }),
    ),
  });

  const onSubmit: Parameters<typeof handleSubmit>[0] = (data) => {
    updateMyProfile(data).then(
      () => toast({ title: t("profile.profileUpdated") }),
      () =>
        toast({
          title: t("error"),
        }),
    );
  };

  return (
    <div className={"flex grow flex-col items-center gap-2"}>
      <Header>{t("settings.title")}</Header>
      <ShadowBox>
        <AuthUserLoading>{t("loading")}</AuthUserLoading>
        <AuthenticatedNonAnonymously>
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
                name="name"
                placeholder={t("name")}
                errors={errors["name"]}
                register={register}
                required={true}
                type="text"
              />
            </div>

            <div className="flex flex-col">
              <p className={"text-lg"}>{t("email")}:</p>
              <pre>{user?.email}</pre>
            </div>

            <div className={"flex items-center"}>
              <Controller
                control={control}
                name="emailConsent"
                render={({ field }) => (
                  <RHFCheckbox {...field} id={"emailConsent"} />
                )}
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
              <label className={"ml-2"} htmlFor={"push-notifications-consent"}>
                {t("consent.pushNotifications")}
              </label>
            </div>

            <ButtonLink
              type="submit"
              size={"medium"}
              bg={"secondary"}
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
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

          {/*<ButtonLink
              type={"button"}
              size={"small"}
              bg={"dangerous"}
              onClick={() => mutate()}
              className={"mt-4 text-lg"}
            >
              {t(i18nKeyButton)}
            </ButtonLink>*/}
        </AuthenticatedNonAnonymously>
        <UnauthenticatedOrAnonymous>
          <CreateAccountForm />
          <p className="mt-4">{t("alreadyHaveAccount")}</p>
          <ButtonLink size={"small"} href="/login" className="mt-2">
            {t("loginThere")}
          </ButtonLink>
        </UnauthenticatedOrAnonymous>
      </ShadowBox>

      <ShadowBox>
        <div className={"flex flex-col items-center"}>
          <h1 className={"text-2xl"}>{t("language.title")}</h1>
          <h1 className={"text-xl"}>{t("language.description")}</h1>
          <div className={"flex flex-row gap-2 pt-2"}>
            <button onClick={() => i18n.changeLanguage("en")}>
              <img
                src={enFlag}
                alt={"english flag"}
                className={`h-10 w-16 rounded-sm ${
                  i18n.language === "en" ? "border-2 border-blue-500" : ""
                }`}
              />
            </button>
            <button onClick={() => i18n.changeLanguage("fr")}>
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
      </ShadowBox>

      <ShadowBox>
        <h1 className={"text-center text-2xl"}>{t("analyticsOptOut.title")}</h1>
        <p className={"py-2 text-sm text-gray-700"}>
          {t("analyticsOptOut.description")}
        </p>
        <AnalyticsOptOut />
      </ShadowBox>
    </div>
  );
}
