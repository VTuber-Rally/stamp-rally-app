import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RegisterContestParticipantFunctionResponse } from "shared-lib";

import { functions } from "@/lib/appwrite.ts";
import { registerContestParticipantFunctionId } from "@/lib/consts.ts";
import { db } from "@/lib/db.ts";
import { useToast } from "@/lib/hooks/useToast.ts";

export const useRegisterContestParticipant = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (secret: string) => {
      const result = await functions.createExecution(
        registerContestParticipantFunctionId,
        JSON.stringify({ secret }),
      );

      const data = JSON.parse(
        result.responseBody,
      ) as RegisterContestParticipantFunctionResponse;

      if (data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      db.contestParticipations
        .add({
          id: data.contestParticipantId,
          submittedAt: new Date(),
          isWinner: false,
          drawnDate: undefined,
        })
        .catch((error) => {
          console.error("Error adding contest participation:", error);
          toast({
            title: t("contest.error"),
            description: t("contest.registration.localSaveError"),
          });
        });

      return navigate({
        to: "/reward/contest/success",
      });
    },
    onError: (error: { message: string }) => {
      toast({
        title: t("contest.error"),
        description: t(error.message), // clé i18n server side #moderne #futur
      });

      if (error.message === "contest.registration.noSubmissions") {
        return navigate({
          to: "/reward/contest/not-eligible",
        });
      }
    },
  });
};
