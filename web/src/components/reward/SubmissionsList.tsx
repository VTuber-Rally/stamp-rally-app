import clsx from "clsx";
import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { HorizontalBar } from "@/components/layout/HorizontalBar.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { premiumRewardMinStampsRequirement } from "@/lib/consts.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import {
  orangeTriangleEmphasis,
  pinkSquareEmphasis,
} from "@/lib/transComponentSets.tsx";

export const SubmissionsList: FC = () => {
  const { t, i18n } = useTranslation();
  const { data: submissions, isPending } = useRallySubmissions();

  if (isPending) return <ShadowBox>{t("loading")}</ShadowBox>;

  if (!submissions) return <ShadowBox>{t("error")}</ShadowBox>;

  const pendingSubmissions = submissions.filter((e) => !e.redeemed);
  const redeemedSubmissions = submissions.filter((e) => e.redeemed);

  return (
    <ShadowBox>
      {submissions.length === 0 && (
        <>
          <p>{t("submissionsGoesHere")}</p>
        </>
      )}

      {pendingSubmissions.length !== 0 && (
        <>
          <div className="divide-y divide-gray-300">
            {pendingSubmissions.map((submission) => (
              <div
                className="flex grow flex-col items-center justify-center gap-4 py-2"
                key={submission.submissionId}
              >
                <p className="text-center">
                  <Trans
                    t={t}
                    i18nKey="alreadySubmitted"
                    values={{
                      date: submission.submitted.toLocaleString(i18n.language, {
                        dateStyle: "full",
                        timeStyle: "short",
                      }),
                      count: submission.stamps.length,
                    }}
                    components={{
                      ...(submission.stamps.length >=
                      premiumRewardMinStampsRequirement
                        ? pinkSquareEmphasis
                        : orangeTriangleEmphasis),
                      br: <br />,
                    }}
                  />
                </p>

                <QRCode
                  className={clsx(
                    "rounded-lg border-4 p-2 dark:bg-white",
                    submission.stamps.length >=
                      premiumRewardMinStampsRequirement && "border-tertiary",
                    submission.stamps.length <
                      premiumRewardMinStampsRequirement &&
                      "border-success-orange",
                  )}
                  value={submission.submissionId}
                />

                <p className={"text-center font-semibold"}>
                  {t("showThisQRCodeToSubmit")}
                </p>
                <p className="text-center font-extralight opacity-75">
                  {t("submitTerms")}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {pendingSubmissions.length > 0 && redeemedSubmissions.length > 0 && (
        <HorizontalBar />
      )}

      {redeemedSubmissions.length > 0 && (
        <>
          <h2 className={"mb-4 text-xl font-semibold"}>
            {t("redeemedSubmissions")}
          </h2>
          <ol className={"flex list-disc flex-col items-center"}>
            {redeemedSubmissions.map((submission) => (
              <li key={submission.id}>
                {submission.submitted.toLocaleString()}
              </li>
            ))}
          </ol>
        </>
      )}
    </ShadowBox>
  );
};
