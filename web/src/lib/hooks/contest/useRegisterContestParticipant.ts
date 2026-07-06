import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentUser } from "@/lib/auth";
import { convexPublicApi } from "@/lib/convex";
import { useToast } from "@/lib/hooks/useToast";

export const useRegisterContestParticipant = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const user = useCurrentUser();
  const registerMutation = useMutation(
    convexPublicApi.contest.registerParticipant,
  );

  const mutate = async (secret: string) => {
    if (!user || user.isAnonymous) {
      toast({
        title: t("contest.error"),
        description: t("error.unauthenticated"),
      });
      return;
    }

    setIsPending(true);
    try {
      await registerMutation({
        secret,
        name: user.name ?? "",
      });

      await navigate({ to: "/reward/contest/success" });
    } catch (err) {
      const message =
        err instanceof ConvexError ? String(err.data) : "error.unknown";

      toast({
        title: t("contest.error"),
        description: t(message),
      });

      if (message === "contest.registration.noSubmissions") {
        await navigate({ to: "/reward/contest/not-eligible" });
      }
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
