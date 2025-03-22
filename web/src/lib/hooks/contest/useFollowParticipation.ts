import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RealtimeResponseEvent } from "appwrite";
import { useEffect } from "react";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { client, databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";
import { db } from "@/lib/db";
import { useUser } from "@/lib/hooks/useUser";
import { ContestParticipant } from "@/lib/models/ContestParticipant";

export const useFollowParticipation = () => {
  const { user } = useUser();

  const getCurrentParticipationId = async () => {
    if (!user) {
      return undefined;
    }

    const participations = await db.contestParticipations.toArray();
    const undrawerParticipations = participations.filter(
      (p) => p.drawnDate === undefined,
    );

    // safety check
    if (undrawerParticipations.length > 1) {
      console.log("what");
      throw new Error("contest.registration.error");
    }

    const participation = await db.contestParticipations
      .orderBy("submittedAt")
      .last();

    if (participation?.drawnDate) {
      return undefined;
    }

    return participation?.id;
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${contestParticipantsCollectionId}.documents`,
      (response: RealtimeResponseEvent<ContestParticipant>) => {
        // normalement on devrait avoir le droit de voir seulement sa soumission
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update",
          )
        ) {
          console.log("participation event");
          console.log(response.payload);

          db.contestParticipations.update(response.payload.id, {
            isWinner: response.payload.isWinner,
            drawnDate: response.payload.drawnDate,
          });

          // Invalider la requête pour forcer un rechargement
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS],
          });
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const {
    data: currentParticipation,
    isPending: isCurrentParticipationPending,
  } = useQuery({
    queryKey: [QUERY_KEYS.CONTEST_CURRENT_PARTICIPATION, "appwrite"],
    queryFn: async () => {
      // get participation id
      const participationId = await getCurrentParticipationId();

      if (!participationId) {
        return undefined;
      }

      // get submission
      const submission = await databases.getDocument<ContestParticipant>(
        databaseId,
        contestParticipantsCollectionId,
        participationId,
      );
      return submission;
    },
    enabled: !!user,
  });

  // useEffect(() => {
  //   // when participation is updated from Appwrite, update the local db
  //   if (currentParticipation) {
  //     db.contestParticipations.update(currentParticipation.id, {
  //       isWinner: currentParticipation.isWinner,
  //       drawnDate: currentParticipation.drawnDate,
  //     });
  //   }
  // }, [currentParticipation]);

  const { data: currentParticipationId, isPending } = useQuery({
    queryKey: [QUERY_KEYS.CONTEST_CURRENT_PARTICIPATION],
    queryFn: () => getCurrentParticipationId(),
    // au cas où, juste in case, voilà
    refetchInterval: 30000,
  });

  return {
    getCurrentParticipationId,
    currentParticipationId,
    isPending,
    currentParticipation,
    isCurrentParticipationPending,
  };
};
