import { useAction } from "convex/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { convexPublicApi } from "@/lib/convex";
import { useToast } from "@/lib/hooks/useToast";

export const useContestSecret = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const resetSecretMutation = useAction(
    convexPublicApi.contest.resetContestSecret,
  );

  const resetContestSecret = async () => {
    setIsLoading(true);
    try {
      await resetSecretMutation();
      toast({
        title: t("contest.staff.secret.updated.title"),
        description: t("contest.staff.secret.updated.description"),
      });
    } catch (err) {
      console.error("Failed to reset contest secret", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { resetContestSecret, isLoading };
};
