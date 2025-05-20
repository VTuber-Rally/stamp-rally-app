import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink";
import QRCodeLink from "@/components/controls/QRCodeLink";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { stampsToCollect } from "@/lib/consts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";

export const RallyBlock = () => {
  const { t } = useTranslation();
  const { data: stamps, error: stampsError } = useCollectedStamps();
  const { data: submissions, error: submissionsError } = useRallySubmissions();
  const hasSubmitted = !!submissions && submissions.length > 0;

  if (stampsError || submissionsError) {
    return (
      <ShadowBox>
        <p className="text-red-500">{t("errors.dataFetchFailed")}</p>
      </ShadowBox>
    );
  }

  return (
    <ShadowBox>
      <div className="mb-4 flex items-center">
        <Gift className="mr-2 h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">{t("reward.rally.title")}</h2>
      </div>
      <p className="mb-4 text-gray-700">
        {t("reward.rally.description", {
          minimumStampsCount: stampsToCollect,
        })}
      </p>

      <div
        className={clsx(
          "mb-4 rounded-lg p-3 shadow-md",
          stamps
            ? stamps.length >= stampsToCollect
              ? "bg-green-200/30"
              : "bg-red-200/15"
            : "bg-gray-50",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">
            {stamps
              ? t("reward.rally.inProgress", {
                  count: stamps.length,
                  total: stampsToCollect,
                })
              : t("loading")}
          </span>
          <Link
            to="/artists"
            className="hover:text-primary-dark text-sm font-medium text-primary"
          >
            {t("reward.rally.button")}
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <QRCodeLink size="medium" />

        {(stamps && stamps.length >= stampsToCollect) || hasSubmitted ? (
          <ButtonLink
            type="link"
            href="/reward/submit"
            size="medium"
            bg="success-orange"
          >
            {t("requestYourReward")}
          </ButtonLink>
        ) : null}
      </div>
    </ShadowBox>
  );
};
