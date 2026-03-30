import { captureException } from "@sentry/react";
import i18next, { t } from "i18next";

import { convexPublicApi } from "@/lib/convex.ts";
import { convex } from "@/lib/convexClient.ts";
import { registerToFCM } from "@/lib/fcm.ts";
import { toast } from "@/lib/hooks/useToast.ts";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";

export const isCTAIgnored = () => {
  return (
    (window.localStorage.getItem(LOCAL_STORAGE_KEYS.IGNORE_NOTIFICATIONS) ??
      "false") === "true"
  );
};

export const ignoreCTA = () => {
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.IGNORE_NOTIFICATIONS, "true");
};

export const arePushNotificationsEnabled = () => {
  return (
    (window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
    ) ?? "false") === "true"
  );
};

export const enablePushNotifications = async () => {
  const permissionStatus = await Notification.requestPermission();
  if (permissionStatus !== "granted") {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "false",
    );
    toast({
      title: t("notifications.permissionNotGrantedToast.title"),
      description: t("notifications.permissionNotGrantedToast.description"),
    });
    return false;
  }
  try {
    const token = await registerToFCM();
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "true",
    );
    const activeLanguage = i18next.resolvedLanguage;
    await convex.action(
      convexPublicApi.notifications.subscribeToNotifications,
      {
        language: activeLanguage?.includes("fr") ? "fr" : "en",
        token,
      },
    );
    return true;
  } catch (error) {
    console.error(error);
    captureException(error);
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "false",
    );
    toast({
      title: t("notifications.fcmError.title"),
      description: t("notifications.fcmError.description"),
    });
    return false;
  }
};

export const disablePushNotifications = async () => {
  try {
    const token = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.FCM_REGISTRATION_TOKEN,
    );
    if (!token) {
      // User never registered successfully for notifications
      return true;
    }
    await convex.action(
      convexPublicApi.notifications.unsubscribeFromNotifications,
      {
        token,
      },
    );
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "false",
    );
    return true;
  } catch (error) {
    console.error(error);
    captureException(error);
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "true",
    );
    toast({
      title: t("notifications.fcmError.title"),
      description: t("notifications.fcmError.description"),
    });
    return false;
  }
};
