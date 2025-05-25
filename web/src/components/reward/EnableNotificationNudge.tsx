import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import {
  arePushNotificationsEnabled,
  enablePushNotifications,
  ignoreCTA,
  isCTAIgnored,
} from "@/lib/pushNotifications.ts";

export const EnableNotificationNudge: FC = () => {
  const { t } = useTranslation();

  const [mount, setMount] = useState(
    !(arePushNotificationsEnabled() || isCTAIgnored()),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isError, setIsError] = useState(false);

  const onClick = () => {
    setIsError(false);
    setIsDone(false);
    setIsLoading(true);
    enablePushNotifications()
      .then(
        (pushNotificationsEnabled) => {
          if (pushNotificationsEnabled) {
            setIsDone(true);
          } else {
            setIsError(true);
          }
        },
        () => {
          setIsError(true);
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!mount) return null;

  return (
    <ShadowBox>
      <h2 className="mb-4 text-xl font-semibold">
        {t("notifications.nudge.title")}
      </h2>
      <p className="text-gray-700">{t("notifications.nudge.description")}</p>
      <ButtonLink
        type="button"
        onClick={onClick}
        size="small"
        disabled={isLoading || isDone}
      >
        {isDone && t("notifications.nudge.done")}
        {isLoading && t("loading")}
        {isError && t("error")}
        {!isError && !isDone && !isLoading && t("notifications.nudge.button")}
      </ButtonLink>
      <p className="mt-2 text-xs text-gray-600">
        {t("notifications.nudge.reminder")}{" "}
        <button
          onClick={() => {
            ignoreCTA();
            setMount(false);
          }}
          className="cursor-pointer text-gray-950"
        >
          {t("notifications.nudge.ignore")}
        </button>
      </p>
    </ShadowBox>
  );
};
