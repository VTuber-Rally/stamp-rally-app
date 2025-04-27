import { captureException } from "@sentry/react";
import { t } from "i18next";

import { unregisterPushTarget } from "@/lib/appwrite.ts";
import { registerToFCM } from "@/lib/fcm.ts";
import { toast } from "@/lib/hooks/useToast.ts";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";

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
