import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { StrictMode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

import { ToastAction } from "@/components/toasts/Toast.tsx";
import { QRDrawerContextProvider } from "@/contexts/QRDrawerContextProvider.tsx";
import { eventEndDate } from "@/lib/consts.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { router } from "@/router.tsx";

const LIMIT_DATE = new Date(eventEndDate);

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

        // FCM!
        const firebaseConfig = {
          apiKey: "AIzaSyBb4D9QQpeHG2v_7Yxf4DR0rVvD24eMdi0",
          // authDomain: "vtuberstamprally.firebaseapp.com",
          projectId: "vtuberstamprally",
          // storageBucket: "vtuberstamprally.firebasestorage.app",
          messagingSenderId: "689328750745",
          appId: "1:689328750745:web:636031de1e4b3c4d493808",
        };

        const app = initializeApp(firebaseConfig);

        const messaging = getMessaging(app);
        getToken(messaging, {
          vapidKey:
            "BF6S2yLPQbs7Oah2WGvazwMfL6hMo0g_QyAQ3eVQkb1cG4N7o8XJRi0jHMx5J6SvYlBK88Z9uniK9WwqXxWDjiA",
          serviceWorkerRegistration: registration,
        }).then(console.log);

        onMessage(messaging, (payload) => {
          console.log("hello", payload);
        });
      }
    },
  });

  const [isEventFinished, setIsEventFinished] = useState(
    new Date() > LIMIT_DATE,
  );

  const ExpiredBlock = (
    <div className={"flex h-dvh flex-col pb-16"}>
      <div className="flex grow items-center justify-center">
        <div className={"flex flex-col items-center"}>
          <h1 className="text-2xl font-bold">{t("eventIsFinished.title")}</h1>
          <p className="mt-4">{t("eventIsFinished.description")}</p>

          <hr className={"my-4 w-1/2"} />
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
          <div className="min-h-dvh md:mx-auto md:max-w-md">
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
