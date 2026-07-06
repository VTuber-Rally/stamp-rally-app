import { useNavigate, useSearch } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader";
import { useCurrentUser } from "@/lib/auth";
import { useIsEligibleForContest } from "@/lib/hooks/contest/useIsEligibleForContest";
import { useToast } from "@/lib/hooks/useToast";

export function CodePage() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { secret } = useSearch({
    from: "/_rallyists/reward/contest/code",
  });

  const { eligibilityData, isPending } = useIsEligibleForContest();

  useEffect(() => {
    if (isPending || isAuthLoading) return;

    if (!isAuthenticated) {
      void navigate({ to: "/reward/contest/not-eligible" });
      return;
    }

    if (!secret) {
      toast({
        title: t("contest.error"),
        description: t("contest.missingSecret"),
      });
      void navigate({ to: "/reward/contest" });
      return;
    }

    if (!eligibilityData?.eligible) {
      void navigate({ to: "/reward/contest/not-eligible" });
      return;
    }

    // If the user has a username, redirect to entry
    if (user?.name) {
      void navigate({ to: "/reward/contest/entry", search: { secret } });
    } else {
      // Otherwise, redirect to contact to fill in name/email
      void navigate({ to: "/reward/contest/contact", search: { secret } });
    }
  }, [
    eligibilityData,
    isPending,
    isAuthLoading,
    isAuthenticated,
    navigate,
    secret,
    t,
    toast,
    user?.name,
  ]);

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
