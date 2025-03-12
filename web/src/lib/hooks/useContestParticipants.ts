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
    queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS],
    queryFn: () => fetchContestParticipants(),
    // au cas où, juste in case, voilà
    refetchInterval: 30000,
  });
}
