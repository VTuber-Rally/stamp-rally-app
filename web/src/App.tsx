import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

import { ToastAction } from "@/components/toasts/Toast.tsx";
import { QRDrawerContextProvider } from "@/contexts/QRDrawerContextProvider.tsx";
import { KEY_VALUES } from "@/lib/KeyValues.ts";
import { useKeyValue } from "@/lib/hooks/useKeyValue";
import { useToast } from "@/lib/hooks/useToast.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { router } from "@/router.tsx";

const AppWrapped = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { value: eventEndDate } = useKeyValue<Date>(KEY_VALUES.eventEndDate);

  const [isEventFinishedScreenClosed, setIsEventFinishedScreenClosed] =
    useState(false);
  const isEventFinished = !!eventEndDate && new Date() > eventEndDate;

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
      if (registration) {
        setInterval(
          () => {
            registration.update();
          },
          60 * 10 * 1000,
        );
      }
    },
  });

  const ExpiredBlock = (
    <div className={"flex h-dvh flex-col pb-16"}>
      <div className="flex grow items-center justify-center">
        <div className={"flex flex-col items-center"}>
          <h1 className="text-2xl font-bold">{t("eventIsFinished.title")}</h1>
          <p className="mt-4">{t("eventIsFinished.description")}</p>

          <hr className={"my-4 w-1/2"} />
          <button
            onClick={() => {
              setIsEventFinishedScreenClosed(true);
            }}
            className="text-gray-800 opacity-40"
          >
            {t("ignore")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh md:mx-auto md:max-w-md">
      {isEventFinished && !isEventFinishedScreenClosed ? (
        ExpiredBlock
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
};

export function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <QRDrawerContextProvider>
          <AppWrapped />
          <ReactQueryDevtools initialIsOpen={false} />
        </QRDrawerContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
