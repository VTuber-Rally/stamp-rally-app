import { FC } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";

export const SubmissionsList: FC = () => {
  const { t } = useTranslation();
  const { data: submissions, isPending } = useRallySubmissions();

  if (isPending) {
    return t("loading");
  }

  if (!submissions) return;

  return (
    <>
      {submissions.filter((e) => !e.redeemed).length !== 0 && (
        <>
          <hr className={"my-2 w-full"} />
          <h2 className={"pb-2 text-2xl"}>{t("submissions")}</h2>
        </>
      )}
      <div className="divide-y divide-gray-300">
        {submissions
          .filter((e) => !e.redeemed)
          .map((submission) => (
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

      {submissions.filter((e) => e.redeemed).length > 0 && (
        <>
          <hr className={"my-2 w-full"} />
          <h2 className={"text-2xl"}>{t("redeemedSubmissions")}</h2>
          <ol className={"flex list-disc flex-col items-center"}>
            {submissions
              .filter((e) => e.redeemed)
              .map((submission) => (
                <li key={submission.id}>
                  {submission.submitted.toLocaleString()}
                </li>
              ))}
          </ol>
        </>
      )}
    </>
  );
};
