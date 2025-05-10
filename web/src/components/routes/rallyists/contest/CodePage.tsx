import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader";
import { db } from "@/lib/db";
import { getContestEligibility } from "@/lib/hooks/contest/useIsEligibleForContest";
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
          return navigate({
            to: "/reward/contest",
          });
        }

        const submissions = await getOwnSubmissions(userId);

        const numbersOfContestParticipations =
          await db.contestParticipations.count();

        const eligibility = getContestEligibility(
          submissions,
          numbersOfContestParticipations,
        );

        if (!eligibility?.eligible) {
          return navigate({
            to: "/reward/contest/not-eligible",
          });
        }

        // If the user has a username, redirect to entry (that means they have both a username and an email)
        if (user?.name) {
          return navigate({
            to: "/reward/contest/entry",
            search: { secret },
          });
        } else {
          // Otherwise, redirect to contact (that means they might have an email but no username)
          return navigate({
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
        return navigate({
          to: "/reward/contest",
        });
      }
    }
    if (user?.$id) {
      void checkEligibility(user.$id);
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
