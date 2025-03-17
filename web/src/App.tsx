import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useState } from "react";
import { useTranslation } from "react-i18next";

import { QRDrawerContextProvider } from "@/contexts/QRDrawerContextProvider.tsx";
import { KEY_VALUES } from "@/lib/KeyValues.ts";
import { useKeyValue } from "@/lib/hooks/useKeyValue";
import { useRegisterAppSW } from "@/lib/hooks/useRegisterAppSW.tsx";
import { queryClient } from "@/lib/queryClient.ts";
import { router } from "@/router.tsx";

const AppWrapped = () => {
  const { t } = useTranslation();
  const { value: eventEndDate } = useKeyValue(KEY_VALUES.eventEndDate);

  useRegisterAppSW();

  const [isEventFinishedScreenClosed, setIsEventFinishedScreenClosed] =
    useState(false);
  const isEventFinished = !!eventEndDate && new Date() > eventEndDate;

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
