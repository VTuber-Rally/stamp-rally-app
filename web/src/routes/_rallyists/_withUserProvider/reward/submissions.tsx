import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CreateAccountForm } from "@/components/forms/CreateAccountForm.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { ShadowBox } from "@/components/layout/ShadowBox.tsx";
import { EnableNotificationNudge } from "@/components/reward/EnableNotificationNudge.tsx";
import { SubmissionsList } from "@/components/reward/SubmissionsList.tsx";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/submissions",
)({
  component: Submissions,
});

function Submissions() {
  const { user } = useUser();
  const { data: submissions } = useRallySubmissions();
  const { t } = useTranslation();

  return (
    <div className={"flex grow flex-col items-center"}>
      <Header>{t("submissions")}</Header>

      <div className="flex flex-col gap-3">
        {!!submissions?.length && <EnableNotificationNudge />}
        <SubmissionsList />
        {!user?.email && (
          <ShadowBox>
            <CreateAccountForm />
          </ShadowBox>
        )}
      </div>
    </div>
  );
}
