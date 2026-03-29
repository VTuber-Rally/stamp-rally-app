import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { firebaseConfig, firebaseVapidPublicKey, isDev } from "@/lib/consts.ts";
import { convexPublicApi } from "@/lib/convex.ts";
import { convex } from "@/lib/convexClient.ts";
import { toast } from "@/lib/hooks/useToast.ts";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";

const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);

export const registerToFCM = async () => {
  const serviceWorkerRegistration =
    await navigator.serviceWorker.getRegistration("/");

  if (!serviceWorkerRegistration) {
    throw new Error("Cannot register to FCM: no service worker is present");
  }

  const token = await getToken(messaging, {
    vapidKey: firebaseVapidPublicKey,
    serviceWorkerRegistration,
  });

  if (isDev) {
    console.info("FCM registration token:", token);
  }

  onMessage(messaging, (payload) => {
    toast({
      title: payload.notification?.title,
      description: payload.notification?.body,
    });
  });

  const previousToken = window.localStorage.getItem(
    LOCAL_STORAGE_KEYS.FCM_REGISTRATION_TOKEN,
  );
  if (previousToken && previousToken !== token) {
    void convex.action(
      convexPublicApi.notifications.unsubscribeFromNotifications,
      {
        token: previousToken,
      },
    );
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.FCM_REGISTRATION_TOKEN, token);
  return token;
};
