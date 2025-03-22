import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Header } from "@/components/layout/Header";
import { useRegisterContestParticipant } from "@/lib/hooks/useContest";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/entry",
)({
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
  component: EntryPage,
});

function EntryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { secret } = Route.useSearch();
  const [isRegistering, setIsRegistering] = useState(false);

  const { mutate: registerContestParticipant, isPending } =
    useRegisterContestParticipant();

  // Fonction pour gérer l'inscription au concours
  const handleRegister = () => {
    if (!secret) {
      toast({
        title: t("contest.error"),
        description: t("contest.missingSecret"),
      });
      return;
    }

    setIsRegistering(true);

    registerContestParticipant(secret as string, {
      onSuccess: () => {
        navigate({
          to: "/reward/contest/success",
        });
      },
      onError: (error: { message: string }) => {
        toast({
          title: t("contest.error"),
          description: t(error.message), // Utilisation des clés i18n retournées par le serveur
        });
        setIsRegistering(false);

        // Si l'erreur est qu'il n'a pas de soumissions, rediriger vers not-eligible
        if (error.message === "contest.registration.noSubmissions") {
          navigate({
            to: "/reward/contest/not-eligible",
          });
        }
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Header>{t("contest.entry.title")}</Header>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          {t("contest.entry.confirm")}
        </h2>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="mb-2">
            <span className="font-medium">{t("contest.entry.name")}:</span>{" "}
            {user?.name || t("contest.entry.anonymous")}
          </div>
          {user?.email && (
            <div className="mb-2">
              <span className="font-medium">{t("contest.entry.email")}:</span>{" "}
              {user.email}
            </div>
          )}
          <div className="mt-4 text-sm text-gray-500">
            {t("contest.entry.disclaimer")}
          </div>
        </div>

        <ButtonLink
          onClick={handleRegister}
          disabled={isRegistering || isPending}
          type="button"
          bg="secondary"
        >
          {isRegistering || isPending ? (
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
          {t("contest.entry.cancel")}
        </ButtonLink>
      </div>
    </div>
  );
}
