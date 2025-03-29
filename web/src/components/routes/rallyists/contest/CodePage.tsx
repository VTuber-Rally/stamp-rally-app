import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader";
import { getContestEligibility } from "@/lib/hooks/contest/useRegisterContestParticipant.ts";
import { useDatabase } from "@/lib/hooks/useDatabase";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export function CodePage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getOwnSubmissions } = useDatabase();
  const { secret } = useSearch({
    from: "/_rallyists/_withUserProvider/reward/contest/code",
  });

  useEffect(() => {
    async function checkEligibility(userId: string) {
      try {
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

        const submissions = await getOwnSubmissions(userId);

        const eligibility = await getContestEligibility(submissions);

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
      } catch (error) {
        console.error("Error checking contest eligibility:", error);
        toast({
          title: t("contest.error"),
          description: t("error.unknown"),
        });
        navigate({
          to: "/reward/contest",
        });
      }
    }
    if (user?.$id) {
      checkEligibility(user.$id);
    }
  }, [getOwnSubmissions, navigate, secret, t, toast, user?.$id, user?.name]);

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
