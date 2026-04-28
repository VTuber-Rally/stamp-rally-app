import clsx from "clsx";
import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { HorizontalBar } from "@/components/layout/HorizontalBar.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { isDev, premiumRewardMinStampsRequirement } from "@/lib/consts.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import {
  orangeTriangleEmphasis,
  pinkSquareEmphasis,
} from "@/lib/transComponentSets.tsx";

export const SubmissionsList: FC = () => {
  const { t, i18n } = useTranslation();
  const submissions = useRallySubmissions();

  if (!submissions) return <ShadowBox>{t("loading")}</ShadowBox>;

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
                key={submission._id}
              >
                <p className="text-center">
                  <Trans
                    t={t}
                    i18nKey="alreadySubmitted"
                    values={{
                      date: new Date(submission._creationTime).toLocaleString(
                        i18n.language,
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        },
                      ),
                      count: submission.stampsCount,
                    }}
                    components={{
                      ...(submission.stampsCount >=
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
                    submission.stampsCount >=
                      premiumRewardMinStampsRequirement && "border-tertiary",
                    submission.stampsCount <
                      premiumRewardMinStampsRequirement &&
                      "border-success-orange",
                  )}
                  value={submission._id}
                />

                {isDev ? (
                  <ButtonLink
                    href={`/staff/submission/${submission._id}`}
                    type="link"
                    size="small"
                  >
                    Go to check
                  </ButtonLink>
                ) : null}

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
              <li key={submission._id}>
                {new Date(submission._creationTime).toLocaleString()}
              </li>
            ))}
          </ol>
        </>
      )}
    </ShadowBox>
  );
};
