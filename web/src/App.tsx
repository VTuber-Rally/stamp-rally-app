import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { Models } from "appwrite";
import { StrictMode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

import { ToastAction } from "@/components/toasts/Toast.tsx";
import { QRDrawerContextProvider } from "@/contexts/QRDrawerContextProvider.tsx";
import { getAssetsFilesList, storage } from "@/lib/appwrite.ts";
import { assetsBucketId, eventEndDate } from "@/lib/consts.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { router } from "@/router.tsx";

const LIMIT_DATE = new Date(eventEndDate);

// Fonction pour précharger une image
const preloadImage = async (file: Models.File) => {
  try {
    const fileUrl = storage.getFileDownload(assetsBucketId, file.$id);
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    await caches.open("rally-assets").then((cache) => {
      return cache.put(fileUrl, new Response(blob));
    });
  } catch (error) {
    console.error(`Erreur lors du préchargement de l'image ${file}:`, error);
  }
};

export function App() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const preloadAllImages = async () => {
    getAssetsFilesList()
      .then((e) => e.files)
      .then((files) => {
        files.forEach((file: Models.File) => {
          preloadImage(file);
        });
      });
  };

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
        // preload all images
        preloadAllImages();
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
