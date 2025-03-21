import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { CreateAccountForm } from "@/components/forms/CreateAccountForm.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { stampsToCollect } from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useRallySubmit } from "@/lib/hooks/useRallySubmit.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/submit",
)({
  component: Submit,
});

function Submit() {
  const { user } = useUser();
  const { isPending, isSuccess, isError, error, mutate } = useRallySubmit();
  const { data: stamps } = useCollectedStamps();
  const { t } = useTranslation();

  const isEligible = (stamps?.length ?? 0) >= stampsToCollect;

  const handleSubmit = () => {
    mutate();
  };

  const { data: submissions } = useRallySubmissions();

  const showUserInfos = user?.name || user?.email;

  if (submissions && submissions.length > 0) {
    return (
      <>
        <Header>{t("submit")}</Header>

        {showUserInfos && (
          <h3>
            {user?.name && t("hi_username", { name: user.name })}{" "}
            {user.email && `(${user?.email})`}
          </h3>
        )}

        {isEligible && (
          <>
            <hr className={"mb-2 w-full"} />

            <div className={"flex flex-col justify-center gap-4"}>
              {isPending && <p>{t("submitting")}</p>}
              {isError && error && <p>{error.message}</p>}
              {!isPending && !isSuccess && !isError && (
                <SubmitBlock handleSubmit={handleSubmit} />
              )}
            </div>
          </>
        )}

        {submissions.filter((e) => !e.redeemed).length !== 0 && (
          <>
            <hr className={"my-2 w-full"} />
            <h1 className={"pb-2 text-2xl"}>{t("submissions")}</h1>
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
            <h1 className={"text-2xl"}>{t("redeemedSubmissions")}</h1>
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

        {!user?.email && (
          <>
            <hr className={"my-2 w-full"} />
            <CreateAccountForm />
          </>
        )}
      </>
    );
  }

  return (
    <div className={"flex grow flex-col items-center"}>
      <Header>{t("submit")}</Header>

      {showUserInfos && (
        <h3>
          {user?.name && t("hi_username", { name: user.name })}{" "}
          {user.email && `(${user?.email})`}
        </h3>
      )}

      <div className={"flex flex-col justify-center gap-4"}>
        {isPending && <p>{t("submitting")}</p>}
        {isError && error && <p>{error.message}</p>}
        {!isPending && !isSuccess && !isError && isEligible && (
          <SubmitBlock handleSubmit={handleSubmit} />
        )}
        {!isEligible ? (
          <p>{t("submitNotAllowed", { stamps: stampsToCollect })}</p>
        ) : null}
      </div>
    </div>
  );
}

const SubmitBlock = ({ handleSubmit }: { handleSubmit: VoidFunction }) => {
  const { t } = useTranslation();

  return (
    <>
      <p className={"text-xl"}>{t("submitStamps")}</p>
      <button
        className={
          "mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-secondary-light text-center text-2xl font-bold text-black"
        }
        onClick={handleSubmit}
      >
        {t("submit")}
      </button>
    </>
  );
};
