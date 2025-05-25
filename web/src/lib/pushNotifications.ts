import { captureException } from "@sentry/react";
import i18next, { t } from "i18next";

import { subscribeToTopic, unregisterPushTarget } from "@/lib/appwrite.ts";
import {
  rallyFinishersEnTopicId,
  rallyFinishersFrTopicId,
} from "@/lib/consts.ts";
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
    await registerToFCM();
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "true",
    );
    const activeLanguage = i18next.resolvedLanguage;
    await subscribeToTopic(
      activeLanguage?.includes("fr")
        ? rallyFinishersFrTopicId
        : rallyFinishersEnTopicId,
    );
    return true;
  } catch (error) {
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
    await unregisterPushTarget();
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.PUSH_NOTIFICATIONS_CONSENT,
      "false",
    );
    return true;
  } catch (error) {
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
