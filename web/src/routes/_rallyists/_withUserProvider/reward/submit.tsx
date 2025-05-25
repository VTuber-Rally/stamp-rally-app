import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CreateAccountForm } from "@/components/forms/CreateAccountForm.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { HorizontalBar } from "@/components/layout/HorizontalBar.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { EnableNotificationNudge } from "@/components/reward/EnableNotificationNudge.tsx";
import { SubmissionsList } from "@/components/reward/SubmissionsList.tsx";
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
  const { data: submissions } = useRallySubmissions();
  const { t } = useTranslation();

  const isEligible = (stamps?.length ?? 0) >= stampsToCollect;

  const canSubmit = isEligible && !isPending && !isSuccess && !isError;

  const handleSubmit = () => {
    mutate();
  };

  const showUserInfos = user?.name || user?.email;
  return (
    <div className={"flex grow flex-col items-center"}>
      <Header>{t("submit")}</Header>

      <div className="flex flex-col gap-3">
        <ShadowBox>
          {showUserInfos && (
            <h3>
              {user?.name && t("hi_username", { name: user.name })}{" "}
              {user.email && `(${user?.email})`}
            </h3>
          )}

          <div className={"flex flex-col justify-center gap-4"}>
            {isPending && <p>{t("submitting")}</p>}
            {isError && error && <p>{error.message}</p>}
            {canSubmit && (
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
            )}
            {!isEligible && (
              <p>{t("submitNotAllowed", { stamps: stampsToCollect })}</p>
            )}
          </div>
        </ShadowBox>

        {!!submissions?.length && <EnableNotificationNudge />}
        <SubmissionsList />
        {!user?.email && (
          <>
            <HorizontalBar />
            <CreateAccountForm />
          </>
        )}
      </div>
    </div>
  );
}
