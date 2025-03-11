import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { client, databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";
import type { ContestParticipant } from "@/lib/models/ContestParticipant";

async function fetchContestParticipants() {
  const response = await databases.listDocuments<ContestParticipant>(
    databaseId,
    contestParticipantsCollectionId,
  );
  return response.documents;
}

export function useContestParticipants() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // S'abonner aux changements de la collection
    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${contestParticipantsCollectionId}.documents`,
      (response) => {
        // Mettre à jour le cache React Query quand un document est créé, modifié ou supprimé
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
    queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS],
    queryFn: fetchContestParticipants,
    // Rafraîchir toutes les 30 secondes en plus du temps réel
    refetchInterval: 30000,
  });
}
