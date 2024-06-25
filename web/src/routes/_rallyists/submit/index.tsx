import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header.tsx";
import { useRallySubmit } from "@/lib/hooks/useRallySubmit.ts";
import QRCode from "react-qr-code";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useTranslation } from "react-i18next";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { STAMPS_TO_COLLECT } from "@/assets/stampRequirements.ts";
import { useUser } from "@/lib/userContext.tsx";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField.tsx";
import { Checkbox } from "@/components/Checkbox.tsx";

export const Route = createFileRoute("/_rallyists/submit/")({
  component: Submit,
});

function Submit() {
  const { user } = useUser();
  const { isPending, isSuccess, isError, error, mutate } = useRallySubmit();
  const { data: stamps } = useCollectedStamps();
  const { t } = useTranslation();

  const isEligible = (stamps?.length ?? 0) >= STAMPS_TO_COLLECT;

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
        <div className="divide-y">
          {submissions
            .filter((e) => !e.redeemed)
            .map((submission) => (
              <div
                className="flex flex-col flex-grow items-center justify-center gap-4 py-2"
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

        {!user?.email && <SetEmailNameBlock />}
      </>
    );
  }

  return (
    <div className={"flex flex-col flex-grow items-center"}>
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
          <p>{t("submitNotAllowed", { stamps: STAMPS_TO_COLLECT })}</p>
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
          "text-center text-black w-full flex justify-center items-center rounded-xl font-bold h-12 text-2xl mt-1 bg-secondaryLight"
        }
        onClick={handleSubmit}
      >
        {t("submit")}
      </button>
    </>
  );
};

type EmailNameFormType = {
  name: string;
  email: string;
  consent: boolean;
};

const SetEmailNameBlock = () => {
  const { t } = useTranslation();
  const { user, setName, setEmail, setPref } = useUser();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailNameFormType>();

  const onSubmit = async (data: EmailNameFormType) => {
    console.log(data);
    if (data.name) {
      await setName(data.name);
    }

    if (data.email) {
      await setEmail(data.email);
      if (data.consent) {
        await setPref("consent", true);
      }
    }
  };

  return (
    <>
      <hr className={"w-full my-2"} />
      <div className={"flex flex-col items-center"}>
        <h1>{t("saveSubmissionQuestion")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"flex flex-col items-center"}
        >
          {!user?.name && (
            <InputField
              type={"text"}
              name={"name"}
              placeholder={"Name (optional)"}
              register={register}
              errors={errors["name"]}
              required={false}
            />
          )}

          {!user?.email && (
            <>
              <InputField
                type={"email"}
                name={"email"}
                placeholder={"Email"}
                register={register}
                errors={errors["name"]}
              />

              <div className={"flex items-center"}>
                <Checkbox {...register("consent")} id={"consent"} />
                <label className={"ml-2"} htmlFor={"consent"}>
                  {t("consentToSaveEmail")}
                </label>
              </div>
            </>
          )}

          <button
            className={
              "text-center bg-secondary text-black px-2 w-full flex justify-center items-center rounded-2xl font-bold h-10 text-xl mt-2"
            }
            type={"submit"}
          >
            {t("save")}
          </button>
        </form>
      </div>
    </>
  );
};
