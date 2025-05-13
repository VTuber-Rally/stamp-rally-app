import { captureException } from "@sentry/react";
import { Trans, useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

import { ToastAction } from "@/components/toasts/Toast.tsx";
import { registerToFCM } from "@/lib/fcm.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";

export function useRegisterAppSW() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { updateServiceWorker } = useRegisterSW({
    onOfflineReady() {
      toast({
        title: t("appIsReady.title"),
        description: (
          <Trans
            t={t}
            i18nKey="appIsReady.description"
            components={{ em: <em /> }}
          />
        ),
      });
    },
    onNeedRefresh() {
      toast({
        title: t("updateTheApp.title"),
        description: t("updateTheApp.description"),
        action: (
          <ToastAction
            altText={t("updateTheApp.a11yDescription")}
            onClick={() => updateServiceWorker()}
          >
            {t("updateTheApp.action")}
          </ToastAction>
        ),
      });
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      setInterval(
        () => {
          registration.update().catch((error) => {
            captureException(error);
            console.warn("Cannot update SW registration", error);
          });
        },
        60 * 10 * 1000,
      );
      if (
        window.localStorage.getItem(
          LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
        ) === "true"
      ) {
        registerToFCM().catch((error) => {
          captureException(error);
          console.warn("Cannot register to FCM", error);
        });
      }
    },
  });
}
