import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import Loader from "@/components/Loader";
import { getContestEligibility } from "@/lib/hooks/useContest";
import { useDatabase } from "@/lib/hooks/useDatabase";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/code",
)({
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
  component: CodePage,
});

function CodePage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getOwnSubmissions } = useDatabase();

  //   // Récupérer le secret de l'URL
  const { secret } = Route.useSearch();

  useEffect(() => {
    async function checkEligibility(userId: string) {
      const submissions = await getOwnSubmissions(userId);

      const eligibility = await getContestEligibility(submissions);

      if (!secret) {
        toast({
          title: t("contest.error"),
          description: t("contest.missingSecret"),
        });
        navigate({
          to: "/reward/contest",
        });
        return;
      }

      // Si l'utilisateur n'est pas éligible
      if (!eligibility?.eligible) {
        navigate({
          to: "/reward/contest/not-eligible",
        });
        return;
      }

      // Si l'utilisateur a un nom d'utilisateur, rediriger vers entry
      if (user?.name) {
        navigate({
          to: "/reward/contest/entry",
          search: { secret },
        });
      } else {
        // Sinon, rediriger vers contact
        navigate({
          to: "/reward/contest/contact",
          search: { secret },
        });
      }
    }
    if (user?.$id) {
      checkEligibility(user.$id);
    }
  }, [navigate, secret, t, toast, user?.name]);

  return (
    <div className={"flex h-dvh flex-col pb-16"}>
      <div className="flex grow items-center justify-center">
        <div className={"flex flex-col items-center"}>
          <Loader />
        </div>
      </div>
    </div>
  );
}
