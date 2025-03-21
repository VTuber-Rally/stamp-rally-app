import { skipToken, useMutation, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { functions } from "@/lib/appwrite";
import { useUser } from "@/lib/hooks/useUser";

import { registerContestParticipantFunctionId } from "../consts";
import { useRallySubmissions } from "./useRallySubmissions";

/**
 * Hook pour vérifier l'éligibilité de l'utilisateur pour le concours
 * Vérifie si l'utilisateur a un compte utilisateur valide et des soumissions
 */
export const useContestEligibility = () => {
  const { user } = useUser();

  const { data: submissions } = useRallySubmissions();

  return useQuery({
    queryKey: [QUERY_KEYS.CONTEST_ELIGIBILITY, user?.$id],
    queryFn: submissions
      ? async () => {
          // Vérifier que l'utilisateur est connecté
          if (!user) {
            return { eligible: false, reason: "unauthenticated" };
          }

          const hasSubmitted = submissions.length >= 1;

          if (!hasSubmitted) {
            return { eligible: false, reason: "not_submitted" };
          }

          return { eligible: true };
        }
      : skipToken,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useRegisterContestParticipant = () => {
  return useMutation({
    mutationFn: async (secret: string) => {
      try {
        const result = await functions.createExecution(
          registerContestParticipantFunctionId,
          JSON.stringify({ secret }),
        );

        if (result.responseStatusCode !== 200) {
          throw new Error(result.responseBody);
        }

        return JSON.parse(result.responseBody);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("contest.registration.error");
      }
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
