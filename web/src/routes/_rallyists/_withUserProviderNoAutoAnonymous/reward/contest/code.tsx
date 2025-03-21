import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useContestEligibility } from "@/lib/hooks/useContest";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest/code",
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

  // Récupérer le secret de l'URL
  const { secret } = Route.useSearch();

  // Vérifier l'éligibilité de l'utilisateur
  const { data: eligibility, isLoading } = useContestEligibility();

  useEffect(() => {
    if (isLoading) return;

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
  }, [eligibility, isLoading, navigate, secret, t, toast, user?.name]);
}
