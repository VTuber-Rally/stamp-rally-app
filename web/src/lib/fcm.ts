import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { registerPushTarget } from "@/lib/appwrite.ts";
import { firebaseConfig, firebaseVapidPublicKey, isDev } from "@/lib/consts.ts";
import { toast } from "@/lib/hooks/useToast.ts";

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
    console.log("FCM registration token:", token);
  }

  onMessage(messaging, (payload) => {
    toast({
      title: payload.notification?.title,
      description: payload.notification?.body,
    });
  });

  await registerPushTarget(token).catch(console.error);
};
