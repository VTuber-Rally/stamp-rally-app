import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useRegisterContestParticipant } from "@/lib/hooks/useContest";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest/entry",
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
      <div className="mb-6 flex items-center justify-center rounded-lg bg-blue-50 p-4 text-blue-600">
        <h1 className="text-2xl font-bold">{t("contest.entry.title")}</h1>
      </div>

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

        <button
          onClick={handleRegister}
          disabled={isRegistering || isPending}
          className="w-full rounded-md bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isRegistering || isPending ? (
            <span className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {t("contest.entry.registering")}
            </span>
          ) : (
            t("contest.entry.register")
          )}
        </button>

        <button
          onClick={() => navigate({ to: "/reward/contest" })}
          disabled={isRegistering || isPending}
          className="mt-3 w-full rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
        >
          {t("contest.entry.cancel")}
        </button>
      </div>
    </div>
  );
}
