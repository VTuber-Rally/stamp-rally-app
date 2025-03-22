import { useMutation } from "@tanstack/react-query";

import { functions } from "@/lib/appwrite";

import { registerContestParticipantFunctionId } from "../consts";
import { db } from "../db";
import { SubmissionWithId } from "../models/Submission";

/**
 * Hook pour vérifier l'éligibilité de l'utilisateur pour le concours
 * Vérifie si l'utilisateur a un compte utilisateur valide et des soumissions
 */

export const getContestEligibility = async (
  submissions: SubmissionWithId[],
) => {
  const hasSubmitted = submissions.length >= 1;

  if (!hasSubmitted) {
    return { eligible: false, reason: "not_submitted" };
  }

  return { eligible: true };
};

export const useRegisterContestParticipant = () => {
  return useMutation({
    mutationFn: async (secret: string) => {
      try {
        const result = await functions.createExecution(
          registerContestParticipantFunctionId,
          JSON.stringify({ secret }),
        );

        // {\"status\":\"error\",\"message\":\"contest.registration.alreadyRegistered\",\"error\":\"User has already registered\"}
        type ServerResponse =
          | ({
              status: string;
              message: string;
            } & {
              status: "success";
              contestParticipantId: string;
            })
          | {
              status: "error";
              message: string;
              error: string;
            };

        const data: ServerResponse = JSON.parse(result.responseBody);

        if (data.status === "error") {
          throw new Error(data.error);
        }

        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("contest.registration.error");
      }
    },
    onSuccess: (data) => {
      db.contestParticipations.add({
        id: data.contestParticipantId,
        submittedAt: new Date(),
        isWinner: false,
        drawnDate: undefined,
      });
    },
  });
};

/**
 * Hook pour vérifier si l'utilisateur a gagné au concours
 */
export const useContestWinner = () => {
  // subscribe to the  collection

  return {
    data: null,
    isWinner: false,
    isLoading: false,
    isError: false,
    error: null,
  };
};
