import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { Query, client, databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";
import type { ContestParticipant } from "@/lib/models/ContestParticipant";

async function fetchContestParticipants(filterRecentParticipants: boolean) {
  const now = new Date();
  const yesterday = new Date(now); // all my troubles seemed so far away
  yesterday.setDate(yesterday.getDate() - 1);

  // on filtre les participants entre 16h hier et 16h aujourd'hui
  // c'est à dire entre le dernier tirage et le prochain (en théorie)
  const startDate = new Date(yesterday);
  startDate.setHours(16, 0, 0, 0);
  const endDate = new Date(now);
  endDate.setHours(16, 0, 0, 0);

  const response = await databases.listDocuments<ContestParticipant>(
    databaseId,
    contestParticipantsCollectionId,
    [
      Query.isNull("drawnDate"),
      Query.orderAsc("registeredAt"),
      ...(filterRecentParticipants
        ? [
            Query.greaterThanEqual("registeredAt", startDate.toISOString()),
            Query.lessThanEqual("registeredAt", endDate.toISOString()),
          ]
        : []),
    ],
  );
  return response.documents;
}

export function useContestParticipants(filterRecentParticipants: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${contestParticipantsCollectionId}.documents`,
      (response) => {
        // on s'abonne aux événements de création (normal), de mise à jour (c'est surprenant) et de suppression (sait-on jamais, ça peut arriver !)
        // comme ça on invalide pour forcer le refresh de la liste des participants
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.update",
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.delete",
          )
        ) {
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

  return useQuery({
    queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS, filterRecentParticipants],
    queryFn: () => fetchContestParticipants(filterRecentParticipants),
    // au cas où, juste in case, voilà
    refetchInterval: 30000,
  });
}
