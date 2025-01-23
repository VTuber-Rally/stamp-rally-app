import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header.tsx";
import { useRallySubmit } from "@/lib/hooks/useRallySubmit.ts";
import QRCode from "react-qr-code";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useTranslation } from "react-i18next";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { stampsToCollect } from "@/lib/consts.ts";
import { useUser } from "@/lib/hooks/useUser.ts";
import { CreateAccountForm } from "@/components/createAccountForm.tsx";

export const Route = createFileRoute("/_rallyists/_withUserProvider/submit")({
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
            <hr className={"w-full mb-2"} />

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
            <hr className={"w-full my-2"} />
            <h1 className={"text-2xl pb-2"}>{t("submissions")}</h1>
          </>
        )}
        <div className="divide-y divide-gray-300">
          {submissions
            .filter((e) => !e.redeemed)
            .map((submission) => (
              <div
                className="flex flex-col grow items-center justify-center gap-4 py-2"
                key={submission.submissionId}
              >
                <div>
                  {t("alreadySubmitted", {
                    date: submission.submitted.toLocaleString(),
                  })}{" "}
                </div>

                <QRCode
                  className="border-4 rounded-lg border-tertiary p-2 dark:bg-white"
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
            <hr className={"w-full my-2"} />
            <h1 className={"text-2xl"}>{t("redeemedSubmissions")}</h1>
            <ol className={"flex flex-col items-center list-disc"}>
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
            <hr className={"w-full my-2"} />
            <CreateAccountForm />
          </>
        )}
      </>
    );
  }

  return (
    <div className={"flex flex-col grow items-center"}>
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
          "text-center text-black w-full flex justify-center items-center rounded-xl font-bold h-12 text-2xl mt-1 bg-secondary-light"
        }
        onClick={handleSubmit}
      >
        {t("submit")}
      </button>
    </>
  );
};
