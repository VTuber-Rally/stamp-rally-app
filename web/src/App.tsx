import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient.ts";
import { router } from "@/router.tsx";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ToastAction } from "@/components/Toast.tsx";
import { Trans, useTranslation } from "react-i18next";

import { QRDrawerContextProvider } from "@/context/QRDrawerContextProvider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const LIMIT_DATE = new Date(import.meta.env.VITE_EVENT_END_DATE);

export function App() {
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

  const [isEventFinished, setIsEventFinished] = useState(
    new Date() > LIMIT_DATE,
  );

  const ExpiredBlock = (
    <div className={"h-dvh flex flex-col pb-16"}>
      <div className="flex-grow flex items-center justify-center">
        <div className={"flex flex-col items-center"}>
          <h1 className="text-2xl font-bold">{t("eventIsFinished.title")}</h1>
          <p className="mt-4">{t("eventIsFinished.description")}</p>

          <hr className={"w-1/2 my-4"} />
          <button
            onClick={() => setIsEventFinished(false)}
            className="text-gray-800 opacity-40"
          >
            {t("ignore")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <QRDrawerContextProvider>
          <div className="min-h-dvh md:max-w-md md:mx-auto">
            {isEventFinished ? (
              ExpiredBlock
            ) : (
              <RouterProvider router={router} />
            )}
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </QRDrawerContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
