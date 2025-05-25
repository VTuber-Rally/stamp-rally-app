import { FC } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { HorizontalBar } from "@/components/layout/HorizontalBar.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";

export const SubmissionsList: FC = () => {
  const { t } = useTranslation();
  const { data: submissions, isPending } = useRallySubmissions();

  if (isPending) return <ShadowBox>{t("loading")}</ShadowBox>;

  if (!submissions) return <ShadowBox>{t("error")}</ShadowBox>;

  if (!submissions.length) return null;

  const pendingSubmissions = submissions.filter((e) => !e.redeemed);
  const redeemedSubmissions = submissions.filter((e) => e.redeemed);

  return (
    <ShadowBox>
      {pendingSubmissions.length !== 0 && (
        <>
          <h2 className={"mb-4 text-xl font-semibold"}>{t("submissions")}</h2>
          <div className="divide-y divide-gray-300">
            {pendingSubmissions.map((submission) => (
              <div
                className="flex grow flex-col items-center justify-center gap-4 py-2"
                key={submission.submissionId}
              >
                <div>
                  {t("alreadySubmitted", {
                    date: submission.submitted.toLocaleString(),
                  })}{" "}
                </div>

                <QRCode
                  className="rounded-lg border-4 border-tertiary p-2 dark:bg-white"
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
