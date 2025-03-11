import { useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Header } from "@/components/layout/Header";
import { useRegisterContestParticipant } from "@/lib/hooks/contest/useRegisterContestParticipant";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export function EntryPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useUser();
  const { secret } = useSearch({
    from: "/_rallyists/_withUserProvider/reward/contest/entry",
  });

  const { mutate: registerContestParticipant, isPending } =
    useRegisterContestParticipant();

  const handleRegister = () => {
    if (!secret) {
      toast({
        title: t("contest.error"),
        description: t("contest.missingSecret"),
      });
      return;
    }

    registerContestParticipant(secret);
  };

  return (
    <div className="container mx-auto p-4">
      <Header>{t("contest.entry.title")}</Header>

      <h2 className="mb-4 text-xl font-semibold">
        {t("contest.entry.confirm")}
      </h2>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="mb-2">
          <span className="font-medium">
            {t("contest.entry.name", { name: user?.name || "euh..." })}
          </span>
        </div>
        {user?.email && (
          <div className="mb-2">
            <span className="font-medium">
              {t("contest.entry.email", { email: user.email })}
            </span>
          </div>
        )}
      </div>

      <ButtonLink
        onClick={handleRegister}
        disabled={isPending}
        type="button"
        bg="secondary"
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {t("contest.entry.registering")}
          </span>
        ) : (
          t("contest.entry.register")
        )}
      </ButtonLink>

      <ButtonLink
        href="/reward"
        type="link"
        size="small"
        className="bg-gray-200"
        bg={null}
      >
        {t("cancel")}
      </ButtonLink>
    </div>
  );
}
